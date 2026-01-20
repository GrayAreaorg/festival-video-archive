#!/usr/bin/env bash
# Usage: ./bin/_workflow-local.sh [year] [browser]
# If year is provided, only process that year. Otherwise process all years.
# If browser is provided, use cookies from that browser (e.g., firefox, chrome, safari)
#
# Options:
#   --year YEAR         Only process specified year (e.g., --year 2025)
#   --browser BROWSER   Use cookies from browser (e.g., --browser firefox)
#
# Examples:
#   ./bin/_workflow-local.sh
#   ./bin/_workflow-local.sh --year 2025
#   ./bin/_workflow-local.sh --browser firefox
#   ./bin/_workflow-local.sh --year 2025 --browser firefox

GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
BLUE="\033[34m"
RESET="\033[0m"

FILTER_YEAR=""
BROWSER=""
VIDEO_DATA="./data/videos"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --year)
      FILTER_YEAR="$2"
      shift 2
      ;;
    --browser)
      BROWSER="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: ./bin/_workflow-local.sh [--year YEAR] [--browser BROWSER]"
      exit 1
      ;;
  esac
done

mkdir -p $VIDEO_DATA

# Build args for get-all-metadata.sh
METADATA_ARGS=()
if [[ -n "$FILTER_YEAR" ]]; then
  METADATA_ARGS+=(--year "$FILTER_YEAR")
fi
if [[ -n "$BROWSER" ]]; then
  METADATA_ARGS+=(--browser "$BROWSER")
fi

# Download Playlists and Subtitles
if [[ -n "$FILTER_YEAR" ]]; then
  echo -e "${GREEN}Get Youtube Metadata for $FILTER_YEAR Playlist${RESET}"
else
  echo -e "${GREEN}Get Youtube Metadata for all Playlists${RESET}"
fi
./bin/get-all-metadata.sh "${METADATA_ARGS[@]}" "$VIDEO_DATA"

# delete playlist metadata
find . -type f -name "*\[PL*\]*"  -exec rm {} \;

# Download Subtitles (VTTs) for all Videos
echo -e "${GREEN}Get VTT's for all videos${RESET}"
if [[ -n "$BROWSER" ]]; then
  ./bin/get-all-subs.sh --browser "$BROWSER" $VIDEO_DATA
else
  ./bin/get-all-subs.sh $VIDEO_DATA
fi

# count all words in vtt's
echo -e "${GREEN}Generate word counts from VTT's${RESET}"
node ./bin/wordcount.js $VIDEO_DATA ./data/wordcount.txt
node ./bin/wordcount.js $VIDEO_DATA ./data/wordcount_video_stats.txt --include-video-stats

# generate topic lists for filter search
echo -e "${GREEN}Generate all Topics from VTT's${RESET}"
./bin/gen-all-topics.sh

# compile json db
echo -e "${GREEN}Compile DB's${RESET}"
node ./bin/compile-db.js ./data/videos ./data/db.json

# compile css
mkdir -p ./dist
npm install
npm run css-build
