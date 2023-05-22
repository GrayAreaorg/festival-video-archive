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
  const jsonArray = lines.map((line) => {
    const trimmed = line.trim();
    const count = trimmed.split(" ")[0];
    const idRx = /\[(.*?)\]/;
    const match = trimmed.match(idRx);
    if (match) return { num: parseInt(count), id: match[1] };
  })
  .filter(Boolean);

  console.log(JSON.stringify({ videos: jsonArray }, null, 2));
});
