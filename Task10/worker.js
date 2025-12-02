// worker.js
const { parentPort } = require("worker_threads");

// CPU-heavy task function
function heavyComputation() {
  let sum = 0;
  for (let i = 0; i < 1e9; i++) {   // 1 billion iterations
    sum += i;
  }
  return sum;
}

const result = heavyComputation();

// Send result to main thread
parentPort.postMessage(result);
