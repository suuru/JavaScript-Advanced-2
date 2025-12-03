/*
============================================================
 PERFORMANCE & PROFILING — FULL CONCEPT CHEAT SHEET
Combined in a SINGLE JavaScript code file with explanations.
============================================================
*/

/************************************************************
1. MEASURING PERFORMANCE (DON'T GUESS — MEASURE)
*************************************************************/

// High‑precision timing using performance.now()
function measureLoop() {
  const start = performance.now();
  for (let i = 0; i < 1e6; i++); // heavy loop
  const end = performance.now();
  console.log(`Loop took: ${(end - start).toFixed(2)}ms`);
}
measureLoop();

// Node.js built‑in benchmark
touch = () => {}
console.time("buffer-create");
Buffer.from("hello world");
console.timeEnd("buffer-create");

/************************************************************
2. BROWSER PROFILING (DevTools Performance Tab)
*************************************************************/
/*
Open Chrome DevTools → Performance
Record → Interact with page → Stop
Analyze flame chart:
- Wide blocks = slow functions
- Tall stacks = deeply nested calls
- Red blocks = layout & paint bottlenecks
*/

function browserWorkSimulation() {
  // Simulate some expensive operations
  let sum = 0;
  for (let i = 0; i < 5e5; i++) sum += i;
  return sum;
}

/************************************************************
3. MEMORY PROFILING (Heap Snapshots)
*************************************************************/
/*
Use Chrome DevTools → Memory → Heap snapshot to:
- Detect leaks
- Find long‑living objects
- Inspect retained DOM nodes
*/

// Example of a potential memory leak
const leaky = [];
function createLeak() {
  const bigData = new Array(100000).fill("x");
  leaky.push(bigData); // Never cleared → memory leak risk
}
// createLeak() repeatedly will show leak in heap snapshots

/************************************************************
4. OPTIMIZING PATTERNS
*************************************************************/

// AVOID UNNECESSARY ALLOCATIONS
function badAlloc() {
  const arr = [];
  for (let i = 0; i < 10000; i++) arr.push(i * 2);
  return arr;
}

// Better: reuse arrays
function goodAlloc(reuseArr = []) {
  reuseArr.length = 0; // clear existing memory
  for (let i = 0; i < 10000; i++) reuseArr.push(i * 2);
  return reuseArr;
}

// AVOID EXCESSIVE DOM WORK (concept example)
function updateDomEfficiently(items) {
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    fragment.appendChild(li);
  }
  document.body.appendChild(fragment); // ONE DOM operation
}

/************************************************************
5. REDUCE SYNC BLOCKING IN NODE.JS
*************************************************************/

// ❌ BAD: Blocking
// const data = fs.readFileSync("bigfile.txt", "utf8");

// ✔ GOOD: Non‑blocking async
aimport('fs/promises').then(fs => {
  fs.readFile("bigfile.txt", "utf8").then(data => {
    console.log("Non‑blocking file loaded");
  });
});

/************************************************************
6. Symbols, Proxy & Reflect BASICS (BONUS)
*************************************************************/

// Symbol — unique identifiers
const ID = Symbol("id");
const user = { name: "John", [ID]: 12345 };

// Proxy — intercept object operations
const obj = { a: 1, b: 2 };
const proxy = new Proxy(obj, {
  get(target, prop) {
    console.log(`Access: ${prop}`);
    return Reflect.get(target, prop);
  },
  set(target, prop, value) {
    console.log(`Set ${prop} = ${value}`);
    return Reflect.set(target, prop, value);
  }
});

proxy.a;      // logs access
proxy.b = 99; // logs setting

/* Reflect:
- Standardized API for object operations
- More predictable than obj[prop]
*/


