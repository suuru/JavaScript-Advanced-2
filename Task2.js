// ============================================
// JAVASCRIPT OBJECT METHODS & DATA STRUCTURES
// Explained in Simple Terms with Examples
// ============================================

console.log("=== OBJECT METHODS & DATA STRUCTURES ===\n");

// ============================================
// 1. Object.create()
// ============================================
console.log("--- 1. Object.create() ---");
console.log("Creates a new object with a specified prototype\n");

const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const john = Object.create(personPrototype);
john.name = "John";

console.log("john.greet():", john.greet());
console.log("john has greet method from prototype:", 'greet' in john);

// Create object with null prototype (no inherited methods)
const pureObject = Object.create(null);
pureObject.name = "Pure";
console.log("Pure object (no prototype):", pureObject);
console.log("Has toString?:", pureObject.toString === undefined); // true

// ============================================
// 2. Object.assign()
// ============================================
console.log("\n--- 2. Object.assign() ---");
console.log("Copies properties from one or more objects to a target object\n");

const target = { a: 1, b: 2 };
const source1 = { b: 3, c: 4 };
const source2 = { c: 5, d: 6 };

const result = Object.assign(target, source1, source2);

console.log("Target after assign:", target);
console.log("Result:", result);
console.log("Target === result:", target === result); // true (modifies target)

// Common use: Clone an object
const original = { x: 10, y: 20 };
const clone = Object.assign({}, original);
console.log("\nCloned object:", clone);
console.log("Clone === original:", clone === original); // false

// Merge multiple objects
const defaults = { color: 'blue', size: 'medium' };
const userPrefs = { size: 'large' };
const final = Object.assign({}, defaults, userPrefs);
console.log("Merged settings:", final);

// ============================================
// 3. Object.keys()
// ============================================
console.log("\n--- 3. Object.keys() ---");
console.log("Returns an array of object's own property names (keys)\n");

const car = {
  brand: 'Toyota',
  model: 'Camry',
  year: 2024
};

const carKeys = Object.keys(car);
console.log("Car keys:", carKeys);

// Loop through keys
console.log("\nLooping through keys:");
for (let i = 0; i < carKeys.length; i++) {
  const key = carKeys[i];
  console.log(`  ${key}: ${car[key]}`);
}

// ============================================
// 4. Object.values()
// ============================================
console.log("\n--- 4. Object.values() ---");
console.log("Returns an array of object's own property values\n");

const carValues = Object.values(car);
console.log("Car values:", carValues);

// Sum numeric values
const prices = { apple: 5, banana: 3, orange: 4 };
const priceValues = Object.values(prices);
let total = 0;
for (let i = 0; i < priceValues.length; i++) {
  total = total + priceValues[i];
}
console.log("\nTotal price:", total);

// ============================================
// 5. Object.entries()
// ============================================
console.log("\n--- 5. Object.entries() ---");
console.log("Returns array of [key, value] pairs\n");

const carEntries = Object.entries(car);
console.log("Car entries:", carEntries);

// Loop through entries
console.log("\nLooping through entries:");
for (let i = 0; i < carEntries.length; i++) {
  const [key, value] = carEntries[i];
  console.log(`  ${key} => ${value}`);
}

// Convert object to Map
const carMap = new Map(Object.entries(car));
console.log("\nConverted to Map:", carMap);

// ============================================
// 6. Object.seal() & Object.isSealed()
// ============================================
console.log("\n--- 6. Object.seal() & isSealed() ---");
console.log("Seal: Can modify existing properties but can't add/delete\n");

const box = { item: 'book', count: 5 };
console.log("Before seal - isSealed:", Object.isSealed(box));

Object.seal(box);
console.log("After seal - isSealed:", Object.isSealed(box));

// Can modify existing properties
box.count = 10;
console.log("Modified count:", box.count); // Works!

// Cannot add new properties
box.color = 'red';
console.log("Tried to add color:", box.color); // undefined (silently fails)

// Cannot delete properties
delete box.item;
console.log("Tried to delete item:", box.item); // Still there!

// ============================================
// 7. Object.freeze() & Object.isFrozen()
// ============================================
console.log("\n--- 7. Object.freeze() & isFrozen() ---");
console.log("Freeze: Cannot modify, add, or delete properties (completely immutable)\n");

const config = { apiKey: 'ABC123', timeout: 5000 };
console.log("Before freeze - isFrozen:", Object.isFrozen(config));

Object.freeze(config);
console.log("After freeze - isFrozen:", Object.isFrozen(config));

// Cannot modify
config.timeout = 10000;
console.log("Tried to modify timeout:", config.timeout); // Still 5000

// Cannot add
config.newProp = 'test';
console.log("Tried to add newProp:", config.newProp); // undefined

// Cannot delete
delete config.apiKey;
console.log("Tried to delete apiKey:", config.apiKey); // Still there

// ============================================
// 8. Object.fromEntries()
// ============================================
console.log("\n--- 8. Object.fromEntries() ---");
console.log("Converts array of [key, value] pairs into an object\n");

const entries = [
  ['name', 'Alice'],
  ['age', 25],
  ['city', 'Lagos']
];

const person = Object.fromEntries(entries);
console.log("Created object:", person);

// Convert Map to object
const mapData = new Map([
  ['product', 'Laptop'],
  ['price', 1000]
]);
const objFromMap = Object.fromEntries(mapData);
console.log("\nObject from Map:", objFromMap);

// Transform object values
const scores = { math: 80, english: 90, science: 85 };
const doubled = Object.fromEntries(
  Object.entries(scores).map(([key, value]) => [key, value * 2])
);
console.log("Doubled scores:", doubled);

// ============================================
// 9. Object.is()
// ============================================
console.log("\n--- 9. Object.is() ---");
console.log("Compares if two values are the same (stricter than ===)\n");

console.log("Object.is(5, 5):", Object.is(5, 5));
console.log("Object.is('hello', 'hello'):", Object.is('hello', 'hello'));
console.log("Object.is(5, '5'):", Object.is(5, '5'));

// Special cases where Object.is differs from ===
console.log("\nSpecial cases:");
console.log("Object.is(NaN, NaN):", Object.is(NaN, NaN));     // true
console.log("NaN === NaN:", NaN === NaN);                      // false

console.log("Object.is(+0, -0):", Object.is(+0, -0));         // false
console.log("+0 === -0:", +0 === -0);                          // true

const obj1 = { x: 1 };
const obj2 = { x: 1 };
console.log("Object.is(obj1, obj2):", Object.is(obj1, obj2)); // false (different objects)

// ============================================
// 10. Object.preventExtensions()
// ============================================
console.log("\n--- 10. Object.preventExtensions() ---");
console.log("Prevents adding new properties (but can modify/delete existing)\n");

const user = { name: 'Bob', age: 30 };
Object.preventExtensions(user);

// Can modify existing
user.age = 31;
console.log("Modified age:", user.age);

// Cannot add new
user.email = 'bob@example.com';
console.log("Tried to add email:", user.email); // undefined

// Can delete existing
delete user.age;
console.log("Deleted age:", user.age); // undefined

console.log("Is extensible:", Object.isExtensible(user)); // false

// ============================================
// 11. Set
// ============================================
console.log("\n--- 11. Set ---");
console.log("Collection of unique values (no duplicates)\n");

const numbers = new Set();
numbers.add(1);
numbers.add(2);
numbers.add(3);
numbers.add(2); // Duplicate - ignored
numbers.add(1); // Duplicate - ignored

console.log("Set size:", numbers.size);
console.log("Has 2?:", numbers.has(2));
console.log("Has 5?:", numbers.has(5));

// Loop through Set
console.log("\nSet values:");
numbers.forEach(value => {
  console.log("  -", value);
});

// Remove duplicates from array
const arr = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(arr)];
console.log("\nOriginal array:", arr);
console.log("Unique values:", unique);

numbers.delete(2);
console.log("After deleting 2:", [...numbers]);

// ============================================
// 12. Map
// ============================================
console.log("\n--- 12. Map ---");
console.log("Collection of key-value pairs (keys can be any type)\n");

const userMap = new Map();
userMap.set('name', 'Charlie');
userMap.set('age', 28);
userMap.set('active', true);

console.log("Map size:", userMap.size);
console.log("Get name:", userMap.get('name'));
console.log("Has age?:", userMap.has('age'));

// Keys can be objects!
const key1 = { id: 1 };
const key2 = { id: 2 };
const objMap = new Map();
objMap.set(key1, 'First object');
objMap.set(key2, 'Second object');

console.log("\nValue for key1:", objMap.get(key1));
console.log("Value for key2:", objMap.get(key2));

// Loop through Map
console.log("\nMap entries:");
userMap.forEach((value, key) => {
  console.log(`  ${key}: ${value}`);
});

userMap.delete('age');
console.log("After deleting age, size:", userMap.size);

// ============================================
// 13. WeakSet
// ============================================
console.log("\n--- 13. WeakSet ---");
console.log("Like Set but only holds objects weakly (allows garbage collection)\n");

let obj1Weak = { name: 'Object 1' };
let obj2Weak = { name: 'Object 2' };

const weakSet = new WeakSet();
weakSet.add(obj1Weak);
weakSet.add(obj2Weak);

console.log("Has obj1?:", weakSet.has(obj1Weak));

// When you remove references, objects can be garbage collected
obj1Weak = null;
console.log("Set obj1 to null - it can now be garbage collected");

// Cannot iterate or get size
console.log("Cannot get size:", weakSet.size); // undefined
console.log("Use case: Track objects without preventing cleanup");

// ============================================
// 14. WeakMap
// ============================================
console.log("\n--- 14. WeakMap ---");
console.log("Like Map but keys must be objects and are held weakly\n");

let userObj = { id: 1, name: 'Dave' };
let metadata = { id: 2, name: 'Eve' };

const weakMap = new WeakMap();
weakMap.set(userObj, { loginCount: 5, lastLogin: '2024-11-24' });
weakMap.set(metadata, { views: 100 });

console.log("User data:", weakMap.get(userObj));
console.log("Has metadata?:", weakMap.has(metadata));

// When object is removed, WeakMap entry is garbage collected
userObj = null;
console.log("Set userObj to null - entry can be garbage collected");

console.log("Use case: Store private data associated with objects");

// ============================================
// 15. WeakRef
// ============================================
console.log("\n--- 15. WeakRef ---");
console.log("Creates a weak reference to an object (doesn't prevent garbage collection)\n");

let target2 = { data: 'important' };
const weakRef = new WeakRef(target2);

// Get the object (if still alive)
console.log("Dereferenced object:", weakRef.deref());

Target = null; // Remove strong reference
console.log("Target set to null - may be garbage collected");

// Later, deref() might return undefined if object was collected
const retrieved = weakRef.deref();
console.log("Retrieved value:", retrieved);

console.log("Use case: Caches where entries can be automatically cleaned up");

// ============================================
// 16. Symbol
// ============================================
console.log("\n--- 16. Symbol ---");
console.log("Unique identifier that can be used as object property key\n");

// Create symbols
const id = Symbol('id');
const id2 = Symbol('id');

console.log("Are symbols equal?:", id === id2); // false (always unique!)

// Use as object property
const userWithSymbol = {
  name: 'Frank',
  [id]: 12345
};

console.log("User name:", userWithSymbol.name);
console.log("User ID (via symbol):", userWithSymbol[id]);

// Symbol properties are hidden from normal iteration
console.log("\nObject.keys():", Object.keys(userWithSymbol)); // Only 'name'
console.log("Symbol properties hidden from for...in loops");

// Well-known symbols
const customObj = {
  [Symbol.toStringTag]: 'CustomObject',
  value: 100
};

console.log("\nCustom toString:", customObj.toString());

// Create global symbol (shared across code)
const globalSym = Symbol.for('app.id');
const sameSym = Symbol.for('app.id');
console.log("Global symbols equal?:", globalSym === sameSym); // true!

console.log("\nUse cases:");
console.log("- Unique property keys that won't conflict");
console.log("- Hidden properties not shown in loops");
console.log("- Define custom object behaviors");

// ============================================
// COMPARISON TABLE
// ============================================
console.log("\n=== QUICK REFERENCE ===\n");

console.log("OBJECT PROTECTION:");
console.log("preventExtensions → Can't ADD new properties");
console.log("seal → Can't ADD or DELETE properties");
console.log("freeze → Can't ADD, DELETE, or MODIFY properties\n");

console.log("COLLECTIONS:");
console.log("Set → Unique values");
console.log("Map → Key-value pairs (any key type)");
console.log("WeakSet → Set with weak references");
console.log("WeakMap → Map with weak references\n");

console.log("OBJECT METHODS:");
console.log("Object.create() → New object with prototype");
console.log("Object.assign() → Copy properties");
console.log("Object.keys() → Array of keys");
console.log("Object.values() → Array of values");
console.log("Object.entries() → Array of [key, value]");
console.log("Object.fromEntries() → Object from [key, value]");
console.log("Object.is() → Strict equality check\n");

console.log("ADVANCED:");
console.log("WeakRef → Weak reference to object");
console.log("Symbol → Unique identifier for properties");