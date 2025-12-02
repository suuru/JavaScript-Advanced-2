/* 
============================================================
NODE.JS ARCHITECTURE + BUFFERS + STREAMS + I/O (ONE CODE PAGE)
============================================================
This single JS file explains and demonstrates:
- Node.js architecture (libuv, event loop, thread pool)
- Buffers vs Uint8Array
- Streams (Readable, Writable, Duplex, Transform)
- Backpressure
- stream.pipeline
- Streaming vs buffering
- Efficient file & network I/O
------------------------------------------------------------
*/

/*
============================================================
1. NODE.JS ARCHITECTURE
============================================================
Node.js uses:
- **Event Loop** (powered by libuv)
- **Thread Pool** (in libuv for expensive blocking ops)

Event Loop handles:
- timers
- I/O callbacks
- microtasks

Thread Pool handles:
- fs operations
- DNS resolution
- crypto hashing
*/

console.log("Node.js architecture demo running...\n");

/*
============================================================
2. BUFFERS vs UINT8ARRAY
------------------------------------------------------------
Buffer is a Node-specific subclass of Uint8Array with helpers:
- Buffer.from()
- buf.toString()
- buf.write()
*/

const buf = Buffer.from("Hello Node");
console.log("Buffer:", buf, "as string:", buf.toString());

const uint = new Uint8Array([72, 73]); // 'H', 'I'
console.log("Uint8Array:", uint, "string:", Buffer.from(uint).toString());

/*
============================================================
3. STREAMS
------------------------------------------------------------
Types:
- Readable (emits data)
- Writable (consumes data)
- Duplex (read + write)
- Transform (read -> transformed write)

Streams prevent large memory usage.
*/

const { Readable, Writable, Transform, pipeline } = require("stream");
const fs = require("fs");

// Simple Readable stream
testReadable = Readable.from(["A", "B", "C"]);

// Simple Writable stream
const testWritable = new Writable({
  write(chunk, enc, cb) {
    console.log("Writable received:", chunk.toString());
    cb();
  }
});

testReadable.pipe(testWritable);

/*
============================================================
4. TRANSFORM STREAM EXAMPLE
------------------------------------------------------------
*/

const upperCaseTransform = new Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk.toString().toUpperCase());
  }
});

Readable.from(["hello", " ", "world"]) 
  .pipe(upperCaseTransform)
  .pipe(testWritable);

/*
============================================================
5. BACKPRESSURE
------------------------------------------------------------
Writable streams may slow down reads.
We demonstrate using a large file.
------------------------------------------------------------
*/

// Simulated backpressure scenario
const slowWritable = new Writable({
  write(chunk, enc, cb) {
    setTimeout(() => {
      console.log("Slow write:", chunk.length, "bytes");
      cb();
    }, 100); // artificial delay
  }
});

// Readable pushing too fast
const fastReadable = new Readable({
  read() {
    this.push(Buffer.alloc(1024)); // push 1KB
    this.push(null);
  }
});

fastReadable.pipe(slowWritable);

/*
============================================================
6. stream.pipeline — SAFE PIPE WITH ERROR HANDLING
============================================================
*/

pipeline(
  fs.createReadStream(__filename),
  new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    }
  }),
  fs.createWriteStream("copy.js"),
  err => {
    console.log(err ? "Pipeline failed:" : "Pipeline succeeded", err || "");
  }
);

/*
============================================================
7. STREAMING vs BUFFERING
------------------------------------------------------------
- Buffering loads whole file → high memory
- Streaming processes chunks → low memory
Example demonstrates both approaches.
*/

// BUFFERING
const fileBuffer = fs.readFileSync(__filename);
console.log("Buffered file size:", fileBuffer.length);

// STREAMING
let streamedSize = 0;
fs.createReadStream(__filename)
  .on("data", chunk => streamedSize += chunk.length)
  .on("end", () => console.log("Streamed size:", streamedSize));

/* ---------------------------------------------------------
END OF FILE
--------------------------------------------------------- */
