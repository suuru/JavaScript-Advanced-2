// ============================================
// COMPLETE GUIDE TO ERROR HANDLING IN JAVASCRIPT
// ============================================

console.log("=== ERROR HANDLING GUIDE ===\n");

// ============================================
// PART 1: CUSTOM ERROR TYPES
// ============================================
console.log("--- PART 1: Custom Error Types ---\n");

/*
WHY CUSTOM ERRORS?
- Distinguish between different error types
- Add custom properties
- Better error handling logic
- More informative error messages
*/

// Custom Error 1: ValidationError
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      field: this.field,
      timestamp: this.timestamp
    };
  }
}

// Custom Error 2: AuthError
class AuthError extends Error {
  constructor(message, userId, code = 401) {
    super(message);
    this.name = "AuthError";
    this.userId = userId;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      userId: this.userId,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

// Custom Error 3: DatabaseError
class DatabaseError extends Error {
  constructor(message, query, errorCode) {
    super(message);
    this.name = "DatabaseError";
    this.query = query;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    this.retryable = errorCode === 'CONN_TIMEOUT' || errorCode === 'DEADLOCK';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      query: this.query,
      errorCode: this.errorCode,
      retryable: this.retryable,
      timestamp: this.timestamp
    };
  }
}

console.log("Custom Error Types Created:");
console.log("✓ ValidationError");
console.log("✓ AuthError");
console.log("✓ DatabaseError\n");

// Testing Custom Errors
console.log("Example: Using Custom Errors\n");

try {
  throw new ValidationError("Email is required", "email");
} catch (error) {
  console.log("Caught:", error.name);
  console.log("Field:", error.field);
  console.log("Message:", error.message);
  console.log("JSON:", JSON.stringify(error.toJSON(), null, 2));
}

// ============================================
// PART 2: ERROR WRAPPING FUNCTION
// ============================================
console.log("\n--- PART 2: wrapError() Function ---\n");

/*
ERROR WRAPPING:
- Takes an original error
- Wraps it with additional context
- Preserves the original error as "cause"
- Builds an error chain for debugging
*/

function wrapError(error, message, ErrorClass = Error) {
  // Create new error with the original as cause
  const wrappedError = new ErrorClass(message, { cause: error });
  
  // Preserve custom properties if using custom error class
  if (error.code) wrappedError.code = error.code;
  if (error.statusCode) wrappedError.statusCode = error.statusCode;
  
  return wrappedError;
}

console.log("wrapError() function created");
console.log("Usage: wrapError(originalError, 'New context message')\n");

// Simple example
const originalError = new Error("File not found");
const wrappedError = wrapError(originalError, "Failed to load configuration");

console.log("Example: Simple Error Wrapping");
console.log("Message:", wrappedError.message);
console.log("Cause:", wrappedError.cause.message);

// ============================================
// PART 3: ERROR CHAIN SIMULATION
// ============================================
console.log("\n--- PART 3: Error Chain Simulation ---\n");

/*
SCENARIO:
1. Database query fails (DatabaseError)
2. Service layer wraps it (ServiceError)
3. API layer wraps it again (APIError)

This creates a chain: API → Service → Database
*/

// Additional Error Types for Chain
class ServiceError extends Error {
  constructor(message, operation) {
    super(message);
    this.name = "ServiceError";
    this.operation = operation;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }
}

class APIError extends Error {
  constructor(message, endpoint, statusCode) {
    super(message);
    this.name = "APIError";
    this.endpoint = endpoint;
    this.statusCode = statusCode;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

// Helper function to log full error chain
function logErrorChain(error, level = 0) {
  const indent = "  ".repeat(level);
  
  console.log(`${indent}[${error.name}] ${error.message}`);
  
  // Log custom properties
  if (error.query) console.log(`${indent}  Query: ${error.query}`);
  if (error.errorCode) console.log(`${indent}  Code: ${error.errorCode}`);
  if (error.operation) console.log(`${indent}  Operation: ${error.operation}`);
  if (error.endpoint) console.log(`${indent}  Endpoint: ${error.endpoint}`);
  if (error.statusCode) console.log(`${indent}  Status: ${error.statusCode}`);
  
  // Recursively log the cause chain
  if (error.cause) {
    console.log(`${indent}  ↓ Caused by:`);
    logErrorChain(error.cause, level + 1);
  }
}

// Simulate the chain
console.log("Simulating Error Chain: API → Service → Database\n");

function simulateErrorChain() {
  try {
    // LEVEL 1: Database Error (lowest level)
    try {
      throw new DatabaseError(
        "Connection timeout",
        "SELECT * FROM users WHERE id = 123",
        "CONN_TIMEOUT"
      );
    } catch (dbError) {
      // LEVEL 2: Service wraps the database error
      try {
        const serviceError = wrapError(
          dbError,
          "Failed to fetch user data",
          ServiceError
        );
        serviceError.operation = "getUserById";
        throw serviceError;
      } catch (svcError) {
        // LEVEL 3: API wraps the service error
        const apiError = wrapError(
          svcError,
          "Internal server error while processing request",
          APIError
        );
        apiError.endpoint = "/api/users/123";
        apiError.statusCode = 500;
        throw apiError;
      }
    }
  } catch (finalError) {
    console.log("ERROR CHAIN CAPTURED:\n");
    logErrorChain(finalError);
    
    console.log("\n--- EXTRACTING ERROR DETAILS ---\n");
    
    // Extract information from the chain
    console.log("Top-level error:", finalError.name);
    console.log("API endpoint:", finalError.endpoint);
    console.log("HTTP status:", finalError.statusCode);
    
    console.log("\nService layer:");
    console.log("Operation:", finalError.cause.operation);
    console.log("Message:", finalError.cause.message);
    
    console.log("\nDatabase layer:");
    console.log("Query:", finalError.cause.cause.query);
    console.log("Error code:", finalError.cause.cause.errorCode);
    console.log("Retryable:", finalError.cause.cause.retryable);
    
    return finalError;
  }
}

const chainedError = simulateErrorChain();

// ============================================
// PART 4: PRACTICAL ERROR HANDLING PATTERNS
// ============================================
console.log("\n--- PART 4: Practical Error Handling ---\n");

// Pattern 1: Type-specific error handling
function handleError(error) {
  console.log("\nHandling error based on type:");
  
  if (error instanceof ValidationError) {
    console.log("→ Validation Error");
    console.log("  Return 400 Bad Request");
    console.log(`  Invalid field: ${error.field}`);
    return { status: 400, message: error.message, field: error.field };
  }
  
  if (error instanceof AuthError) {
    console.log("→ Authentication Error");
    console.log("  Return 401 Unauthorized");
    console.log(`  User: ${error.userId}`);
    return { status: error.code, message: error.message };
  }
  
  if (error instanceof DatabaseError) {
    console.log("→ Database Error");
    console.log("  Return 503 Service Unavailable");
    console.log(`  Retryable: ${error.retryable}`);
    if (error.retryable) {
      console.log("  → Suggest retry after 5 seconds");
    }
    return { status: 503, message: "Service temporarily unavailable" };
  }
  
  // Generic error
  console.log("→ Generic Error");
  console.log("  Return 500 Internal Server Error");
  return { status: 500, message: "Internal server error" };
}

// Test different error types
console.log("\nTest 1: Validation Error");
const valError = new ValidationError("Invalid email format", "email");
handleError(valError);

console.log("\nTest 2: Auth Error");
const authError = new AuthError("Invalid credentials", "user_123");
handleError(authError);

console.log("\nTest 3: Database Error");
const dbError = new DatabaseError(
  "Connection lost",
  "SELECT * FROM products",
  "CONN_TIMEOUT"
);
handleError(dbError);

// ============================================
// PART 5: ERROR RECOVERY STRATEGIES
// ============================================
console.log("\n--- PART 5: Error Recovery Strategies ---\n");

// Strategy 1: Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        console.log("Max retries reached, giving up");
        throw wrapError(error, `Failed after ${maxRetries} attempts`);
      }
      
      // Check if error is retryable
      if (error.retryable === false) {
        console.log("Error is not retryable");
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Strategy 2: Fallback
function withFallback(primaryFn, fallbackFn) {
  try {
    console.log("Trying primary function...");
    return primaryFn();
  } catch (error) {
    console.log("Primary failed, using fallback");
    console.log("Error:", error.message);
    return fallbackFn();
  }
}

console.log("Strategy 1: Retry with Backoff");
console.log("(Simulated with synchronous code)\n");

let attemptCount = 0;
function unreliableOperation() {
  attemptCount++;
  if (attemptCount < 3) {
    throw new DatabaseError("Temporary failure", "SELECT 1", "CONN_TIMEOUT");
  }
  return "Success!";
}

// Simulate retry
try {
  const result = retryWithBackoff(() => unreliableOperation(), 3, 100);
  console.log("Result:", result);
} catch (error) {
  console.log("Failed:", error.message);
}

console.log("\nStrategy 2: Fallback");
const result = withFallback(
  () => {
    throw new Error("Primary service unavailable");
  },
  () => {
    return "Cached data (fallback)";
  }
);
console.log("Result:", result);

// Strategy 3: Circuit Breaker
class CircuitBreaker {
  constructor(threshold = 3, timeout = 5000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
      console.log("Circuit breaker: HALF_OPEN (testing)");
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      console.log("Circuit breaker: CLOSED (recovered)");
    }
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.log(`Circuit breaker: OPEN (too many failures)`);
    }
  }
  
  getState() {
    return this.state;
  }
}

console.log("\nStrategy 3: Circuit Breaker");
const breaker = new CircuitBreaker(2, 3000);

async function testCircuitBreaker() {
  for (let i = 1; i <= 5; i++) {
    try {
      console.log(`\nRequest ${i}:`);
      await breaker.execute(async () => {
        if (i <= 2) {
          throw new Error("Service failure");
        }
        return "Success";
      });
      console.log("✓ Request succeeded");
    } catch (error) {
      console.log("✗ Request failed:", error.message);
    }
  }
}

testCircuitBreaker();

// ============================================
// PART 6: LOGGING VS FAILING FAST
// ============================================
setTimeout(() => {
  console.log("\n--- PART 6: Logging vs Failing Fast ---\n");
  
  // Pattern 1: Log and Continue (for non-critical errors)
  function processItems(items) {
    const results = [];
    const errors = [];
    
    for (let i = 0; i < items.length; i++) {
      try {
        const result = processItem(items[i]);
        results.push(result);
      } catch (error) {
        console.log(`⚠ Error processing item ${i}:`, error.message);
        errors.push({ index: i, error: error.message });
        // Continue processing other items
      }
    }
    
    return { results, errors };
  }
  
  function processItem(item) {
    if (!item.valid) {
      throw new ValidationError("Invalid item", "valid");
    }
    return item;
  }
  
  console.log("Pattern 1: Log and Continue (resilient)");
  const items = [
    { id: 1, valid: true },
    { id: 2, valid: false },  // Will fail
    { id: 3, valid: true }
  ];
  
  const processed = processItems(items);
  console.log("Processed:", processed.results.length, "items");
  console.log("Errors:", processed.errors.length, "items");
  
  // Pattern 2: Fail Fast (for critical errors)
  function initializeApp(config) {
    console.log("\nPattern 2: Fail Fast (for critical errors)");
    
    // Critical validations - fail immediately
    if (!config.apiKey) {
      throw new ValidationError("API key is required", "apiKey");
    }
    
    if (!config.database) {
      throw new ValidationError("Database config is required", "database");
    }
    
    console.log("✓ App initialized successfully");
    return true;
  }
  
  try {
    initializeApp({ apiKey: "abc123" }); // Missing database
  } catch (error) {
    console.log("✗ App failed to start:", error.message);
    console.log("  Field:", error.field);
    console.log("  Action: Exit process immediately");
  }
  
  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n=== SUMMARY ===\n");
  
  console.log("CUSTOM ERRORS:");
  console.log("✓ ValidationError - for input validation");
  console.log("✓ AuthError - for authentication issues");
  console.log("✓ DatabaseError - for database operations");
  console.log("✓ ServiceError - for business logic");
  console.log("✓ APIError - for HTTP endpoints\n");
  
  console.log("ERROR CHAINING:");
  console.log("✓ wrapError() preserves context");
  console.log("✓ cause property maintains error chain");
  console.log("✓ logErrorChain() traverses full chain\n");
  
  console.log("ERROR STRATEGIES:");
  console.log("✓ Retry - for transient failures");
  console.log("✓ Fallback - provide alternative");
  console.log("✓ Circuit Breaker - prevent cascade failures");
  console.log("✓ Logging - track non-critical issues");
  console.log("✓ Fail Fast - stop on critical errors\n");
  
  console.log("BEST PRACTICES:");
  console.log("1. Use specific error types");
  console.log("2. Preserve error context with chaining");
  console.log("3. Log errors with full chain");
  console.log("4. Choose strategy based on criticality");
  console.log("5. Make errors actionable");
}, 100);