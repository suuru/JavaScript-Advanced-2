//--------------------------------------------------------
// Task 7 — BINARY DATA EXPLORER
//-------------------------------------------------------

//ArrayBuffer, TypedArray, and DataView Explained (JavaScript)
// 1. ArrayBuffer — Raw Binary Memory
// 1. ArrayBuffer — Raw Binary Memory
//An ArrayBuffer is a fixed-length chunk of raw binary memory.
// It does not store numbers, strings, or objects directly.
// It is just a block of memory (bytes).
// You cannot read or write to an ArrayBuffer directly.
// Think of it like an empty house—you need tools (TypedArray / DataView) to access the rooms.

// Example:
const buffer = new ArrayBuffer(8); // 8 bytes of raw memory
console.log(buffer.byteLength);    // 8

// 2. TypedArray Views (Uint8Array, Int32Array, Float32Array, etc.)
// TypedArrays are views into an ArrayBuffer.
// This means:
// They do not own memory.
// They just give you a way to interpret the bytes.
// Each TypedArray has:
// A type (e.g., 8-bit unsigned integer, 32-bit signed integer, 32-bit float)
// A fixed length
// Methods to read/write numbers

// Common TypedArrays:
// TypedArray	Meaning
// Uint8Array	8-bit unsigned integers (0–255)
// Int16Array	16-bit signed integers
// Int32Array	32-bit signed integers
// Float32Array	32-bit floating point
// Float64Array	64-bit floating point

//Example:
const buffer1 = new ArrayBuffer(4); // 4 bytes
const view = new Uint8Array(buffer1); // View as 8-bit unsigned integers

view[0] = 10;
view[1] = 20;
view[2] = 30;
view[3] = 40;

console.log(view); // Uint8Array(4) [10, 20, 30, 40]

//3. DataView — Flexible Low-Level Access
//DataView is a more powerful and flexible way to read/write binary memory.
//Unlike TypedArrays:
//You can read/write different numeric types at any byte offset.
//You control endianness (little-endian or big-endian).
//Good for working with binary protocols or file formats.

const buffer2 = new ArrayBuffer(8);
const dv = new DataView(buffer2);

// Write a 32-bit integer at byte offset 0
dv.setInt32(0, 123456, true); // true = little-endian

// Write a 16-bit integer at byte offset 4
dv.setInt16(4, 500, false);   // false = big-endian

console.log(dv.getInt32(0, true));  // 123456
console.log(dv.getInt16(4, false)); // 500
//DataView = full control over the raw bytes.

//4. When Do You Use These? (Real Use Cases)
//A. Binary Protocols -
// When sending custom binary messages over sockets or Bluetooth:
// You need exact byte layout
// Must pack fields (e.g., header, length, flags)
// Example: game networking packets.

// B. File and Network Data -
// When reading binary files:
// PNG,WAV audio,MP4 fragments,PDFs
//File APIs use ArrayBuffers to represent file data.

//Example:
const arrayBuffer = await file.arrayBuffer();
const view = new Uint8Array(arrayBuffer);
console.log("File bytes:", view);

//C. Cryptographic Operations
// Crypto algorithms require:
// exact byte-level control
// converting numbers → bytes
// managing buffers