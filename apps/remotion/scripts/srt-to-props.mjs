#!/usr/bin/env node
// Convert an SRT file to the JSON subtitles array used by the SubtitledShort Remotion composition.
//
// Usage:
//   node scripts/srt-to-props.mjs subtitles.srt
//   node scripts/srt-to-props.mjs subtitles.srt > props.json
//
// Output shape:
//   { "subtitles": [{ "startSec": 1.94, "endSec": 4.96, "text": "..." }, ...] }

import { readFileSync } from 'fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node srt-to-props.mjs <subtitles.srt>');
  process.exit(1);
}

const srtTimeToSec = (t) => {
  const [h, m, rest] = t.trim().split(':');
  const [s, ms] = rest.split(',');
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
};

const srt = readFileSync(file, 'utf8');
const blocks = srt.trim().split(/\n\n+/);

const subtitles = blocks.flatMap((block) => {
  const lines = block.trim().split('\n');
  const ti = lines.findIndex((l) => l.includes('-->'));
  if (ti === -1) return [];
  const [startStr, endStr] = lines[ti].split('-->');
  const text = lines.slice(ti + 1).join(' ').trim();
  if (!text) return [];
  return [{ startSec: srtTimeToSec(startStr), endSec: srtTimeToSec(endStr), text }];
});

console.log(JSON.stringify({ subtitles }, null, 2));
