#!/bin/bash

if [[ $# -eq 0 ]]; then
    echo "Usage: $0 url [destination]"
    exit 1
fi

# $1 can be
#   video_url
#   playlist_url
#   multiple_playlists_url

if [ -n "$2" ]; then
  yt-dlp --ignore-errors --write-info-json --skip-download -o "$2/%(title)s [%(id)s].%(ext)s" $1
else
  yt-dlp --ignore-errors --write-info-json --skip-download -o "./%(playlist)s/%(title)s [%(id)s].%(ext)s" $1
fi
