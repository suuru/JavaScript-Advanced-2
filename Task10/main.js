// main.js
const { Worker } = require("worker_threads");

console.log("Main: Starting worker...");

const worker = new Worker("./worker.js");

// Receive result from worker
worker.on("message", result => {
  console.log("Main: Worker result =", result);
});

// Handle errors
worker.on("error", err => {
  console.error("Worker error:", err);
});

// Optional: detect worker exit
worker.on("exit", code => {
  console.log("Worker exited with code", code);
});
