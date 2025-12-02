// ============================================
// 1. PROMISES REVISITED
// ============================================

//Promise States & Transitions

//A Promise has three states:
// pending → initial state
//fulfilled → resolved with a value
//rejected → resolved with an error
//Once settled, the state cannot change again.

//Creating a Promise
const p = new Promise((resolve, reject) => {
  console.log("Created: pending");

  resolve(42);     // pending → fulfilled
  reject("error"); // ignored – already settled
});

p.then(value => {
  console.log("Fulfilled with:", value);
});
// Output:
// Created: pending
// Fulfilled with: 42

//Promise Job Queue (Microtasks)
//then() callbacks run in the microtask queue, which executes before macrotasks (like setTimeout).

console.log("1. Start");

setTimeout(() => console.log("4. Timeout (macrotask)"), 0);

Promise.resolve()
  .then(() => console.log("2. Microtask 1"))
  .then(() => console.log("3. Microtask 2"));

console.log("End");

// ORDER:
// 1. Start
// End
// 2. Microtask 1
// 3. Microtask 2
// 4. Timeout (macrotask)

//Microtasks always flush before JavaScript returns control to the event loop.

// ============================================
//2.  ASYNC/WAIT UNDER THE HOOD
// ============================================

// An async function always returns a Promise.
//await pauses execution, but under the hood it becomes a .then() chain.
// High-level
async function add() {
  const a = await Promise.resolve(10);
  return a + 5;
}

// Low-level (what JS actually generates)
function add_desugared() {
  return Promise.resolve(10)
    .then(a => a + 5); 
}

add().then(console.log);
//If you don’t catch it → unhandled rejection.

// ============================================
// 3.ASYNC GENERATORS
// ============================================

//Async generators combine async functions and generators.
//They return an async iterator that yields Promises.

async function* numbers() {
  for (let i = 1; i <= 3; i++) {
    await new Promise(r => setTimeout(r, 500));
    yield i;  // yields after each await
  }
}
 //for await…of 
 // //Consumes async data streams.
(async () => {
  for await (const n of numbers()) {
    console.log("Received:", n);
  }
})();

// Output every ~500ms:
// Received: 1
// Received: 2
// Received: 3
// ============================================
//This is the foundation of:
// streaming APIs
// reading files in chunks
// paginated API requests
// live event streams
// ============================================

// ============================================
//4. COMMON PITFALLS WITH PROMISES
// ============================================
//A. Sequential vs Parallel await
//❌ Sequential (slow)
//Each request waits for the previous one:
async function slow() {
  const a = await fetch("/api/a");
  const b = await fetch("/api/b");
  return [a, b];
}
//If each takes 1s → total = 2s.

//✅ Parallel (fast)
//Kick off both requests at once:
async function fast() {
  const p1 = fetch("/api/a");
  const p2 = fetch("/api/b");

  const [a, b] = await Promise.all([p1, p2]);
  return [a, b];
}
//If each takes 1s → total = 1s.

//B. Silent Swallowed Errors
async function bad() {
  await Promise.reject("Oops");
}

bad(); 
// 🔴 Error occurs asynchronously
// Node prints: UnhandledPromiseRejectionWarning

//Always handle it:
bad().catch(console.error);
//Or use a top-level guard:
(async () => {
  try {
    await bad();
  } catch (e) {
    console.error("Handled:", e);
  }
})();


