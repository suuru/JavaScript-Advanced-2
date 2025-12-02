// ---------------------------------
// Advanced Error Handling(Task 9)
// ---------------------------------

//1. Custom Error Types
// JavaScript allows you to create your own error classes by extending Error.
// This helps you:
// differentiate error types
// attach extra metadata
// catch specific errors

// Example: Custom Validation Error
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"; 
    }
}

function validateAge(age) {
    if (age < 18) {
        throw new ValidationError("Age must be 18+");
    }
}

try {
    validateAge(10);
} catch (err) {
    console.log(err.name);    // "ValidationError"
    console.log(err.message); // "Age must be 18+"
}

//2. Error Chaining (cause)
// Modern JavaScript allows you to attach the original error inside a new one using cause.
// This is helpful when:
// you want to wrap low-level errors in higher-level ones
// but still keep debugging info

// Example:
try {
    JSON.parse("{ invalid json }");
} catch (err) {
    throw new Error("Failed to load configuration", { cause: err });
}

// You can inspect the chained error:
try {
    // code above
} catch (err) {
    console.log(err.message); // "Failed to load configuration"
    console.log(err.cause);   // SyntaxError: Unexpected token ...
}

//This helps keep error stacks meaningful.

// 3. Global Error Handling
// Global handlers catch errors that escape try/catch or fail silently in promises.

// A. Browser: window.onerror
// Catches uncaught synchronous errors.
window.onerror = function (msg, file, line, col, error) {
    console.log("Global error:", msg);
};

//B. Browser: window.onunhandledrejection
// Catches Promise errors with no .catch().
window.onunhandledrejection = function (event) {
    console.log("Unhandled rejection:", event.reason);
};

// C. Node.js: process.on('uncaughtException')
// Catches unhandled synchronous errors in Node.
process.on('uncaughtException', (err) => {
    console.error("Uncaught Exception:", err);
});

// D. Node.js: process.on('unhandledRejection')
// Catches unhandled rejected promises.
process.on('unhandledRejection', (reason) => {
    console.error("Unhandled Rejection:", reason);
});

//Global handlers should log, not “fix” the error — a crash may still be necessary.
// 4. Error Handling Strategies
// Different systems use different strategies depending on risk, cost, and reliability.
// A. Retry
// Try the operation again.
// Useful for:
// network requests
// temporary outages
// rate limits

async function retry(fn, attempts = 3) {
    for (let i = 0; i < attempts; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === attempts - 1) throw err;
        }
    }
}

// B. Fallback
// Use another method when the main one fails
function getUser() {
    try {
        return fetchFromAPI();
    } catch {
        return readFromCache();
    }
}

// C. Circuit Breaker
// Temporarily stop calling a failing service to avoid overload.
// Concept:
// Too many errors → open circuit (stop calls)
// After a timeout → half-open (test one call)
// If successful → close circuit (resume)
if (circuitOpen) throw new Error("Service unavailable");

try {
    const result = await callService();
    resetErrors();
    return result;
} catch (err) {
    incrementErrorCount();
    if (tooManyErrors) openCircuit();
    throw err;
}

// D. Logging vs Failing Fast
// Logging
// Use when:
// error is not fatal
// system can continue
// you want visibility for debugging

// Example:
 console.error("Non-critical error:", err);

//Failing Fast
// Stop immediately when:
// data would be corrupted
// continuing would cause worse failures
// system is in an invalid state

throw new Error("Critical: database connection failed");
