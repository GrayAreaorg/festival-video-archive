#!/bin/bash

declare -A playlists

VIDEO_DATA="./data/videos"

while read -r year url; do
    playlists["$year"]="$url"
done < ./bin/playlists.txt

mkdir -p $VIDEO_DATA

for year in "${!playlists[@]}"; do
  mkdir -p $VIDEO_DATA/$year
  echo "Processing playlists $year"
  {
    yt-dlp -r 50K --ignore-errors --write-info-json --skip-download -o "$VIDEO_DATA/$year/%(title)s [%(id)s].%(ext)s" ${playlists[$year]}
  } || {
    echo "Error occurred, but continuing"
  }
done
