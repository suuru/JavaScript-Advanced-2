// uppercase-transform.js

const { Transform, pipeline } = require("stream");
const fs = require("fs");

// Create a Transform stream that uppercases all input
const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const upper = chunk.toString().toUpperCase();
    callback(null, upper);
  }
});

// Example: Read from a file (input.txt) and write to output.txt
pipeline(
  fs.createReadStream("input.txt"),
  upperCaseTransform,
  fs.createWriteStream("output.txt"),
  (err) => {
    if (err) console.error("Pipeline failed:", err);
    else console.log("Uppercase transformation complete!");
  }
);
