function createLoggedObject(target) {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver);
      console.log(`GET: ${String(prop)} = ${value}`);
      return value;
    },
    
    set(obj, prop, value, receiver) {
      if (String(prop).startsWith('_')) {
        console.log(`SET BLOCKED: Cannot set property "${String(prop)}" - properties starting with _ are read-only`);
        return false;
      }
      const oldValue = Reflect.get(obj, prop, receiver);
      console.log(`SET: ${String(prop)} = ${value} (was ${oldValue})`);
      return Reflect.set(obj, prop, value, receiver);
    }
  });
}

// Example usage:
const user = createLoggedObject({
  name: 'Alice',
  age: 30,
  _id: 12345
});

// This will log the GET operation
console.log('\n--- Reading properties ---');
console.log(user.name);
console.log(user.age);
console.log(user._id);

// This will log the SET operation
console.log('\n--- Setting properties ---');
user.name = 'Bob';
user.age = 25;
user.email = 'bob@example.com';

// This will be BLOCKED
console.log('\n--- Attempting to set _ properties ---');
user._id = 99999;
user._secret = 'confidential';

// Verify the changes
console.log('\n--- Final values ---');
console.log(user.name);
console.log(user.age);
console.log(user.email);
console.log(user._id); // Should still be 12345