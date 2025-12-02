// ============================================
// Custom Iterable Range + Async Range Example
// ============================================

// ---- 1. SYNCHRONOUS RANGE (Iterable) ----
function createRange(from, to) {
  return {
    from,
    to,
    [Symbol.iterator]() {
      let current = this.from;
      return {
        next: () => {
          if (current <= to) {
            return { value: current++, done: false };
          }
          return { done: true };
        }
      };
    }
  };
}

// Test with for...of
console.log("Synchronous range (for...of):");
for (const n of createRange(1, 5)) {
  console.log(n);
}

// Test with spread (...)
console.log("\nSpread syntax:", [...createRange(1, 5)]);


// ---- 2. ASYNC RANGE (Async Iterable) ----
function createAsyncRange(from, to, delay = 300) {
  return {
    from,
    to,
    async *[Symbol.asyncIterator]() {
      for (let i = from; i <= to; i++) {
        await new Promise(res => setTimeout(res, delay));
        yield i;
      }
    }
  };
}

// Test async iterable
(async () => {
  console.log("\nAsynchronous range (for await...of):");
  for await (const n of createAsyncRange(1, 5, 200)) {
    console.log(n);
  }
})();
