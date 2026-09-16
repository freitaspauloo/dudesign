#!/usr/bin/env node
/**
 * Reads drive-upload-cache JSON payloads and uploads via Google Drive MCP HTTP API.
 * Uses GOOGLE_ACCESS_TOKEN env var if set; otherwise expects Cursor MCP auth cookies unavailable here.
 * Primary use: print payloads for agent MCP create_file calls + track results file.
 */
import fs from "fs";
import path from "path";

const CACHE = path.resolve("scripts/drive-upload-cache");
const RESULTS = path.resolve("scripts/drive-upload-results.json");
const MCP_URL = "https://drivemcp.googleapis.com/mcp/v1";

async function mcpCall(method, params, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method, params }),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.result;
}

async function uploadPayload(payload) {
  const token = process.env.GOOGLE_ACCESS_TOKEN || process.env.GOOGLE_DRIVE_ACCESS_TOKEN;
  const args = {
    title: payload.title,
    parentId: payload.parentId,
    contentMimeType: payload.contentMimeType,
    disableConversionToGoogleType: payload.disableConversionToGoogleType,
    base64Content: payload.base64Content,
  };
  if (payload.textContent) {
    delete args.base64Content;
    delete args.contentMimeType;
    delete args.disableConversionToGoogleType;
    args.textContent = payload.textContent;
    args.contentMimeType = "text/plain";
    args.disableConversionToGoogleType = true;
  }
  const result = await mcpCall("tools/call", { name: "create_file", arguments: args }, token);
  return result;
}

async function main() {
  const mode = process.argv[2] || "list";
  const files = fs.readdirSync(CACHE).filter((f) => f.endsWith(".json")).sort();

  if (mode === "list") {
    console.log(JSON.stringify(files));
    return;
  }

  if (mode === "upload-one") {
    const name = process.argv[3];
    const payload = JSON.parse(fs.readFileSync(path.join(CACHE, name), "utf8"));
    const result = await uploadPayload(payload);
    console.log(JSON.stringify({ ok: true, file: name, result }));
    return;
  }

  if (mode === "upload-all") {
    const successes = [];
    const failures = [];
    for (const name of files) {
      try {
        const payload = JSON.parse(fs.readFileSync(path.join(CACHE, name), "utf8"));
        const result = await uploadPayload(payload);
        successes.push({ file: name, id: result?.structuredContent?.id || result?.content?.[0]?.text || result });
        process.stderr.write(`OK ${name}\n`);
      } catch (e) {
        failures.push({ file: name, error: String(e.message || e) });
        process.stderr.write(`FAIL ${name}: ${e.message || e}\n`);
      }
    }
    const summary = { successes: successes.length, failures: failures.length, successList: successes, failureList: failures };
    fs.writeFileSync(RESULTS, JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary));
    return;
  }

  console.error("Usage: node drive-upload-batch.mjs [list|upload-one <file>|upload-all]");
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
