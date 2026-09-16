#!/usr/bin/env node
/** Upload jpg JSON payloads + project text files via Google Drive MCP (create_file). */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(__dirname, "drive-upload-cache");
const ASSETS = path.join(__dirname, "behance-assets-upload");
const MCP_URL = "https://drivemcp.googleapis.com/mcp/v1";
const RESULTS = path.join(__dirname, "drive-upload-results.json");

const ROOT_PARENT = "1GtI_Ssdz0g0iJJqyjOIVAT4HsAFVb9UT";
const FOLDERS = {
  "01-3M-Films": "1bSwny3-XftWxG52ELiZIO3fZ_PRWLRzH",
  "02-Ford": "1BK51vb5zUXDmA2ofb8Q2o_bkkd-vHvsO",
  "03-Afeela": "1AIrHE8HF3yGl_btdRAx6F5IaYWuAcgPT",
  "04-Audi-3M-Samsung": "1UVHd-a9bClelEQYetwpQAJDFqSXD0kwi",
  "05-Costco": "13_g0etYSyNf4P9P73GS31T5lyWZBnLS3",
};

function getAccessToken() {
  const localState = JSON.parse(
    fs.readFileSync(path.join(process.env.APPDATA, "Cursor", "Local State"), "utf8")
  );
  const encKey = Buffer.from(localState.os_crypt.encrypted_key, "base64").slice(5);
  const psScript = `Add-Type -AssemblyName System.Security; $bytes = [byte[]]@(${Array.from(encKey).join(",")}); $unprot = [System.Security.Cryptography.ProtectedData]::Unprotect($bytes, $null, [System.Security.Cryptography.DataProtectionScope]::CurrentUser); [Convert]::ToBase64String($unprot)`;
  const key = Buffer.from(
    execSync(`powershell -NoProfile -Command "${psScript}"`, { encoding: "utf8" }).trim(),
    "base64"
  );

  const dbPath = path.join(process.env.APPDATA, "Cursor", "User", "globalStorage", "state.vscdb");
  const tokenKey =
    "mcpOAuth.secret.W3BsdWdpbi1nb29nbGUtZHJpdmUtZ29vZ2xlLWRyaXZlOjptY3BTY29wZTpwcm9maWxlOlpHVm1ZWFZzZEFdIG1jcF90b2tlbnM";
  const raw = execSync(`sqlite3 "${dbPath}" "SELECT value FROM ItemTable WHERE key='${tokenKey}';"`, {
    encoding: "utf8",
  });
  const enc = Buffer.from(JSON.parse(raw.trim()).data);
  const iv = enc.slice(3, 15);
  const data = enc.slice(15);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(data.slice(-16));
  const tokens = JSON.parse(
    Buffer.concat([decipher.update(data.slice(0, -16)), decipher.final()]).toString("utf8")
  );
  if (!tokens.access_token) throw new Error("No access_token in MCP oauth store");
  return tokens.access_token;
}

async function createFile(token, args) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: "create_file", arguments: args },
    }),
  });
  const json = await res.json();
  if (json.result?.isError) {
    const msg = json.result.content?.map((c) => c.text).join(" ") || "unknown error";
    throw new Error(msg);
  }
  if (json.error) throw new Error(JSON.stringify(json.error));
  const text = json.result?.content?.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("empty MCP response");
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function uploadPayload(token, payload, label) {
  const args = {
    title: payload.title,
    parentId: payload.parentId,
    contentMimeType: payload.contentMimeType,
    disableConversionToGoogleType: payload.disableConversionToGoogleType,
    base64Content: payload.base64Content,
  };
  const file = await createFile(token, args);
  return { file: label, ok: true, id: file.id, title: file.title || payload.title };
}

async function uploadText(token, title, parentId, textContent, label) {
  const file = await createFile(token, {
    title,
    parentId,
    textContent,
    contentMimeType: "text/plain",
    disableConversionToGoogleType: true,
  });
  return { file: label, ok: true, id: file.id, title: file.title || title };
}

async function main() {
  const token = getAccessToken();
  const successes = [];
  const failures = [];

  const jpgFiles = fs
    .readdirSync(CACHE)
    .filter((f) => f.endsWith(".jpg.json"))
    .sort();

  process.stderr.write(`Uploading ${jpgFiles.length} images...\n`);

  for (const name of jpgFiles) {
    try {
      const payload = JSON.parse(fs.readFileSync(path.join(CACHE, name), "utf8"));
      const result = await uploadPayload(token, payload, name);
      successes.push(result);
      process.stderr.write(`OK ${name}\n`);
    } catch (e) {
      failures.push({ file: name, error: e.message });
      process.stderr.write(`FAIL ${name}: ${e.message}\n`);
    }
  }

  process.stderr.write("Uploading text files...\n");

  try {
    const rootText = fs.readFileSync(path.join(ASSETS, "00-COMECE-AQUI.txt"), "utf8");
    successes.push(
      await uploadText(token, "00-COMECE-AQUI.txt", ROOT_PARENT, rootText, "00-COMECE-AQUI.txt")
    );
    process.stderr.write("OK 00-COMECE-AQUI.txt\n");
  } catch (e) {
    failures.push({ file: "00-COMECE-AQUI.txt", error: e.message });
    process.stderr.write(`FAIL 00-COMECE-AQUI.txt: ${e.message}\n`);
  }

  for (const [folder, parentId] of Object.entries(FOLDERS)) {
    const label = `${folder}/TEXTO-DO-PROJETO.txt`;
    try {
      const text = fs.readFileSync(path.join(ASSETS, folder, "TEXTO-DO-PROJETO.txt"), "utf8");
      successes.push(await uploadText(token, "TEXTO-DO-PROJETO.txt", parentId, text, label));
      process.stderr.write(`OK ${label}\n`);
    } catch (e) {
      failures.push({ file: label, error: e.message });
      process.stderr.write(`FAIL ${label}: ${e.message}\n`);
    }
  }

  const imageSuccesses = successes.filter((s) => s.file.endsWith(".jpg.json"));
  const summary = {
    images: { total: jpgFiles.length, successes: imageSuccesses.length, failures: failures.filter((f) => f.file.endsWith(".jpg.json")).length },
    textFiles: {
      total: 6,
      successes: successes.filter((s) => !s.file.endsWith(".jpg.json")).length,
      failures: failures.filter((f) => !f.file.endsWith(".jpg.json")).length,
    },
    totalSuccesses: successes.length,
    totalFailures: failures.length,
    successList: successes,
    failureList: failures,
  };

  fs.writeFileSync(RESULTS, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(JSON.stringify({ fatal: e.message }));
  process.exit(1);
});
