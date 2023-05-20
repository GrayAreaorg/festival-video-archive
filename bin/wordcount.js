#!/usr/bin/env node
console.info('Node Version', process.version);

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// get video id from filename string
function getVideoId(filename) {
  const match = filename.match(/\[(.*?)\]/);
  return match ? match[1] : null;
}

// traverse directory for .vtt files and return collection of wordCount dicts
async function traverseDirectory(directory) {
  const wordCounters = {};
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      Object.assign(wordCounters, await traverseDirectory(entryPath));
    } else if (entry.isFile() && entry.name.endsWith(".vtt")) {
      const videoId = getVideoId(entry.name);
      wordCounters[videoId] = await processVtt(entryPath);
    }
  }
  return wordCounters;
}

// process a .vtt file, counting the words in the file and returning a dict
async function processVtt(filePath) {
  const wordCount = {};
  const data = await readFile(filePath, "utf-8");
  const lines = data.split("\n").slice(4); // remove .vtt preamble at the top
  const tsRx = /\d{2}:\d{2}:\d{2}\.\d{3}/; // timestamp regex
  const uniqueLines = []; // array for processed lines

  // for each line in .vtt
  for (const line of lines) {
    // Skip the line if it's just whitespace or it contains a timestamp
    if (line.trim() === "" || tsRx.test(line)) continue;

    // convert to lowercase
    const lc = line.toLowerCase();

    // pushing the string to the array allows us to check and eliminated duplicate lines
    if (!uniqueLines.includes(lc)) {
      uniqueLines.push(lc);
      // count the words and add them to the wordcount
      const words = lc.match(/\w+/g) || [];
      for (const word of words) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    }
  }

  return wordCount;
}

// merge all the wordCounts
function mergeWordCounters(videoWordCounters) {
  const mergedCounter = {};
  for (const [videoId, wordCounter] of Object.entries(videoWordCounters)) {
    for (const [word, count] of Object.entries(wordCounter)) {
      if (!mergedCounter[word]) {
        mergedCounter[word] = { total: 0, videos: {} };
      }
      mergedCounter[word].total += count;
      mergedCounter[word].videos[videoId] = count;
    }
  }
  return mergedCounter;
}

async function main(directory, outputFile, includeVideoStats) {
  const wordCounters = await traverseDirectory(directory);
  const mergedCounters = mergeWordCounters(wordCounters);

  // sort the total words descending
  const sortedMergedCounter = Object.entries(mergedCounters).sort(
    (a, b) => b[1].total - a[1].total
  );

  let output = "";
  for (const [word, stats] of sortedMergedCounter) {
    // sort the video ids on the wordcount
    const sortedVideoStats = Object.entries(stats.videos).sort(
      (a, b) => b[1] - a[1]
    );

    // construct the videoStats line that includes the word count per video
    const videoStats = sortedVideoStats
      .map(([videoId, count]) => `${videoId}:${count}`)
      .join(",");

    // final line output
    output += includeVideoStats
      ? `${word} ${stats.total} [${videoStats}]\n`
      : `${word} ${stats.total}\n`;
  }

  await writeFile(outputFile, output, "utf-8");
}

if (!process.argv[3]) {
  console.error("Usage: " + process.argv[1] + " directory outputFile.txt [--include-video-stats]");
  process.exit();
}

main(
  process.argv[2],
  process.argv[3],
  process.argv.includes("--include-video-stats")
);
