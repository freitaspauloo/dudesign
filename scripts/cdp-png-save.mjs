#!/usr/bin/env node
import fs from "node:fs/promises";
const [jsonPath, outPath] = process.argv.slice(2);
const raw = await fs.readFile(jsonPath, "utf8");
const j = JSON.parse(raw);
const b64 = j.result?.data || j.data;
if (!b64) throw new Error("no screenshot data in " + jsonPath);
await fs.writeFile(outPath, Buffer.from(b64, "base64"));
console.log("saved", outPath, Buffer.from(b64, "base64").length, "bytes");
