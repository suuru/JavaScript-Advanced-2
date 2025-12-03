
// Import performance timer (this works only in Node)
const { performance } = require("perf_hooks");

/*************************************************************
 *  INTENTIONALLY SLOW FUNCTION (CPU HEAVY)
 *************************************************************/

function slowFunction() {
    // This function intentionally does unnecessary work.

    let bigTotal = 0;

    for (let i = 0; i < 2000; i++) {       // Outer loop
        const tempArray = [];

        for (let j = 0; j < 1500; j++) {   // Inner loop

            // Unnecessary string manipulation
            const str = `value-${i}-${j}`;

            // Repeated object creation
            const obj = { index: j, text: str };

            // Unnecessary JSON clone (very expensive)
            const cloned = JSON.parse(JSON.stringify(obj));

            tempArray.push(cloned);
        }

        bigTotal += tempArray.length;
    }

    return bigTotal;
}

/*************************************************************
 *  SIMPLE BENCHMARK USING performance.now()
 *************************************************************/

function runBenchmark() {
    console.log("Running slowFunction...");

    const start = performance.now();

    const result = slowFunction();

    const end = performance.now();

    console.log("\n=== Benchmark Result ===");
    console.log("Processed items:", result);
    console.log(`Time: ${(end - start).toFixed(2)} ms`);
}

runBenchmark();


