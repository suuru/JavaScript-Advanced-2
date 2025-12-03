/***********************************************************************
 * JSON LIMITS, STRUCTURED CLONING, CUSTOM SERIALIZATION & CLONING
 * (Simple explanations + code examples in one page)
 ***********************************************************************/

/*************************************************************
 * 1. JSON LIMITS
 * -----------------------------------------------------------
 * JSON.stringify can ONLY handle:
 *   - Objects, Arrays
 *   - Numbers, Strings, Booleans, null
 *
 * JSON CANNOT handle:
 *   ❌ Functions
 *   ❌ Dates (converted to strings)
 *   ❌ Maps/Sets
 *   ❌ undefined
 *   ❌ Symbols
 *   ❌ Circular references → causes error
 **************************************************************/
console.log("\n--- 1. JSON LIMITS ---");

const data = {
    name: "Alice",
    date: new Date(),
    greet: () => "hello",
    items: new Set([1, 2, 3]),
};

console.log(JSON.stringify(data)); 
// Output: {"name":"Alice","date":"2025-01-01T00:00:00Z","items":{}}
// Functions disappear, Sets become empty objects, Date becomes a string

// Circular object example → JSON fails
const circular = {};
circular.self = circular;
// JSON.stringify(circular); // ❌ Throws: TypeError: Converting circular structure to JSON

/*************************************************************
 * 2. STRUCTURED CLONING (structuredClone)
 * -----------------------------------------------------------
 * structuredClone() can copy:
 *   ✔ Objects, Arrays
 *   ✔ Dates
 *   ✔ Maps, Sets
 *   ✔ TypedArrays, ArrayBuffers
 *   ✔ Circular references
 *
 * BUT:
 *   ❌ It still cannot clone functions
 **************************************************************/
console.log("\n--- 2. STRUCTURED CLONING ---");

const obj = {
    name: "Bob",
    date: new Date(),
    map: new Map([["a", 1]]),
    set: new Set([1, 2, 3]),
};
obj.self = obj; // circular

const cloned = structuredClone(obj);
console.log(cloned);

/*************************************************************
 * 3. CUSTOM SERIALIZATION (Dates, Maps, Sets, Cycles)
 * -----------------------------------------------------------
 * You can teach JSON how to serialize special objects
 * using a "replacer" and "reviver".
 **************************************************************/
console.log("\n--- 3. CUSTOM SERIALIZATION ---");

// Custom JSON replacer
function customReplacer(key, value) {
    if (value instanceof Date) {
        return { __type: "Date", value: value.toISOString() };
    }
    if (value instanceof Map) {
        return { __type: "Map", value: [...value.entries()] };
    }
    if (value instanceof Set) {
        return { __type: "Set", value: [...value.values()] };
    }
    return value;
}

// Custom JSON reviver
function customReviver(key, value) {
    if (value?.__type === "Date") {
        return new Date(value.value);
    }
    if (value?.__type === "Map") {
        return new Map(value.value);
    }
    if (value?.__type === "Set") {
        return new Set(value.value);
    }
    return value;
}

const special = {
    when: new Date(),
    roles: new Set(["admin", "editor"]),
    settings: new Map([["theme", "dark"]])
};

const json = JSON.stringify(special, customReplacer);
console.log("Custom JSON:", json);

const revived = JSON.parse(json, customReviver);
console.log("Revived:", revived);

/*************************************************************
 * 4. CLONING STRATEGIES
 * -----------------------------------------------------------
 * SHALLOW CLONE:
 *   Only copies the top-level object.
 *   Nested objects are still shared.
 *
 * DEEP CLONE:
 *   Copies everything recursively.
 **************************************************************/
console.log("\n--- 4. CLONING STRATEGIES ---");

// Shallow clone
const shallowOriginal = { a: 1, inner: { x: 10 } };
const shallowCopy = { ...shallowOriginal };

shallowCopy.inner.x = 999; 
console.log("Shallow clone shares nested objects:", shallowOriginal.inner.x);

// Deep clone (simple but limited)
function deepCloneSimple(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Fully custom deep clone for complex graphs (Dates, Maps, Sets, cycles)
function deepClone(value, seen = new WeakMap()) {

    if (value === null || typeof value !== "object") return value;

    if (seen.has(value)) return seen.get(value);

    if (value instanceof Date) return new Date(value);

    if (value instanceof Map) {
        const result = new Map();
        seen.set(value, result);
        value.forEach((v, k) => result.set(deepClone(k, seen), deepClone(v, seen)));
        return result;
    }

    if (value instanceof Set) {
        const result = new Set();
        seen.set(value, result);
        value.forEach(v => result.add(deepClone(v, seen)));
        return result;
    }

    const result = Array.isArray(value) ? [] : {};
    seen.set(value, result);

    for (const key in value) {
        result[key] = deepClone(value[key], seen);
    }

    return result;
}

console.log("\n--- Custom deep clone example ---");
const complex = { 
    date: new Date(),
    map: new Map([["x", { y: 1 }]]),
    nested: { a: 1 }
};
complex.self = complex;

const complexCopy = deepClone(complex);
console.log("Deep clone:", complexCopy);

