#!/bin/bash
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
BLUE="\033[34m"
RESET="\033[0m"

SOURCE="./data/videos"

# Download Playlists and Subtitles
echo -e "${GREEN}Get Youtube Metadata for all Playlists${RESET}"
./bin/get-all-metadata.sh

# delete playlist metadata
find . -type f -name "*\[PL*\]*"  -exec rm {} \;

# Download Subtitles (VTTs) for all Videos
echo -e "${GREEN}Get VTT's for all videos${RESET}"
./bin/get-all-subs.sh ./data/videos

# count all words in vtt's
echo -e "${GREEN}Generate word counts from VTT's${RESET}"
node ./bin/wordcount.js ./data/videos ./data/wordcount.txt
node ./bin/wordcount.js ./data/videos ./data/wordcount_video_stats.txt --include-video-stats

# generate topic lists for filter search
echo -e "${GREEN}Generate all Topics from VTT's${RESET}"
./bin/gen-all-topics.sh

# compile json db
echo -e "${GREEN}Compile DB's${RESET}"
node ./bin/compile-db.js ./data/videos ./data/db.json
