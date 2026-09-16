#!/usr/bin/env node
/** Emit create_file args JSON for one cache file (stdout). Usage: node emit-drive-args.mjs <cache-json-name> */
import fs from 'fs';
import path from 'path';
const name = process.argv[2];
if (!name) { console.error('missing file'); process.exit(1); }
const p = path.join('scripts/drive-upload-cache', name);
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
const { title, parentId, contentMimeType, disableConversionToGoogleType, base64Content } = j;
process.stdout.write(JSON.stringify({ title, parentId, contentMimeType, disableConversionToGoogleType, base64Content }));
