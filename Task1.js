//-------------------------------------------
//Task 1 — Engine-Friendly Objects
//-------------------------------------------

//What are Hidden Classes & Shapes?
// Hidden Classes (also called "Shapes" in modern engines) are an internal optimization technique used by JavaScript engines 
// Since JavaScript is dynamically typed, objects can have properties added/removed anytime. 
// This flexibility can lead to performance issues because the engine has to constantly check the structure of objects at runtime.

// To mitigate this, engines create Hidden Classes to represent the structure of objects. 
// When an object is created, the engine assigns it a Hidden Class based on its properties. 
// If properties are added or removed, the engine may create a new Hidden Class for the modified object.
// By using Hidden Classes, the engine can optimize property access by knowing the layout of objects in memory, 
// leading to faster execution of code that interacts with those objects.

//How Objects Are Represented Internally

//Traditional Class-Based Languages (Java/C++)
// In traditional class-based languages like Java or C++, objects are instances of predefined classes.
// Each class has a fixed structure defined at compile-time, and all instances of that class share the same layout in memory.
// This allows for efficient memory access and optimizations since the engine knows exactly where to find each property.

//  In Java - fixed structure
// class User {
//     String name;    // offset 0
//     int age;        // offset 8
//     Memory layout is predictable
// }

// In JavaScript - dynamic structure
const user1 = { name: "John", age: 30 };           // Shape A
const user2 = { age: 25, name: "Jane" };           // Shape B (different order!)
const user3 = { name: "Bob" };                     // Shape C
user3.age = 35;                                    // Shape changes!

// Object in Memory:
// ┌──────────────────┐    ┌──────────────────┐
// │     Object       │    │     Shape        │
// ├──────────────────┤    ├──────────────────┤
// │ Shape pointer ───┼───▶│ property names   │
// │ values array     │    │ property offsets │
// │ ┌──────────────┐ │    │ ┌──────────────┐ │
// │ │ "John"       │ │    │ │ "name" → 0   │ │
// │ │ 30           │ │    │ │ "age"  → 1   │ │
// │ └──────────────┘ │    │ └──────────────┘ │
// └──────────────────┘    └──────────────────┘

// In JavaScript, objects are more flexible. They can have properties added or removed at any time,

//Why Changing Object Shape Hurts Performance
//Inline caching
// When the shape of an object changes (e.g., properties are added or removed), the JavaScript engine may need to create a new Hidden Class for that object.
// This can lead to performance degradation for several reasons:
// 1. Cache Invalidation: The engine often uses inline caching to optimize property access. When the shape changes, these caches may become invalid, leading to slower property access until the caches are rebuilt.
// 2. Increased Memory Usage: Each unique shape requires its own Hidden Class, which can increase memory consumption if many objects have different shapes.
// 3. De-optimization: Frequent shape changes can lead to de-optimization of code paths that were previously optimized based on stable object shapes.
// 4. Slower Property Access: Accessing properties on objects with changing shapes can be slower because the engine has to perform additional checks to determine the current shape of the object.

//Best Practices to Maintain Stable Object Shapes
// 1. Consistent Property Order: Always add properties in the same order when creating objects. This helps the engine maintain a stable shape.
function createUser(name, age) {
    return { name: name, age: age }; // Consistent order
}

// 2. Avoid Adding/Removing Properties: Try to define all necessary properties upfront and avoid adding or removing them later.
function User(name, age) {
    this.name = name;
    this.age = age;
    // Avoid adding new properties later
}

// 3. Use Constructor Functions or Classes: Using constructor functions or ES6 classes can help create objects with a consistent shape.
class UserClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
const userA = new UserClass("Alice", 28);
const userB = new UserClass("Bob", 32);

// 4. Avoid Dynamic Property Names: Using dynamic property names (e.g., using variables as keys) can lead to unpredictable shapes.
// Instead, use fixed property names whenever possible.
const userFixed = { name: "Charlie", age: 40 }; // Fixed property names

// 5. Use Object Pools: For frequently created and destroyed objects, consider using object pools to reuse objects with the same shape instead of creating new ones.
// Example of an object pool
class ObjectPool {
    constructor(createFunc) {
        this.createFunc = createFunc;
        this.pool = [];
    }
    acquire() {
        return this.pool.pop() || this.createFunc();
    }
    release(obj) {
        this.pool.push(obj);
    }   
}

//2. Shape Transitions
// Shape transitions occur when the structure of an object changes, leading to the creation of a new Hidden Class.
const user = { name: "John" };
// Shape A: { name }

user.age = 30;
// Shape B: { name, age } - transition from A→B

user.email = "john@test.com";
// Shape C: { name, age, email } - transition from B→C

delete user.age;
// Shape D: { name, email } - completely new shape!

//3. Memory & CPU Overhead
//Each new shape consumes memory
//Property lookups require shape checks
//JIT optimizations get deoptimized

// Stable vs Unstable object creation
function createStableUser(id, name, age, email) {
    // Always same property order and structure
    return {
        id: id,
        name: name,
        age: age,
        email: email
    };
}

function createUnstableUser(id, name, age, email) {
    const user = {};
    
    // Random property order - creates different shapes
    const properties = [
        { key: 'id', value: id },
        { key: 'name', value: name },
        { key: 'age', value: age },
        { key: 'email', value: email }
    ];
    
    // Shuffle properties to create different shapes
    for (let i = properties.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [properties[i], properties[j]] = [properties[j], properties[i]];
    }
    
    // Add properties in random order
    properties.forEach(prop => {
        user[prop.key] = prop.value;
    });
    
    // Randomly add/remove properties
    if (Math.random() > 0.5) {
        user.extra = "some value";
    }
    
    return user;
}

// Property access benchmark
function benchmarkPropertyAccess(userObjects, iterations = 1000000) {
    console.log(`Benchmarking ${iterations.toLocaleString()} property accesses...`);
    
    const start = performance.now();
    let total = 0;
    
    for (let i = 0; i < iterations; i++) {
        const user = userObjects[i % userObjects.length];
        // Access multiple properties
        total += user.id + user.name.length + user.age;
    }
    
    const end = performance.now();
    const duration = end - start;
    
    console.log(`Total time: ${duration.toFixed(2)}ms`);
    console.log(`Operations/sec: ${(iterations / duration * 1000).toLocaleString()}`);
    console.log(`Accesses/ms: ${(iterations / duration).toLocaleString()}`);
    
    return { duration, total }; // Return total to prevent optimization removal
}

// Create test data
const STABLE_USERS = [];
const UNSTABLE_USERS = [];

console.log("Creating test objects...");
for (let i = 0; i < 100; i++) {
    STABLE_USERS.push(createStableUser(i, `User${i}`, 20 + i % 50, `user${i}@test.com`));
    UNSTABLE_USERS.push(createUnstableUser(i, `User${i}`, 20 + i % 50, `user${i}@test.com`));
}

// Run benchmarks
console.log("\n=== STABLE OBJECTS (Same Shape) ===");
const stableResult = benchmarkPropertyAccess(STABLE_USERS, 1000000);

console.log("\n=== UNSTABLE OBJECTS (Different Shapes) ===");
const unstableResult = benchmarkPropertyAccess(UNSTABLE_USERS, 1000000);

// Calculate performance difference
const difference = ((unstableResult.duration - stableResult.duration) / stableResult.duration * 100);
console.log(`\n=== RESULTS ===`);
console.log(`Stable objects: ${stableResult.duration.toFixed(2)}ms`);
console.log(`Unstable objects: ${unstableResult.duration.toFixed(2)}ms`);
console.log(`Performance difference: ${difference.toFixed(1)}% slower`);

// Additional demonstration of shape differences
console.log("\n=== SHAPE ANALYSIS ===");
function analyzeShapes(users) {
    const shapeMap = new Map();
    
    users.forEach(user => {
        // Create a shape signature based on property names and order
        const shapeKey = Object.keys(user).join(',');
        shapeMap.set(shapeKey, (shapeMap.get(shapeKey) || 0) + 1);
    });
    
    console.log(`Unique shapes: ${shapeMap.size}`);
    console.log('Shape distribution:', Object.fromEntries(shapeMap));
}

console.log("Stable users shape analysis:");
analyzeShapes(STABLE_USERS);

console.log("Unstable users shape analysis:");
analyzeShapes(UNSTABLE_USERS);

//Best Practices for Optimal Performance
// 1. Create objects with a consistent structure and property order.
// 2. Avoid adding or removing properties after object creation.
// 3. Use constructor functions or classes to define object templates.
// 4. Avoid dynamic property names that can lead to unpredictable shapes.
// 5. Consider using object pools for frequently created/destroyed objects.

// Good - consistent property order
function createGoodUser(id, name, email) {
    return { id, name, email }; // Same shape every time
}

// Good - initialize all properties at once
const goodObj = {
    prop1: value1,
    prop2: value2,
    prop3: value3
};

// Good - use classes for fixed structures
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}

//❌ DON'T - Unstable Shapes
// Bad - adding properties later
const badObj = {};
badObj.prop1 = value1;
badObj.prop2 = value2; // Shape change!

// Bad - different property orders
function createBadUser(id, name, email) {
    if (id > 1000) {
        return { id, name, email };
    } else {
        return { name, email, id }; // Different shape!
    }
} 

// Bad - deleting properties
const obj = { a: 1, b: 2, c: 3 };
delete obj.b; // Shape change!

//Advanced Shape Example
// Demonstrate how shapes evolve
function demonstrateShapes() {
    console.log("\n=== SHAPE TRANSITION CHAIN ===");
    
    const obj1 = {};
    console.log("obj1: {}", getShapeInfo(obj1));
    
    obj1.a = 1;
    console.log("obj1: {a:1}", getShapeInfo(obj1));
    
    obj1.b = 2;
    console.log("obj1: {a:1, b:2}", getShapeInfo(obj1));
    
    const obj2 = {};
    obj2.b = 2; // Different starting point!
    console.log("obj2: {b:2}", getShapeInfo(obj2));
    
    obj2.a = 1; // Now matches obj1's final shape
    console.log("obj2: {a:1, b:2}", getShapeInfo(obj2));
}

// Helper to show shape information (conceptual)
function getShapeInfo(obj) {
    return `properties: [${Object.keys(obj).join(', ')}]`;
}
console.log("\n=== DEMONSTRATING SHAPE TRANSITIONS ===");
// Run the demonstration
demonstrateShapes();

//Key Takeaways
// 1. Hidden Classes/Shapes optimize property access in JavaScript engines.
// 2. Stable object shapes lead to better performance.
// 3. Follow best practices to maintain consistent object structures.
// 4. Benchmarking can help identify performance impacts of object shape changes.
// 5. Understanding shapes can guide better coding patterns for performance-critical applications.