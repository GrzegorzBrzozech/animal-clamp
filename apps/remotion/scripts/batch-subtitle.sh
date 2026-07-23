#!/usr/bin/env bash
# Batch subtitle pipeline: transcribe → convert → render → copy back
# Usage: bash scripts/batch-subtitle.sh [language] video1.mp4 video2.mp4 ...
# Default language: uk

set -euo pipefail

LANG="${1:-uk}"
shift

REMOTION="$(cd "$(dirname "$0")/.." && pwd)"
VENV="/Users/gtrofymov/git/clampers/clamp-videos/.venv/bin/mlx_whisper"

process_video() {
  local VIDEO="$1"
  local BASE="$(basename "$VIDEO" .mp4)"
  local ASSETS_DIR="$(dirname "$VIDEO")"
  local VIDEO_PUBLIC="shorts/${BASE}.mp4"

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "▶ Processing: $BASE"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # 1. Extract audio
  echo "[1/4] Extracting audio..."
  ffmpeg -y -i "$VIDEO" -vn -acodec pcm_s16le -ar 16000 -ac 1 /tmp/audio_words_$$.wav 2>/dev/null
  echo "      Done."

  # 2. Transcribe with word timestamps
  echo "[2/4] Transcribing ($LANG, large model)..."
  "$VENV" /tmp/audio_words_$$.wav \
    --language "$LANG" \
    --model mlx-community/whisper-large-mlx \
    --output-dir "$ASSETS_DIR" \
    --output-name "${BASE}_words" \
    --output-format json \
    --word-timestamps True \
    --condition-on-previous-text False \
    --hallucination-silence-threshold 2.0 \
    --temperature 0
  rm -f /tmp/audio_words_$$.wav
  echo "      Saved: $ASSETS_DIR/${BASE}_words.json"

  # 3. Stage video
  echo "[3/4] Staging video + rendering..."
  mkdir -p "$REMOTION/public/shorts"
  cp "$VIDEO" "$REMOTION/public/$VIDEO_PUBLIC"

  PROPS=$(node "$REMOTION/scripts/whisper-json-to-props.mjs" "$ASSETS_DIR/${BASE}_words.json" | node -e "
    const d=require('fs').readFileSync('/dev/stdin','utf8');
    const p=JSON.parse(d);
    console.log(JSON.stringify({videoSrc:'$VIDEO_PUBLIC',subtitles:p.subtitles}));
  ")

  cd "$REMOTION"
  npm run render -- SubtitledShort "/tmp/${BASE}_subtitled.mp4" --props="$PROPS" 2>&1 | grep -E "(Rendering|rendered|error|Error|Done|✓|%)" || true

  # 4. Copy result
  echo "[4/4] Copying result..."
  local RENDER_OUT="$REMOTION/out/SubtitledShort/tmp/${BASE}_subtitled.mp4"
  if [[ -f "$RENDER_OUT" ]]; then
    cp "$RENDER_OUT" "$ASSETS_DIR/${BASE}_subtitled.mp4"
    echo "      ✓ $ASSETS_DIR/${BASE}_subtitled.mp4"
  else
    echo "      ✗ Render output not found at: $RENDER_OUT"
    exit 1
  fi
}

for VIDEO in "$@"; do
  process_video "$VIDEO"
done

echo ""
echo "═══════════════════════════════════════════════"
echo "All done!"
