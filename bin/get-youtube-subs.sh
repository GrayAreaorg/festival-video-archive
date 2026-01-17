#!/usr/bin/env bash

# Usage: ./bin/get-youtube-subs.sh [--browser BROWSER] <youtube_id> [dest]
#
# Options:
#   --browser BROWSER   Use cookies from browser (e.g., firefox, chrome, safari)
#
# Examples:
#   ./bin/get-youtube-subs.sh abc123 output
#   ./bin/get-youtube-subs.sh --browser firefox abc123 output

BROWSER=""
YTID=""
DEST=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    *)
      if [[ -z "$YTID" ]]; then
        YTID="$1"
      elif [[ -z "$DEST" ]]; then
        DEST="$1"
      fi
      shift
      ;;
  esac
done

if [[ -z "$YTID" ]]; then
  echo "Usage: $0 [--browser BROWSER] youtube_id [dest]"
  exit 1
fi

# Check if VTT already exists
if [[ -n "$DEST" && -f "${DEST}.en.vtt" ]]; then
  echo "Skipping $YTID (VTT exists)"
  exit 0
fi

# Build yt-dlp options
YTDLP_OPTS="--sub-lan=en --write-auto-sub --skip-download"
if [[ -n "$BROWSER" ]]; then
  YTDLP_OPTS="$YTDLP_OPTS --cookies-from-browser $BROWSER"
fi

if [[ -n "$DEST" ]]; then
  yt-dlp $YTDLP_OPTS -o "$DEST" "https://www.youtube.com/watch?v=$YTID"
else
  yt-dlp $YTDLP_OPTS "https://www.youtube.com/watch?v=$YTID"
fi
