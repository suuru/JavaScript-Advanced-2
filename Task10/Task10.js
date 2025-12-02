/***************************************************************
 *   JAVASCRIPT CONCURRENCY & MULTITHREADING – ONE CODE PAGE
 *   Covers:
 *   - Single-threaded JS vs multi-threaded runtimes
 *   - Web Workers (browser): dedicated workers + postMessage
 *   - Node.js Worker Threads: CPU-heavy parallel work
 *   - SharedArrayBuffer & Atomics
 *   - Race conditions (conceptual + fix)
 ****************************************************************/


/***************************************************************
 * 1. SINGLE-THREADED JS vs MULTI-THREADED RUNTIME
 * -------------------------------------------------------------
 * JavaScript = ONE thread (one call stack)
 * Browser & Node runtimes = MULTIPLE threads
 * (networking, file I/O, rendering, workers, thread pool...)
 ***************************************************************/

console.log("JavaScript is single-threaded, but the runtime is not.");



/***************************************************************
 * 2. WEB WORKERS (BROWSER)
 * -------------------------------------------------------------
 * This part only works in browser environments.
 * Demonstrates:
 *   - Dedicated worker
 *   - Sending/receiving messages (postMessage)
 ***************************************************************/

// main.js (browser)
/*
const worker = new Worker("worker.js");

// Send data to worker thread
worker.postMessage({ count: 5_000_000 });

// Receive result from worker
worker.onmessage = (e) => {
    console.log("Worker result:", e.data);
};
*/

// worker.js (browser)
/*
onmessage = function (e) {
    let sum = 0;
    for (let i = 0; i < e.data.count; i++) sum += i;
    postMessage(sum); // Send result back
};
*/



/***************************************************************
 * 3. NODE.JS WORKER THREADS
 * -------------------------------------------------------------
 * True multithreading for CPU-heavy tasks.
 * (Run with Node.js only)
 ***************************************************************/

//
// FILE: main-node.js
//
/*
const { Worker } = require("node:worker_threads");

const worker = new Worker("./task.js", {
    workerData: { n: 1e7 }
});

worker.on("message", msg => {
    console.log("Worker thread result:", msg);
});
*/

//
// FILE: task.js
//
/*
const { workerData, parentPort } = require("node:worker_threads");

let sum = 0;
for (let i = 0; i < workerData.n; i++) sum += i;

parentPort.postMessage(sum);
*/



/***************************************************************
 * 4. SHARED MEMORY: SharedArrayBuffer + Atomics
 * -------------------------------------------------------------
 * Workers CAN share memory using SharedArrayBuffer.
 * Atomics ensures thread-safe operations.
 ***************************************************************/

// Shared 4-byte buffer
const sharedBuffer = new SharedArrayBuffer(4);
const sharedView = new Int32Array(sharedBuffer);

// Not atomic (unsafe in multithreaded environment)
sharedView[0] = 0;

// Atomic safe increment (works across worker threads)
Atomics.add(sharedView, 0, 1);

console.log("Shared atomic value:", Atomics.load(sharedView, 0));



/***************************************************************
 * 5. RACE CONDITION DEMO (CONCEPTUAL)
 * -------------------------------------------------------------
 * When multiple workers modify the same shared memory BACK-TO-BACK:
 *
 *   x = x + 1   // NOT ATOMIC
 *
 * Two workers reading and writing at the same time produce wrong results.
 *
 * Atomics.add() solves the race.
 ***************************************************************/

// Wrong (conceptually):
// sharedView[0] = sharedView[0] + 1; // Two workers reading same value → conflict

// Correct:
Atomics.add(sharedView, 0, 1); // Guaranteed safe



/***************************************************************
 * SUMMARY INSIDE THE CODE:
 *
 * • JS = single-threaded execution
 * • Browser & Node = multi-threaded runtimes
 *
 * WEB WORKERS (browser)
 * -----------------------------------
 *  • Run JS in another OS thread
 *  • Communicate using postMessage()
 *  • Cannot access DOM
 *
 * NODE WORKER THREADS
 * -----------------------------------
 *  • Use real threads
 *  • Ideal for CPU-intensive tasks
 *
 * SHARED MEMORY
 * -----------------------------------
 *  • SharedArrayBuffer lets threads share RAM
 *  • Atomics ensures safe operations
 *
 * RACE CONDITIONS
 * -----------------------------------
 *  • Occur when two threads write the same memory unsafely
 *  • Fix with Atomics (atomic read/modify/write)
 *
 ***************************************************************/
