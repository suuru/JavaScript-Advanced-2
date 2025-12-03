/*************************************************************
 * SYMBOLS, PROXY & REFLECT (Metaprogramming)
 *************************************************************/

/***********************
 * 1. Symbols
 ***********************/

// Symbols are unique identifiers
const sym1 = Symbol("id");
const sym2 = Symbol("id");

console.log(sym1 === sym2); // false, always unique

// Symbol as property key
const user = {
    [sym1]: 123,
    name: "Alice",
};

console.log(user[sym1]); // 123

// Built-in symbols
const iterable = {
    items: [1, 2, 3],
    [Symbol.iterator]() { // Symbol.iterator makes this object iterable
        let index = 0;
        return {
            next: () => ({
                value: this.items[index++],
                done: index > this.items.length
            })
        };
    }
};

for (const x of iterable) {
    console.log("Iterated:", x);
}

// Symbol.toPrimitive example
const obj = {
    [Symbol.toPrimitive](hint) {
        if (hint === "string") return "STRING";
        if (hint === "number") return 42;
        return true;
    }
};

console.log(`${obj}`); // STRING
console.log(+obj);     // 42
console.log(obj + "!"); // true!

/***********************
 * 2. Proxy
 ***********************/

// Proxy wraps an object and intercepts operations (traps)
const target = { a: 10, b: 20 };

const proxy = new Proxy(target, {
    get(obj, prop) {
        console.log(`GET property: ${String(prop)}`);
        return Reflect.get(obj, prop); // default behavior
    },
    set(obj, prop, value) {
        console.log(`SET property: ${String(prop)} = ${value}`);
        if (typeof value !== "number") throw new TypeError("Must be a number");
        return Reflect.set(obj, prop, value);
    },
    has(obj, prop) {
        console.log(`HAS check for: ${String(prop)}`);
        return Reflect.has(obj, prop);
    },
    ownKeys(obj) {
        console.log("ownKeys trap triggered");
        return Reflect.ownKeys(obj).filter(k => k !== "b"); // hide "b"
    }
});

console.log(proxy.a); // triggers get
proxy.a = 100;        // triggers set
// proxy.b = "string"; // throws TypeError
console.log("b" in proxy); // triggers has
console.log(Object.keys(proxy)); // triggers ownKeys

/***********************
 * 3. Reflect API
 ***********************/

// Reflect provides default behavior for operations
const person = { name: "Bob" };

// Get property
console.log("Reflect.get:", Reflect.get(person, "name"));

// Set property
Reflect.set(person, "age", 30);
console.log(person);

// Check property
console.log("Reflect.has:", Reflect.has(person, "age"));

// List keys
console.log("Reflect.ownKeys:", Reflect.ownKeys(person));

/***********************
 * 4. Use Cases
 ***********************/

// 4a. Virtual object: computed properties on access
const virtualUser = new Proxy({}, {
    get(obj, prop) {
        if (prop === "fullName") return "Alice Wonderland";
        if (prop === "age") return 25;
        return undefined;
    }
});

console.log("Virtual user:", virtualUser.fullName, virtualUser.age);

// 4b. Transparent decorator / logging
function logCalls(fn) {
    return new Proxy(fn, {
        apply(target, thisArg, args) {
            console.log(`Called function ${target.name} with args`, args);
            return Reflect.apply(target, thisArg, args);
        }
    });
}

function sum(a, b) { return a + b; }
const loggedSum = logCalls(sum);
console.log("Logged sum result:", loggedSum(3, 4));

// 4c. API instrumentation
const api = {
    getUser(id) { return { id, name: "Alice" }; }
};

const monitoredApi = new Proxy(api, {
    get(target, prop) {
        if (typeof target[prop] === "function") {
            return function(...args) {
                console.log(`Calling API method: ${prop} with args`, args);
                return target[prop].apply(this, args);
            }
        }
        return target[prop];
    }
});

console.log(monitoredApi.getUser(42));

/*************************************************************
 * SUMMARY
 * 
 * - Symbols: unique identifiers, used for hidden/internal properties or customizing behavior
 * - Proxy: intercepts operations, can implement validation, logging, access control
 * - Reflect: default operations used inside Proxy, simplifies metaprogramming
 * - Use cases: virtual objects, transparent decorators, API instrumentation
 *************************************************************/
