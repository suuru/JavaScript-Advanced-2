// ============================================
// COMPLETE GUIDE TO CLOSURES & LEXICAL ENVIRONMENT
// ============================================

console.log("=== UNDERSTANDING CLOSURES & LEXICAL ENVIRONMENT ===\n");

// ============================================
// PART 1: WHAT IS LEXICAL ENVIRONMENT?
// ============================================
console.log("--- PART 1: Lexical Environment ---\n");

/*
LEXICAL ENVIRONMENT:
- Every time a function runs, it creates a new "lexical environment"
- This environment stores:
  1. Local variables
  2. Function parameters
  3. Reference to the outer (parent) environment

Think of it as a "box" that contains all variables available in that scope.

LEXICAL SCOPING:
- "Lexical" means the scope is determined by WHERE the code is written
- Not by WHERE it's called from
- Functions can access variables from their parent scope
*/

// Example 1: Simple Lexical Scope
function outer() {
  const outerVar = "I'm from outer";  // In outer's lexical environment
  
  function inner() {
    const innerVar = "I'm from inner";  // In inner's lexical environment
    console.log(outerVar);  // Can access outer's variables!
    console.log(innerVar);
  }
  
  inner();
  // console.log(innerVar);  // ❌ Error! Can't access inner's variables
}

console.log("Example 1: Basic Lexical Scope");
outer();

// ============================================
// PART 2: WHAT IS A CLOSURE?
// ============================================
console.log("\n--- PART 2: What is a Closure? ---\n");

/*
CLOSURE:
- A function that "remembers" variables from its outer scope
- Even after the outer function has finished executing
- The function "closes over" its lexical environment

WHY CLOSURES EXIST:
- JavaScript functions are "first-class" (can be passed around)
- When you return a function, it needs to remember its original scope
- Otherwise variables would disappear!

SIMPLE DEFINITION:
A closure = Function + Its Lexical Environment
*/

// Example 2: Basic Closure
function makeGreeting(greeting) {
  // greeting is stored in makeGreeting's lexical environment
  
  return function(name) {
    // This inner function "closes over" greeting
    console.log(`${greeting}, ${name}!`);
  };
}

console.log("Example 2: Basic Closure");
const sayHello = makeGreeting("Hello");
const sayHi = makeGreeting("Hi");

sayHello("Alice");  // "Hello, Alice!"
sayHi("Bob");       // "Hi, Bob!"

console.log("\nNotice: greeting variable still exists!");
console.log("Even though makeGreeting finished executing");

// ============================================
// PART 3: HOW CLOSURES WORK (VISUAL)
// ============================================
console.log("\n--- PART 3: How Closures Work ---\n");

/*
STEP BY STEP:

1. outer() is called
   Lexical Environment: { message: "Secret" }
   
2. inner() is created and returned
   inner() remembers its parent environment
   
3. outer() finishes
   BUT message isn't deleted because inner() still needs it!
   
4. revealSecret() is called
   It can still access message through closure
*/

function outer2() {
  const message = "Secret";  // Step 1: Created
  
  function inner2() {
    return message;  // Step 2: Captured in closure
  }
  
  return inner2;  // Step 3: Returned
}

const revealSecret = outer2();  // outer2 finished
console.log("Revealing secret:", revealSecret());  // Step 4: Still works!

// ============================================
// CODING TASK 1: createCounter()
// ============================================
console.log("\n--- TASK 1: createCounter() ---\n");

/*
REQUIREMENTS:
- Keep internal state (count)
- Provide methods to increment, decrement, get value
- Each counter has its own independent state
*/

function createCounter(initialValue = 0) {
  // Private variable (only accessible through closure)
  let count = initialValue;
  
  return {
    increment() {
      count++;
      return count;
    },
    
    decrement() {
      count--;
      return count;
    },
    
    getValue() {
      return count;
    },
    
    reset() {
      count = initialValue;
      return count;
    }
  };
}

// Testing createCounter
console.log("Creating two independent counters:");

const counter1 = createCounter(0);
const counter2 = createCounter(100);

console.log("\nCounter 1:");
console.log("Initial:", counter1.getValue());
console.log("After increment:", counter1.increment());
console.log("After increment:", counter1.increment());
console.log("After decrement:", counter1.decrement());

console.log("\nCounter 2:");
console.log("Initial:", counter2.getValue());
console.log("After increment:", counter2.increment());
console.log("After increment:", counter2.increment());

console.log("\nCounter 1 again:", counter1.getValue());
console.log("Counter 2 again:", counter2.getValue());
console.log("✓ Each counter maintains its own state!");

// Try to access count directly
console.log("\nTrying to access count directly:", counter1.count);
console.log("✓ count is private! Can't be accessed directly");

// ============================================
// CODING TASK 2: createCountersArray(n)
// ============================================
console.log("\n--- TASK 2: createCountersArray(n) ---\n");

/*
REQUIREMENTS:
- Create an array of n counters
- Each counter must have its own independent state
- Common bug: All counters share the same variable
*/

// ❌ WRONG WAY (Common Mistake)
function createCountersArrayWrong(n) {
  const counters = [];
  let sharedCount = 0;  // BUG: This is shared!
  
  for (let i = 0; i < n; i++) {
    counters.push({
      increment() {
        sharedCount++;  // All counters modify the same variable
        return sharedCount;
      },
      getValue() {
        return sharedCount;
      }
    });
  }
  
  return counters;
}

console.log("❌ Wrong implementation (shared state):");
const wrongCounters = createCountersArrayWrong(3);
wrongCounters[0].increment();
wrongCounters[1].increment();
console.log("Counter 0:", wrongCounters[0].getValue());  // 2 (wrong!)
console.log("Counter 1:", wrongCounters[1].getValue());  // 2 (wrong!)
console.log("Counter 2:", wrongCounters[2].getValue());  // 2 (wrong!)
console.log("Problem: All counters share the same count variable!\n");

// ✓ CORRECT WAY
function createCountersArray(n) {
  const counters = [];
  
  for (let i = 0; i < n; i++) {
    // Each iteration creates a NEW closure with its OWN count
    counters.push(createCounter(0));
  }
  
  return counters;
}

console.log("✓ Correct implementation (independent state):");
const correctCounters = createCountersArray(3);

correctCounters[0].increment();
correctCounters[0].increment();
correctCounters[1].increment();
correctCounters[2].increment();
correctCounters[2].increment();
correctCounters[2].increment();

console.log("Counter 0:", correctCounters[0].getValue());  // 2 ✓
console.log("Counter 1:", correctCounters[1].getValue());  // 1 ✓
console.log("Counter 2:", correctCounters[2].getValue());  // 3 ✓
console.log("✓ Each counter has its own independent state!");

// ============================================
// CODING TASK 3: Fix for + setTimeout Bug
// ============================================
console.log("\n--- TASK 3: Classic for + setTimeout Bug ---\n");

/*
THE PROBLEM:
- setTimeout creates a closure
- By the time setTimeout executes, the loop has finished
- The variable 'i' has its final value in all closures
*/

// ❌ THE BUG
console.log("❌ The Bug (using var):");
console.log("Expected: 0, 1, 2, 3, 4");
console.log("Actual:");

for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log("  ", i);  // All print 5!
  }, 100);
}

setTimeout(() => {
  console.log("\nWhy? var is function-scoped, not block-scoped");
  console.log("All closures share the SAME 'i' variable");
  console.log("After loop finishes, i = 5 for all of them\n");
  
  // ============================================
  // SOLUTION 1: Using let (Block Scope)
  // ============================================
  console.log("--- SOLUTION 1: Using let ---\n");
  console.log("✓ Fixed with let (block-scoped):");
  console.log("Each iteration gets its OWN 'i' variable:");
  
  for (let i = 0; i < 5; i++) {
    setTimeout(function() {
      console.log("  ", i);  // Each prints its own i!
    }, 100);
  }
  
  setTimeout(() => {
    console.log("\nWhy it works:");
    console.log("'let' creates a NEW variable for each iteration");
    console.log("Each closure captures its OWN 'i'\n");
    
    // ============================================
    // SOLUTION 2: Using IIFE
    // ============================================
    console.log("--- SOLUTION 2: Using IIFE ---\n");
    console.log("✓ Fixed with IIFE (Immediately Invoked Function Expression):");
    console.log("Create a new scope for each iteration:");
    
    for (var i = 0; i < 5; i++) {
      // IIFE creates a new scope and captures current 'i'
      (function(capturedI) {
        setTimeout(function() {
          console.log("  ", capturedI);
        }, 100);
      })(i);  // Pass current i as argument
    }
    
    setTimeout(() => {
      console.log("\nWhy it works:");
      console.log("IIFE creates a NEW function scope for each iteration");
      console.log("capturedI is a separate variable in each scope");
      console.log("Each closure captures its own capturedI\n");
      
      // ============================================
      // BONUS: Alternative IIFE Syntax
      // ============================================
      console.log("--- BONUS: Alternative IIFE Syntax ---\n");
      
      for (var i = 0; i < 5; i++) {
        // Another way to write IIFE
        setTimeout((function(capturedI) {
          return function() {
            console.log("  ", capturedI);
          };
        })(i), 100);
      }
      
      setTimeout(() => {
        console.log("\nThis version returns a function from the IIFE");
        console.log("Same effect, different style\n");
        
        continueDemo();
      }, 200);
    }, 200);
  }, 200);
}, 200);

// ============================================
// PART 4: PRACTICAL EXAMPLES
// ============================================
function continueDemo() {
  console.log("--- PART 4: Practical Closure Examples ---\n");
  
  // Example 1: Private Variables
  console.log("Example 1: Private Variables");
  
  function createBankAccount(initialBalance) {
    let balance = initialBalance;  // Private!
    
    return {
      deposit(amount) {
        if (amount > 0) {
          balance += amount;
          return `Deposited ${amount}. New balance: ${balance}`;
        }
        return "Invalid amount";
      },
      
      withdraw(amount) {
        if (amount > 0 && amount <= balance) {
          balance -= amount;
          return `Withdrew ${amount}. New balance: ${balance}`;
        }
        return "Invalid amount or insufficient funds";
      },
      
      getBalance() {
        return balance;
      }
    };
  }
  
  const myAccount = createBankAccount(1000);
  console.log(myAccount.deposit(500));
  console.log(myAccount.withdraw(200));
  console.log("Current balance:", myAccount.getBalance());
  console.log("Can't access balance directly:", myAccount.balance);
  
  // Example 2: Function Factory
  console.log("\nExample 2: Function Factory");
  
  function createMultiplier(multiplier) {
    return function(number) {
      return number * multiplier;
    };
  }
  
  const double = createMultiplier(2);
  const triple = createMultiplier(3);
  
  console.log("double(5):", double(5));
  console.log("triple(5):", triple(5));
  
  // Example 3: Event Handlers with State
  console.log("\nExample 3: Click Counter Simulator");
  
  function createClickCounter() {
    let clicks = 0;
    
    return function handleClick() {
      clicks++;
      console.log(`  Button clicked ${clicks} times`);
    };
  }
  
  const button1Handler = createClickCounter();
  const button2Handler = createClickCounter();
  
  console.log("Button 1:");
  button1Handler();
  button1Handler();
  button1Handler();
  
  console.log("Button 2:");
  button2Handler();
  button2Handler();
  
  // Example 4: Memoization
  console.log("\nExample 4: Memoization (Caching)");
  
  function createMemoizedFunction(fn) {
    const cache = {};  // Private cache
    
    return function(arg) {
      if (arg in cache) {
        console.log(`  Cache hit for ${arg}`);
        return cache[arg];
      }
      
      console.log(`  Computing for ${arg}`);
      const result = fn(arg);
      cache[arg] = result;
      return result;
    };
  }
  
  const expensiveOperation = createMemoizedFunction(function(n) {
    return n * n;
  });
  
  console.log("Result:", expensiveOperation(5));
  console.log("Result:", expensiveOperation(5));  // Cached!
  console.log("Result:", expensiveOperation(10));
  console.log("Result:", expensiveOperation(5));  // Cached!
  
  // ============================================
  // PART 5: COMMON PITFALLS
  // ============================================
  console.log("\n--- PART 5: Common Pitfalls ---\n");
  
  // Pitfall 1: Memory Leaks
  console.log("Pitfall 1: Memory Leaks");
  console.log("Closures keep references to outer variables");
  console.log("Be careful with large objects in closure scope\n");
  
  function createLeakyFunction() {
    const hugeArray = new Array(1000000).fill('data');  // Large!
    
    return function() {
      // Even if we don't use hugeArray, it's kept in memory
      return "Hello";
    };
  }
  
  console.log("Tip: Only capture what you need in closures");
  
  // Pitfall 2: Accidental Shared State
  console.log("\nPitfall 2: Accidental Shared State");
  console.log("Already covered in createCountersArray example");
  console.log("Always create NEW closures in loops\n");
  
  // ============================================
  // SUMMARY
  // ============================================
  console.log("=== SUMMARY ===\n");
  
  console.log("LEXICAL ENVIRONMENT:");
  console.log("- Container for variables in a scope");
  console.log("- Determined by code structure, not execution\n");
  
  console.log("CLOSURE:");
  console.log("- Function + Its Lexical Environment");
  console.log("- Remembers variables from outer scope");
  console.log("- Even after outer function finishes\n");
  
  console.log("KEY CONCEPTS:");
  console.log("1. Closures enable private variables");
  console.log("2. Each closure has its own environment");
  console.log("3. Use 'let' in loops for correct closures");
  console.log("4. Use IIFE to create new scopes with 'var'\n");
  
  console.log("COMMON USES:");
  console.log("- Data privacy (private variables)");
  console.log("- Function factories");
  console.log("- Event handlers with state");
  console.log("- Memoization/caching");
  console.log("- Module patterns\n");
  
  console.log("REMEMBER:");
  console.log("Closure = A function that remembers its birthplace!");
}

// Note: continueDemo() is called after setTimeout demonstrations complete