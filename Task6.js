//----------------------------------------------------
//----------------------------------------------------
//  ITERATORS & CUSTOM VARIABLES
//-----------------------------------------------------
//-----------------------------------------------------

// 1. Iterator Protocol
// An iterator is simply an object with a:
// ✔️ next() method.
// The method must return an object with the shape:

// {
//   value: any,
//   done: boolean
// }
// ✔️ done is a boolean indicating whether the iterator is finished.
// ✔️ value is the current value of the iteration.

//Example: Manual iterator
const iterator = {
  current: 1,
  end: 3,

  next() {
    if (this.current <= this.end) {
      return { value: this.current++, done: false };
    }
    return { value: undefined, done: true };
  }
};

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

//An iterator is just a producer of values.

//✅ 2. Iterable Protocol
// An object is iterable when it implements:
// ✔️ Symbol.iterator
// This must be a function that returns an iterator.
// Built-in iterables
// JavaScript makes many objects iterable:
// Array
// String
// Map
// Set
// Typed arrays
// NodeLists (browser)

// Example: Built-in iterable
for (const char of "ABC") {
  console.log(char);
}
// A, B, C
//under the hood, this works like:
const strIterator = "ABC"[Symbol.iterator](); //→ returns an iterator
// then we can use next() to get values
console.log(strIterator.next()); // { value: 'A', done: false }
console.log(strIterator.next()); // { value: 'B', done: false }
console.log(strIterator.next()); // { value: 'C', done: false }
console.log(strIterator.next()); // { value: undefined, done: true }

//✅ 3. Custom Iterables
//You can create your own iterable objects by implementing Symbol.iterator.
//Example: Range object (like Python's range)
const range = {
  start: 1,
  end: 5,

  [Symbol.iterator]() {
    let current = this.start;
    let end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

for (const num of range) {
  console.log(num);
}
// 1 2 3 4 5

//Why this works
// Because for...of looks for:
//object[Symbol.iterator]()
// If found, it calls it to get the iterator.

//Shorter Custom Iterable Using Generator Function
const rangeGenerator = {
  *[Symbol.iterator]() {
    for (let i = 1; i <= 5; i++) {
      yield i;
    }
  }
};

//✅ 4. Async Iterables 
// Async iterables are for consuming asynchronous data sources—like streams, network chunks, timers, or paginated APIs.
// An object is async iterable when it implements:
// ✔️ Symbol.asyncIterator
const asyncRange = {
  start: 1,
  end: 3,

  [Symbol.asyncIterator]() {
    let current = this.start;
    let end = this.end;

    return {
      async next() {
        if (current <= end) {
          await new Promise(r => setTimeout(r, 500)); // simulate delay
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

(async () => {
  for await (const num of asyncRange) {
    console.log(num);
  }
})();

// prints 1...2...3 with 500ms between each


//  Use cases for async iterables
// Async iterables are extremely powerful for streaming or incremental data:
// ✔️ reading large files chunk-by-chunk
// ✔️ streaming responses from an API
// ✔️ consuming websockets
// ✔️ database cursors
// ✔️ timed intervals

