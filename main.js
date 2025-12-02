// --- Import CommonJS ---
const cjsMath = require("./math.cjs");

// --- Import ES Modules ---
// Dynamic import because .js cannot use `import` unless package.json sets "type": "module"
import("./math.mjs").then((esmMath) => {

    console.log("=== Using CommonJS Math ===");
    console.log("CJS add:", cjsMath.add(2, 3));
    console.log("CJS sub:", cjsMath.sub(5, 2));
    console.log("CJS mul:", cjsMath.mul(3, 4));
    console.log("CJS div:", cjsMath.div(10, 2));

    console.log("\n=== Using ESM Math ===");
    console.log("ESM add:", esmMath.add(2, 3));
    console.log("ESM sub:", esmMath.sub(5, 2));
    console.log("ESM mul:", esmMath.mul(3, 4));
    console.log("ESM div:", esmMath.div(10, 2));
});

/*****************************************************************************************
 * 
 * ---------------------------------------------------------------------------------------
 * Demonstrate interoperability between CommonJS and ES Modules (ESM).
 * - CommonJS can import ESM using dynamic import()
 * - ESM can import CommonJS using createRequire()
 //* In this example main.js is CommonJS (because it's .js with no ESM setup)//.
 *
 * Save this as: main.js
 *****************************************************************************************/