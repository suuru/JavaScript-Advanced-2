function deepClone(value) {
  // Handle null and primitives
  if (value === null || typeof value !== 'object') {
    return value;
  }
  
  // Handle Date
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  
  // Handle Array
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item));
  }
  
  // Handle Object
  const clonedObj = {};
  for (const key in value) {
    if (value.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(value[key]);
    }
  }
  return clonedObj;
}

// Example usage and testing:
const original = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'gaming', 'coding'],
  address: {
    city: 'New York',
    country: 'USA',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060
    }
  },
  birthDate: new Date('1993-05-15'),
  friends: [
    { name: 'Bob', since: new Date('2015-01-01') },
    { name: 'Carol', since: new Date('2018-06-15') }
  ]
};

console.log('--- Original Object ---');
console.log(original);

const cloned = deepClone(original);

console.log('\n--- Cloned Object ---');
console.log(cloned);

// Test that it's a deep clone by modifying nested properties
console.log('\n--- Testing Deep Clone (modifying cloned object) ---');
cloned.name = 'Bob';
cloned.hobbies.push('swimming');
cloned.address.city = 'Los Angeles';
cloned.address.coordinates.lat = 34.0522;
cloned.birthDate.setFullYear(2000);
cloned.friends[0].name = 'David';

console.log('\n--- After Modifications ---');
console.log('Original name:', original.name); // Should still be 'Alice'
console.log('Cloned name:', cloned.name); // Should be 'Bob'

console.log('\nOriginal hobbies:', original.hobbies); // Should not include 'swimming'
console.log('Cloned hobbies:', cloned.hobbies); // Should include 'swimming'

console.log('\nOriginal city:', original.address.city); // Should still be 'New York'
console.log('Cloned city:', cloned.address.city); // Should be 'Los Angeles'

console.log('\nOriginal coordinates:', original.address.coordinates.lat); // Should still be 40.7128
console.log('Cloned coordinates:', cloned.address.coordinates.lat); // Should be 34.0522

console.log('\nOriginal birth year:', original.birthDate.getFullYear()); // Should still be 1993
console.log('Cloned birth year:', cloned.birthDate.getFullYear()); // Should be 2000

console.log('\nOriginal friend[0]:', original.friends[0].name); // Should still be 'Bob'
console.log('Cloned friend[0]:', cloned.friends[0].name); // Should be 'David'