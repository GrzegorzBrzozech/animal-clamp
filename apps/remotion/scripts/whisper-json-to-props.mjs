#!/usr/bin/env node
// Convert Whisper JSON (with word timestamps) to SubtitledShort props.
//
// Usage:
//   node scripts/whisper-json-to-props.mjs transcription.json
//
// Output shape:
//   { "subtitles": [{ "startSec", "endSec", "text", "words": [{ "word", "startSec", "endSec" }] }] }
//
// Splits at sentence boundaries (. ! ?) and enforces MAX_WORDS per subtitle.

import { readFileSync } from 'fs';

const MAX_WORDS = 8;
const MIN_WORDS_BEFORE_COMMA = 4; // split at comma only if this many words already accumulated

const file = process.argv[2];
if (!file) {
  console.error('Usage: node whisper-json-to-props.mjs <whisper-output.json>');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(file, 'utf8'));
const segments = raw.segments ?? [];

// Flatten all words across all segments
const allWords = segments.flatMap(seg =>
  (seg.words ?? []).map(w => ({
    word: w.word.trim(),
    startSec: w.start,
    endSec: w.end,
  })).filter(w => w.word.length > 0)
);

if (allWords.length === 0) {
  // Fallback: no word timestamps — use segments as-is
  const subtitles = segments.map(seg => ({
    startSec: seg.start,
    endSec: seg.end,
    text: seg.text.trim(),
  }));
  console.log(JSON.stringify({ subtitles }, null, 2));
  process.exit(0);
}

// Merge tokens split at apostrophes ("Обов" + "'язково" → "Обов'язково")
const mergedWords = [];
for (const word of allWords) {
  const prev = mergedWords[mergedWords.length - 1];
  if (prev && /^[''ʼ]/.test(word.word)) {
    prev.word += word.word;
    prev.endSec = word.endSec;
  } else {
    mergedWords.push({ ...word });
  }
}
const wordsToProcess = mergedWords;

// Split into groups at sentence-end punctuation or MAX_WORDS limit
const groups = [];
let current = [];

for (const word of wordsToProcess) {
  current.push(word);
  const isSentenceEnd = /[.!?…»]$/.test(word.word);
  const isComma = /[,;]$/.test(word.word) && current.length >= MIN_WORDS_BEFORE_COMMA;
  if (isSentenceEnd || isComma || current.length >= MAX_WORDS) {
    groups.push([...current]);
    current = [];
  }
}
if (current.length > 0) groups.push(current);

const subtitles = groups.map(words => ({
  startSec: words[0].startSec,
  endSec: words[words.length - 1].endSec,
  text: words.map(w => w.word).join(' '),
  words,
}));

console.log(JSON.stringify({ subtitles }, null, 2));
