// ============================================
// 1. Create a 16-byte buffer
// ============================================
const buffer = new ArrayBuffer(16);
const dv = new DataView(buffer);

// ============================================
// 2. Write data into buffer
//    - 4-byte unsigned integer at offset 0
//    - 8-byte float at offset 4
// ============================================
dv.setUint32(0, 987654321, true);   // true = little-endian
dv.setFloat64(4, 123.456, true);

// ============================================
// 3. Read data back
// ============================================
const readUint32 = dv.getUint32(0, true);
const readFloat64 = dv.getFloat64(4, true);

console.log("Read Uint32:", readUint32);
console.log("Read Float64:", readFloat64);

// ============================================
// 4. packUint32ToBytes(num)
//    Convert a number → Uint8Array (4 bytes)
// ============================================
function packUint32ToBytes(num) {
    const buf = new ArrayBuffer(4);
    const view = new DataView(buf);
    view.setUint32(0, num, true); // little-endian
    return new Uint8Array(buf);
}

// Test packUint32ToBytes
const packed = packUint32ToBytes(987654321);
console.log("Packed bytes:", packed); // Uint8Array(4)

// ============================================
// 5. Extra: Show raw bytes of full 16-byte buffer
// ============================================
console.log("Full buffer bytes:", new Uint8Array(buffer));
