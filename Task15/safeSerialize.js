function safeSerialize(value) {
  const seen = new WeakSet();
  
  function serialize(val) {
    // Handle primitives and null
    if (val === null || typeof val !== 'object') {
      return val;
    }
    
    // Check for circular reference
    if (seen.has(val)) {
      return "[Circular]";
    }
    
    // Mark this object as seen
    seen.add(val);
    
    // Handle Date
    if (val instanceof Date) {
      return val.toISOString();
    }
    
    // Handle Array
    if (Array.isArray(val)) {
      return val.map(item => serialize(item));
    }
    
    // Handle Object
    const serialized = {};
    for (const key in val) {
      if (val.hasOwnProperty(key)) {
        serialized[key] = serialize(val[key]);
      }
    }
    return serialized;
  }
  
  return JSON.stringify(serialize(value), null, 2);
}

// Example usage and testing:

// Test 1: Simple object without circular references
console.log('--- Test 1: Simple Object ---');
const simple = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'gaming']
};
console.log(safeSerialize(simple));

// Test 2: Object with circular reference
console.log('\n--- Test 2: Circular Reference ---');
const user = {
  name: 'Bob',
  age: 25
};
user.self = user; // Circular reference
console.log(safeSerialize(user));

// Test 3: Complex nested structure with multiple circular references
console.log('\n--- Test 3: Complex Circular Structure ---');
const company = {
  name: 'Tech Corp',
  employees: []
};

const emp1 = {
  name: 'Alice',
  company: company
};

const emp2 = {
  name: 'Bob',
  company: company,
  manager: emp1
};

emp1.subordinate = emp2;
company.employees.push(emp1, emp2);

console.log(safeSerialize(company));

// Test 4: Array with circular reference
console.log('\n--- Test 4: Array with Circular Reference ---');
const arr = [1, 2, 3];
arr.push(arr); // Circular reference in array
console.log(safeSerialize(arr));

// Test 5: Object with Date
console.log('\n--- Test 5: Object with Date ---');
const withDate = {
  event: 'Meeting',
  date: new Date('2024-12-03T10:00:00Z'),
  attendees: ['Alice', 'Bob']
};
console.log(safeSerialize(withDate));