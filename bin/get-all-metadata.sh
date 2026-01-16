#!/usr/bin/env bash

# Usage: ./bin/get-all-metadata.sh destination [year] [browser]
# If year is provided, only process that year. Otherwise process all years.
# If browser is provided, use cookies from that browser (e.g., firefox, chrome, safari)

DEST=$1
FILTER_YEAR=$2
BROWSER=$3

# Build yt-dlp options
YTDLP_OPTS="-r 50K --ignore-errors --write-info-json --skip-download --extractor-args youtube:player_client=web"
if [[ -n "$BROWSER" ]]; then
  YTDLP_OPTS="$YTDLP_OPTS --cookies-from-browser $BROWSER"
  echo "Using cookies from $BROWSER"
fi

# Read playlists into arrays (compatible with older bash versions)
years=()
urls=()
while read -r year url; do
    years+=("$year")
    urls+=("$url")
done < ./bin/playlists.txt

# Process playlists
for i in "${!years[@]}"; do
  year="${years[$i]}"
  url="${urls[$i]}"
  
  # If FILTER_YEAR is set and doesn't match current year, skip
  if [[ -n "$FILTER_YEAR" && "$year" != "$FILTER_YEAR" ]]; then
    continue
  fi
  
  mkdir -p $DEST/$year
  echo "Processing playlists $year"
  {
    yt-dlp $YTDLP_OPTS -o "$DEST/$year/%(title)s [%(id)s].%(ext)s" "$url"
  } || {
    echo "Error occurred, but continuing"
  }
done
