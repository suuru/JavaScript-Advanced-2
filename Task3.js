// Create the config object
const config = {};

// 1. version - read-only property
Object.defineProperty(config, 'version', {
  value: '1.0.0',
  writable: false,      // Cannot be changed
  enumerable: true,     // Shows up in loops
  configurable: false   // Cannot be deleted or reconfigured
});

// 2. secret - non-enumerable property
Object.defineProperty(config, 'secret', {
  value: 'my-secret-key-12345',
  writable: true,       // Can be changed
  enumerable: false,    // Hidden from loops and Object.keys()
  configurable: true    // Can be deleted if needed
});

// 3. timestamp - accessor property (getter)
Object.defineProperty(config, 'timestamp', {
  get: function() {
    return new Date().toISOString();
  },
  enumerable: true,
  configurable: true
});

// ========== TESTING ==========

console.log('--- Testing the config object ---\n');

// Test version (read-only)
console.log('Version:', config.version);
config.version = '2.0.0'; // Try to change it
console.log('After attempting to change:', config.version); // Still 1.0.0
console.log('✓ version is read-only\n');

// Test secret (non-enumerable)
console.log('Secret value:', config.secret);
console.log('Keys visible in Object.keys():', Object.keys(config));
console.log('✓ secret is hidden from enumeration\n');

// Test timestamp (accessor property)
console.log('Timestamp 1:', config.timestamp);
setTimeout(() => {
  console.log('Timestamp 2 (after delay):', config.timestamp);
  console.log('✓ timestamp returns current time dynamically\n');
  
  // ========== INSPECT ALL DESCRIPTORS ==========
  console.log('--- All Property Descriptors ---\n');
  const descriptors = Object.getOwnPropertyDescriptors(config);
  console.log(JSON.stringify(descriptors, null, 2));
}, 1000);