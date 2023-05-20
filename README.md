# Gray Area Festival Video Archive

Live at:
https://grayareaorg.github.io/festival-video-archive/

## TODO

- [ ] Filter by topic list
- [ ] Enhance video metadata by adding more tags (via YouTube)

### Hosting

- [ ] Investigate decentralized storage for videos (IPFS)

## Custom Keys via YouTube Description Field

Used for more fidelity in Video Archive. Extra object keys can added to the YouTube description field with the following criteria:

- Metadata delimiter (6 equals signs) "======"
- `key: value` format
- Append raw metadata to bottom of YouTube Description field
- When parsed in the archive JSON, prepended with `meta_`, for example, `festival_year: 2015` becomes `{ "meta_festival_year" : "2015" }` in the archive json

```
======
featured: <featured person(s), or group>
featured_url: https://www.ruhabenjamin.com
festival_year: 2015
... additional metadata as needed ...
```

## Dev Setup

Using [Tailwind](https://tailwindcss.com/) CLI for CSS generation.

Requirements

  - Node
  - Python

```bash
npm install -D tailwindcss
npx tailwindcss init
```

Run `npm run css-watch` to watch for change and output css to `./dist/output.css`.

Or run `npm run css-build` to output minified css to `./dist/output.css` for production.

Run `python3 -m http.server` to launch local http server

## Scripts

## Compile Archive Database

Compile JSON formatted database to be queried from the front end.

Usage `./bin/compile-db.js source dest`

- `source` A JSON file or folder of JSON files of YouTube metadata scraped from YouTube via ytdlp
- `dest` A destination folder to write the JSON single-file database. Will prompt to confirm overwrite.

## Get YouTube Metadata

Download YouTube metadata in JSON format from single YouTube video, playlist, or playlists.

Usage `./bin/get-youtube-metadata.sh destination`

- `destination` A destination folder to save the JSON data

Example

```
# get all 2021 videos
./bin/get-youtube-metadata.sh https://www.youtube.com/playlist?list=PLm8zJ0HKEJIbQgPDRsUHiawVtahvShN8X ./data/videos/2021/
```

## Get YouTube Subs from Json Data

Download YouTube auto-generated subtitles in English (en) .vtt subtitle format using information existing YouTube JSON metadata (prerequiste). Will create .vtt files alongside source JSON

Usage `./bin/get-all-subs.sh sourceDir`

- `sourceDir` A source folder of YouTube JSON metadata files

## Get YouTube Autogenerated Transcription/Subtitles

Download auto-generated transcription/subtitles in English for given YouTube ID

Usage `./bin/get-youtube-subs.sh youtube_id [dest]`

- `youtube_id` A YouTubeID
- `dest` (optional) .vtt output destination. Default output will be alongside the source.


## Watch

Watch for CSS changes and build output CSS to `./dist/output.css` with TailwindCSS

Usage: `./bin/css-watch.sh`

## Build

Build minified CSS to `./dist/output.css` with TailwindCSS

Usage: `./bin/css-build.sh`

## Generate Wordcount

[wordcount.py](bin/data/wordcount.py)

This script counts the number of words in all the video caption files (`*.vtt`).
It sorts them by frequency and associates them to the corresponding video via video id.

It generates `wordcount.txt`

Usage: `python ./bin/wordcount.py`

