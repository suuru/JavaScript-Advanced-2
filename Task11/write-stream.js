import fs from 'fs';

// Create a writable stream
const writeStream = fs.createWriteStream('result.txt');

// Some example data to write
const lines = [
  "This is line 1",
  "This is line 2",
  "This is line 3",
  "Streaming makes writing efficient!"
];

// Write each line to the file
lines.forEach(line => {
  writeStream.write(line + "\n");
});

// Close the stream when done
writeStream.end();

// Optional: Notify when writing is finished
writeStream.on('finish', () => {
  console.log("✅ Writing complete. Check result.txt");
});

// Handle any errors
writeStream.on('error', (err) => {
  console.error("❌ Error:", err);
});
