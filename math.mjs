export function add(a, b) {
    return a + b;
}

export function sub(a, b) {
    return a - b;
}

export function mul(a, b) {
    return a * b;
}

export function div(a, b) {
    return a / b;
}

// Exporting functions individually
// Alternatively, you could export them all at once like this:
// export { add, sub, mul, div };
// but the individual exports above are more common in ESM.
// This file should be saved as math.mjs
