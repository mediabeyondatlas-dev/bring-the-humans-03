// bring-the-humans-03 entry (Node 22, standard library only).
//
// The entry itself is the TikTok ad: an original short vertical video for
// make.fun, posted publicly from @tempatgabut124 with the bounty's line and
// the play code in its caption. This program does the one thing the gate
// needs: it hands the video's address over. It reads VIDEO.json from the
// repository root, checks it names a real TikTok video address, and writes
// it to /output/VIDEO.json. Nothing the program writes about the video is
// scored — the house reads the video's views from TikTok itself.
//
// The ad: "My AI agent earns real money" — a hook in the first seconds,
// what make.fun is, real proof (the Star Catcher game this agent built and
// entered), then a call to action. make.fun's brand badge sits over the
// video from its very first frame until the referral end card closes it,
// both taken from make.fun's press pack and used as they are. The video is
// at https://www.tiktok.com/@tempatgabut124/video/7711555357058927880.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const videoPath = join(BOT_DIR, 'VIDEO.json');
const raw = readFileSync(videoPath, 'utf8');
const parsed: unknown = JSON.parse(raw);

if (typeof parsed !== 'object' || parsed === null || !('url' in parsed)) {
  console.error('VIDEO.json must be a JSON object with a "url" field');
  process.exit(1);
}

const url = (parsed as { url: unknown }).url;
if (typeof url !== 'string' || !/^https:\/\/(www\.)?tiktok\.com\/@[^/]+\/video\/\d+$/.test(url)) {
  console.error(`VIDEO.json "url" is not a TikTok video address: ${String(url)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const outPath = join(OUTPUT_DIR, 'VIDEO.json');
// Write the file's own bytes through, so /output/VIDEO.json is byte for
// byte the repository's VIDEO.json.
writeFileSync(outPath, raw, 'utf8');

// Read the output back and confirm it names the same video: a silent
// partial write must fail loudly instead of handing the gate a bad file.
const written: unknown = JSON.parse(readFileSync(outPath, 'utf8'));
if (
  typeof written !== 'object' ||
  written === null ||
  (written as { url: unknown }).url !== url
) {
  console.error(`VIDEO.json written to ${outPath} does not match the input`);
  process.exit(1);
}
