#!/usr/bin/env bash
# Burn styled subtitles into a video for social media (Shorts / Reels / TikTok).
#
# Usage:
#   ./scripts/burn-subs.sh video.mp4 subtitles.srt [output.mp4]
#
# Env overrides:
#   FONT        font name available on your system (default: Arial)
#   FONT_SIZE   ASS point size (default: 20)
#   ALIGN       ASS alignment: 2=bottom-center 5=middle-center 8=top-center (default: 2)
#   MARGIN_V    pixels from edge toward center (default: 150)
#
# Examples:
#   ALIGN=5 ./scripts/burn-subs.sh video.mp4 subs.srt          # center-screen
#   FONT=Impact FONT_SIZE=24 ./scripts/burn-subs.sh v.mp4 s.srt

set -euo pipefail

VIDEO="${1:-}"
SRT="${2:-}"
OUTPUT="${3:-${VIDEO%.*}_subtitled.mp4}"

if [[ -z "$VIDEO" || -z "$SRT" ]]; then
  echo "Usage: $0 <video.mp4> <subtitles.srt> [output.mp4]" >&2
  exit 1
fi

FONT="${FONT:-Arial}"
FONT_SIZE="${FONT_SIZE:-20}"
ALIGN="${ALIGN:-2}"
MARGIN_V="${MARGIN_V:-150}"

# ASS colour: &HAABBGGRR  (AA=00 → opaque)
STYLE="FontName=${FONT},Bold=1,Italic=0,FontSize=${FONT_SIZE},\
PrimaryColour=&H00FFFFFF,\
OutlineColour=&H00000000,\
BackColour=&H80000000,\
BorderStyle=1,Outline=3,Shadow=0,\
Alignment=${ALIGN},MarginV=${MARGIN_V},MarginL=60,MarginR=60"

# ffmpeg's filter graph parser chokes on paths with @, emoji, or spaces.
# Copy SRT to a temp file with a plain ASCII path.
TMPDIR=$(mktemp -d)
trap "rm -rf '$TMPDIR'" EXIT
TMPSRT="$TMPDIR/subs.srt"
cp "$SRT" "$TMPSRT"

echo "→ Burning subtitles from: $SRT"
echo "→ Style: $STYLE"

ffmpeg -y -i "$VIDEO" \
  -vf "subtitles='${TMPSRT}':force_style='${STYLE}'" \
  -c:v libx264 -crf 18 -preset fast \
  -c:a copy \
  "$OUTPUT"

echo "✓ Done: $OUTPUT"
