// optimize-and-compare.js
const { performance } = require("perf_hooks");

/*************************************************************
 * 1. SLOW (UNOPTIMIZED) VERSION
 *************************************************************/

function slowFunction() {
    let bigTotal = 0;

    for (let i = 0; i < 2000; i++) {
        const tempArray = [];

        for (let j = 0; j < 1500; j++) {

            // Unnecessary work:

            // (1) String building inside the loop
            const str = `value-${i}-${j}`;

            // (2) Creating new objects for each iteration
            const obj = { index: j, text: str };

            // (3) VERY slow deep clone (JSON.parse/stringify)
            const cloned = JSON.parse(JSON.stringify(obj));

            tempArray.push(cloned);
        }

        bigTotal += tempArray.length;
    }

    return bigTotal;
}

/*************************************************************
 * 2. OPTIMIZED VERSION
 *************************************************************/

function optimizedFunction() {
    let bigTotal = 0;

    // Pre-create reused objects & strings
    const obj = { index: 0, text: "" };

    for (let i = 0; i < 2000; i++) {
        // Reuse the same array instead of creating a new one every loop
        const tempArray = new Array(1500);

        for (let j = 0; j < 1500; j++) {

            // Avoid string construction inside tight loop
            // Reuse the same object and update its fields
            obj.index = j;
            obj.text = "value-" + i + "-" + j;

            // Avoid JSON.clone; instead do a cheap shallow copy
            tempArray[j] = { index: obj.index, text: obj.text };
        }

        bigTotal += tempArray.length;
    }

    return bigTotal;
}

/*************************************************************
 * 3. Benchmark helper
 *************************************************************/

function benchmark(fn, label) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    console.log(`\n=== ${label} ===`);
    console.log("Processed items:", result);
    console.log(`Time: ${(end - start).toFixed(2)} ms`);
}

/*************************************************************
 * 4. Run both benchmarks
 *************************************************************/

console.log("Running comparison...\n");

benchmark(slowFunction, "SLOW VERSION");
benchmark(optimizedFunction, "OPTIMIZED VERSION");


