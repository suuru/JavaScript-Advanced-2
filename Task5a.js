//1. Rewrite a chain of .then() calls using async/await
// Original Promise-based code
function getUser() {
  return fetch("/user")
    .then(res => res.json())
    .then(user => {
      console.log("User:", user);
      return fetch(`/orders/${user.id}`);
    })
    .then(res => res.json())
    .then(orders => {
      console.log("Orders:", orders);
      return orders;
    })
    .catch(err => {
      console.error("Error:", err);
    });
}

// Rewritten using async/await
async function getUser() {
  try {
    const userRes = await fetch("/user");
    const user = await userRes.json();
    console.log("User:", user);

    const orderRes = await fetch(`/orders/${user.id}`);
    const orders = await orderRes.json();
    console.log("Orders:", orders);

    return orders;
  } catch (err) {
    console.error("Error:", err);
  }
}
//async/await makes the control flow look synchronous while preserving async behavior.

//2. Rewrite async/await back into raw Promise chains
// Original async/await code
async function sumAsync() {
  const a = await Promise.resolve(10);
  const b = await Promise.resolve(20);
  return a + b;
}

//Desugared into Promise chains
function sumAsync() {
  return Promise.resolve(10)
    .then(a => {
      return Promise.resolve(20).then(b => a + b);
    });
}
//This shows how async/await is syntactic sugar over Promises.
//or cleaner version
function sumAsync() {
  return Promise.resolve(10)
    .then(a => Promise.resolve(20).then(b => a + b));
}
//Both versions are equivalent in behavior.

//3. Add intentional error + handle in .catch() and try/catch
//Promise chain with intentional error
function loadData() {
  return fetch("/data")
    .then(() => {
      throw new Error("Something went wrong!");
    })
    .then(() => console.log("Will not run"))
    .catch(err => {
      console.error("Caught in .catch():", err.message);
    });
}

loadData();
//B. Handle error inside async function with try/catch
//Intentional error using async/await
async function loadData() {
  try {
    await fetch("/data");
    throw new Error("Something went wrong!"); // intentional
  } catch (err) {
    console.error("Caught in try/catch:", err.message);
  }
}

loadData();
//C. Async function error handled externally with .catch()
//Even async functions return Promises—so .catch() still works.
async function loadData() {
  await fetch("/data");
  throw new Error("Boom!");
}

loadData().catch(err => {
  console.error("External catch:", err.message);
});
//This demonstrates error handling in both Promise chains and async/await.