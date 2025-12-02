// read-large-file.js
const fs = require("fs");
const path = require("path");

// Path to the large file
const filePath = path.join(__dirname, "largefile.txt");

// Create a readable stream
const readStream = fs.createReadStream(filePath, {
  highWaterMark: 64 * 1024 // read in 64KB chunks (default is 64KB)
});

console.log("Reading file:", filePath);

// Track bytes
let totalBytes = 0;

// On receiving data chunk
readStream.on("data", chunk => {
  totalBytes += chunk.length;
  console.log("Received chunk:", chunk.length, "bytes");
});

// When stream finishes
readStream.on("end", () => {
  console.log("\nFinished reading file.");
  console.log("Total bytes read:", totalBytes);
});

// On error
readStream.on("error", err => {
  console.error("Error reading file:", err);
});
