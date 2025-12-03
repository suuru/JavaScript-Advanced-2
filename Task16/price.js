/**********************************************************************
 * MULTI-LOCALE FORMATTING EXAMPLES
 * Same price in different currencies
 * Same date in different locales and formats
 **********************************************************************/

console.log("=".repeat(60));
console.log("SAME PRICE IN DIFFERENT CURRENCIES");
console.log("=".repeat(60));

const price = 1299.99;

// US - USD
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});
console.log("US (USD):     ", usdFormatter.format(price));

// Germany - EUR
const eurFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR"
});
console.log("Germany (EUR):", eurFormatter.format(price));

// Japan - JPY
const jpyFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY"
});
console.log("Japan (JPY):  ", jpyFormatter.format(price));


console.log("\n" + "=".repeat(60));
console.log("SAME DATE IN DIFFERENT LOCALES & FORMATS");
console.log("=".repeat(60));

const date = new Date("2025-12-15T13:25:00Z");

console.log("\n--- SHORT FORMAT ---");
console.log("US (short):     ", new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short"
}).format(date));

console.log("Germany (short):", new Intl.DateTimeFormat("de-DE", {
  dateStyle: "short",
  timeStyle: "short"
}).format(date));

console.log("Japan (short):  ", new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "short",
  timeStyle: "short"
}).format(date));


console.log("\n--- LONG FORMAT ---");
console.log("US (long):     ", new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "long"
}).format(date));

console.log("Germany (long):", new Intl.DateTimeFormat("de-DE", {
  dateStyle: "long",
  timeStyle: "long"
}).format(date));

console.log("Japan (long):  ", new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "long"
}).format(date));


console.log("\n--- FULL FORMAT ---");
console.log("US (full):     ", new Intl.DateTimeFormat("en-US", {
  dateStyle: "full",
  timeStyle: "full"
}).format(date));

console.log("Germany (full):", new Intl.DateTimeFormat("de-DE", {
  dateStyle: "full",
  timeStyle: "full"
}).format(date));

console.log("Japan (full):  ", new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "full",
  timeStyle: "full"
}).format(date));


console.log("\n" + "=".repeat(60));
console.log("BONUS: CUSTOM DATE FORMAT OPTIONS");
console.log("=".repeat(60));

// Custom format with specific options
console.log("\nUS (custom):   ", new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(date));

console.log("Germany (custom):", new Intl.DateTimeFormat("de-DE", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(date));

console.log("Japan (custom): ", new Intl.DateTimeFormat("ja-JP", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit"
}).format(date));