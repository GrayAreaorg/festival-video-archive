#!/usr/bin/env node
// console.info('Node Version', process.version);

const fs = require("fs");

if (!process.argv[2]) {
  console.error("Usage: " + process.argv[1] + " topicList.txt");
  process.exit();
}

const path = process.argv[2];

fs.readFile(path, "utf8", (err, data) => {
  if (err) throw err;

  const lines = data.split("\n");
  const jsonArray = lines
    .map((line) => {
      const match = line.match(/(\d+)\s.*\[(\w+)\]/);
      if (match) return { num: parseInt(match[1]), id: match[2] };
    })
    .filter(Boolean);

  console.log(JSON.stringify({ videos: jsonArray, }, null, 2 ));
});
