#!/usr/bin/env node
console.info("Node Version", process.version);

if (!process.argv[3]) {
  console.error("Usage: " + process.argv[1] + " [source] [dest]");
  process.exit();
}

const fs = require("fs");
const readline = require("readline");
const path = require("path");

const jsonSrc = process.argv[2];
const jsonDest = process.argv[3];
const selectedKeys = [
  "aspect_ratio",
  "audio_channels",
  "channel_id",
  "channel_url",
  "description",
  "display_id",
  "duration_string",
  "duration",
  "fps",
  "fulltitle",
  "height",
  "id",
  "playlist_id",
  "playlist_title",
  "playlist",
  "tags",
  "thumbnail",
  "title",
  "upload_date",
  "webpage_url",
  "width",
];
const descMetaDelim = "======\n";

const getAllFiles = (dirPath, fileArray) => {
  const files = fs.readdirSync(dirPath);
  fileArray = fileArray || [];
  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      fileArray = getAllFiles(dirPath + "/" + file, fileArray);
    } else {
      if (path.extname(file) === ".json") {
        fileArray.push(path.join(dirPath, "/", file));
      }
    }
  });
  return fileArray;
};

const saveOutput = (outputJson) => {
  try {
    fs.writeFileSync(jsonDest, JSON.stringify(outputJson));
  } catch (err) {
    console.error(err);
  }
};

const allFiles = getAllFiles(jsonSrc);

let outputJson = { videos: [] };

for (let i = 0; i < allFiles.length; i++) {
  const fileName = allFiles[i];

  var originalJson = JSON.parse(fs.readFileSync(fileName, "utf8"));

  const reduced = Object.keys(originalJson).reduce((obj, key) => {
    if (selectedKeys.includes(key)) obj[key] = originalJson[key];
    return obj;
  }, {});

  // get festival year from file path
  const year = path.parse(path.dirname(fileName)).name;
  reduced.festival_year = year;

  // parse additional metadata in Description
  // example metadata in description field
  // ======
  // featured: <featured person(s) or group in video>
  // featured_url: <featured url>
  // festival_year: <festival year, ie, 2015>
  const descSplit = reduced.description.split(descMetaDelim);
  if (descSplit.length > 1) {
    descSplit[1].split("\n").forEach((str) => {
      const index = str.indexOf(":");
      const first = str.substr(0, index);
      const second = str.substring(index + 1);
      reduced["meta_" + first.trim()] = second.trim();
    });
  }

  // parse small thumbnail
  const thumb196 = originalJson.thumbnails.filter(
    (thumb) => thumb.width === 196
  );
  if (thumb196.length > 0) {
    reduced.thumbnail_small = thumb196[0].url;
  }

  // local .vtt if it exists (generate with `bin/get-all-subs.sh`)
  // get subtile name
  let pathParts = fileName.split("]");
  const sub = `./${pathParts[0]}].en.vtt`;
  if (fs.existsSync(sub)) {
    reduced.subtitlesFile = sub;
  }

  outputJson.videos.push(reduced);
}

// write output
fs.access(jsonDest, fs.constants.F_OK, (err) => {
  if (err) {
    saveOutput(outputJson);
  } else {
    // File exists, prompt user to confirm overwrite
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      `File '${jsonDest}' already exists. Do you want to overwrite it? (y/n) `,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          console.log(`Overwriting file '${jsonDest}'...`);
          saveOutput(outputJson);
        }
        rl.close();
      }
    );
  }
});
