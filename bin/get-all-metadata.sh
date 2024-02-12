#!/bin/bash

declare -A playlists

while read -r year url; do
    playlists["$year"]="$url"
done < ./bin/playlists.txt

for year in "${!playlists[@]}"; do
  mkdir -p $1/$year
  echo "Processing playlists $year"
  {
    yt-dlp -r 50K --ignore-errors --write-info-json --skip-download -o "$1/$year/%(title)s [%(id)s].%(ext)s" ${playlists[$year]}
  } || {
    echo "Error occurred, but continuing"
  }
done
