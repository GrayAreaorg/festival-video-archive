#!/usr/bin/env bash
# Usage: ./bin/_workflow-local.sh [year] [browser]
# If year is provided, only process that year. Otherwise process all years.
# If browser is provided, use cookies from that browser (e.g., firefox, chrome, safari)

GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
BLUE="\033[34m"
RESET="\033[0m"

FILTER_YEAR=$1
BROWSER=$2
VIDEO_DATA="./data/videos"

mkdir -p $VIDEO_DATA

# Download Playlists and Subtitles
if [[ -n "$FILTER_YEAR" ]]; then
  echo -e "${GREEN}Get Youtube Metadata for $FILTER_YEAR Playlist${RESET}"
else
  echo -e "${GREEN}Get Youtube Metadata for all Playlists${RESET}"
fi
./bin/get-all-metadata.sh $VIDEO_DATA $FILTER_YEAR $BROWSER

# delete playlist metadata
find . -type f -name "*\[PL*\]*"  -exec rm {} \;

# Download Subtitles (VTTs) for all Videos
echo -e "${GREEN}Get VTT's for all videos${RESET}"
./bin/get-all-subs.sh $VIDEO_DATA

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
