#!/bin/bash
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
BLUE="\033[34m"
RESET="\033[0m"

SOURCE="./data/videos"

# get all videos from festival playlists
echo -e "${GREEN}Get Youtube Metadata for all Playlists${RESET}"
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZ6OtS-D6PUpn4TflgVqi7R" ./data/videos/2023
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIYq6FBpOBHfHchjI0zTYINO" ./data/videos/2022
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIbQgPDRsUHiawVtahvShN8X" ./data/videos/2021
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIaarwTpOzGg4DXXVLWy2GVU" ./data/videos/2020
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZXGbpAdjpIP9cuuJYfOW-F" ./data/videos/2019
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIaNfzV_-f0aYvrpAZAzjhIl" ./data/videos/2018
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIYAk9rAz1CQmE9Pzn8G_hrq" ./data/videos/2017
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZtQ0PqjW341QIWrqPPkQXi" ./data/videos/2016
./bin/get-youtube-metadata.sh "https://www.youtube.com/playlist?list=PLm8zJ0HKEJIZz_vKS1amJguyAEIiTtxjw" ./data/videos/2015

# delete playlist metadata
find . -type f -name "*\[PL*\]*"  -exec rm {} \;

# get all vtt's
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
