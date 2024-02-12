# Gray Area Festival Video Archive

Live at: https://archive.grayareafestival.io

A filterable archive of videos from the [Gray Area Festival](https://grayareafestival.io), consisting of in-person and virtual conference talks, presentations, and group panels. The videos in the archive are currently hosted on the Gray Area [YouTube Channel](https://www.youtube.com/@grayareaorg), which is currently the source of video metadata.

The archive is built statically with flat-file JSON files and includes english captions for each video, which improves accessibility and encourages filtering, searching, NLP analysis, and/or experimentation with LLMs. Contributions are welcome. These `.vtt` formatted caption files are stored alongside the video metadata JSON in the [data/videos](data/videos/) folder.

Preliminary work has been carried out to allow users to filter videos by various curated topics ordered by the [frequency of key-words](data/wordcount.txt), and [word-count per video](data/wordcount_video_stats.txt) generated from the video captions. View these files in the [data/topics](data/topics/).

This project is open to submissions and suggestions around engaging with this growing collection of content. You are welcome to make a [pull request](https://github.com/GrayAreaorg/festival-video-archive/pulls) or contribute to the [issues](https://github.com/GrayAreaorg/festival-video-archive/issues) for discussion.

DB and caption files will build automatically and deploy to the [dist](https://github.com/GrayAreaorg/festival-video-archive/tree/dist) branch on push to main using the [process-videos.yml](.github/workflows/process-videos.yml) workflow. To test/run locally, see [Sync all data](#sync-all-data).


## LICENSE

This work and all content therin is licensed under a [CC Attribution-NonCommercial-NoDerivatives 4.0 International License](http://creativecommons.org/licenses/by-nc-nd/4.0/)


## Dev Setup

Built Using

- [Node](https://nodejs.org/) v19.8.1
- [AlpineJS](https://alpinejs.dev/) v3.12.0
- [TailwindCSS](https://tailwindcss.com/) v3.3.2
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) v2023.02.17
- [jq](https://stedolan.github.io/jq/) v1.6

Installation

```bash
npm install -D tailwindcss
npx tailwindcss init
```

CSS Build Scripts

- `npm run css-watch` to watch for change and output css to `./dist/output.css`.
- `npm run css-build` to output minified css to `./dist/output.css` for production.

# Scripts

## Sync all data

Download all video data, vtt's, topic lists, and compile json DB.

`./bin/_workflow-local.sh`

Playlist URLs are stored in [playlists.txt](/bin/playlists.txt).

## Generate Topic Lists

[search-caption-string.sh](./bin/search-caption-string.sh)

This script searches for specified query patterns in .vtt files within a source directory, counts the occurrences of each file, and saves the sorted results to an output file.

Example Use:

Find and collate vtt's related to the topic of "software": `./bin/search-caption-string.sh data/videos "software" "programming" "code" "algorhythm" "open source"`

Example Output:

```
  97 data/videos/2015/History of the Future, Art & Technology from 1965 - Yesterday ｜ Casey Reas ｜ The Gray Area Festival [mHox98NFU3o].en.vtt
  72 data/videos/2020/Amelia Winger-Bearskin ｜ Gray Area Festival 2020 [68gwy1W7Duo].en.vtt
  48 data/videos/2016/Situated Systems Panel ｜ Autodesk ｜ The 2016 Gray Area Festival [jTDMOl7MvrU].en.vtt
  47 data/videos/2015/The School of Poetic Computation ｜ Zach Lieberman ｜ The Gray Area Festival 2015 [0F8EZU6B-jE].en.vtt
  43 data/videos/2017/Lauren McCarthy ｜ the 2017 Gray Area Festival [l1qeNMXccvA].en.vtt
  42 data/videos/2020/Ruha Benjamin ｜ Gray Area Festival 2020 Keynote [GISl_8-fbuA].en.vtt
  39 data/videos/2019/Jaron Lanier ｜ Gray Area Festival 2019 Keynote [lsNF4KfmwkY].en.vtt
  ...
```

Save output to file via redirection `>`:

Find and collate vtt's related to the topic of "software": `./bin/search-caption-string.sh data/videos  "software" "programming" "code" "algorhythm" "open source" > data/topics/software.txt`

### Generate All Topic Lists

`./bin/gen-all-topics.sh`

### Topic List Query Arrays

Keywords used to generate the curated topics. Any video with captions containing these key words will be sorted by descending word frequency.

- **AI**: artificial intelligence, ai
- **Art**: art, fine art, gallery
- **Biology**: biology, cell, genetics, evolution, physiology, biochemistry, adaptation, reproduction, biodiversity, microbio, molecular
- **Decolonialism**: decolonialism, neocolonialism, colonial, indigenous, imperialism, sovereignty
- **Design**: design, graphic design, web design, product design
- **Ecology**: ecology, earth, climate change, ecosystem, biodiversity, conservation, environment
- **History**: history, historical, past, era, ancient, civilization, culture, heritage
- **Indigenous Wisdom**: indigenous, wisdom, elder, past, native, heritage, spiritual
- **Machine Learning**: machine learning, ml, neural net
- **Metaverse**: ar, vr, xr, augmented reality, mixed reality, virtual reality, immersive, virtual world
- **Music**: music, song, concert, composition, melody
- **Philosophy**: philosophy, metaphysics, ethics, aesthetic, phenomenology
- **Software**: software, programming, code, algorhythm, open source
- **Systems**: systems, chaos, complexity, modeling, simulation, pattern

## TopicList.txt to JSON

[topic_lists_to_json.js](./bin/topic_lists_to_json.js)

Converts a topic list `.txt` file generated from [search-caption-string.sh](./bin/search-caption-string.sh) to JSON format, readable by the front-end.

Usage: `node bin/topic_lists_to_json.js file.txt > file.json`

Convert entire folder:
```bash
#!/bin/bash
for file in $(find . -type f -name "*.txt"); do
  json_file="${file%.txt}.json"
  node bin/topic_lists_to_json.js "$file" > "$json_file"
done
```

## Generate Wordcount from .vtt Captions

[wordcount.js](./bin/wordcount.js)

Counts the number of words in all the video caption files (`*.vtt`) in a given directory.
It sorts them by frequency and associates them to the corresponding video via video id.

Usage: `node ./bin/wordcount.js srcDirectory outputFile.txt [--include-video-stats]`

`--include-video-stats` (optional) includes the wordcount per video id.


## Compile JSON Archive Database

[compile-db.js](./bin/compile-db.js)

Usage `node ./bin/compile-db.js source dest`

- `source` A JSON file or folder of JSON files of YouTube metadata scraped from YouTube via ytdlp
- `dest` A destination folder to write the JSON single-file database. Will prompt to confirm overwrite.


## Get YouTube Autogenerated Captions

[get-youtube-subs.sh](./bin/get-youtube-subs.sh)

Download auto-generated captions in English for given YouTube ID

Usage `./bin/get-youtube-subs.sh youtube_id [dest]`

- `youtube_id` A YouTubeID
- `dest` (optional) .vtt output destination. Default output will be alongside the source.


## Get YouTube Subs from JSON Data

[get-all-subs.sh](./bin/get-all-subs.sh)

Download YouTube auto-generated subtitles in English (en) .vtt subtitle format using information existing YouTube JSON metadata (prerequiste). Will create .vtt files alongside source JSON

Usage `./bin/get-all-subs.sh sourceDir`

- `sourceDir` A source folder of YouTube JSON metadata files


## Get YouTube Metadata

[get-youtube-metadata.sh](./bin/get-youtube-metadata.sh)

Download YouTube metadata in JSON format from single YouTube video, playlist, or playlists.

Usage `./bin/get-youtube-metadata.sh destination`

- `destination` A destination folder to save the JSON data

Example

```
# get all 2021 videos
./bin/get-youtube-metadata.sh https://www.youtube.com/playlist?list=PLm8zJ0HKEJIbQgPDRsUHiawVtahvShN8X ./data/videos/2021/
```

## Optional Metadata: Custom Keys via YouTube Description Field

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
