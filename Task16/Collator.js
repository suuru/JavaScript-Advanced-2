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


console.log("\n" + "=".repeat(60));
console.log("LOCALE-AWARE STRING SORTING WITH ACCENTS");
console.log("=".repeat(60));

const names = ["Émile", "Étienne", "Erica", "Zoë", "Åke", "Álvaro", "Andre", "Ängel", "Özil"];

console.log("\n--- DEFAULT JAVASCRIPT SORT (NOT LOCALE-AWARE) ---");
console.log([...names].sort());

console.log("\n--- ENGLISH (en-US) SORT ---");
const englishCollator = new Intl.Collator("en-US");
console.log([...names].sort(englishCollator.compare));

console.log("\n--- SWEDISH (sv-SE) SORT ---");
// In Swedish, Å, Ä, Ö come AFTER Z
const swedishCollator = new Intl.Collator("sv-SE");
console.log([...names].sort(swedishCollator.compare));

console.log("\n--- GERMAN (de-DE) SORT ---");
// In German, Ä is treated like A, Ö like O, Ü like U
const germanCollator = new Intl.Collator("de-DE");
console.log([...names].sort(germanCollator.compare));

console.log("\n--- FRENCH (fr-FR) SORT ---");
const frenchCollator = new Intl.Collator("fr-FR");
console.log([...names].sort(frenchCollator.compare));

console.log("\n" + "=".repeat(60));
console.log("COLLATOR SENSITIVITY OPTIONS");
console.log("=".repeat(60));

const words = ["resume", "résumé", "Resume", "RESUME", "café", "cafe"];

console.log("\n--- BASE SENSITIVITY (ignore accents & case) ---");
const baseCollator = new Intl.Collator("en-US", { sensitivity: "base" });
console.log("Sorted:", [...words].sort(baseCollator.compare));
console.log("'resume' === 'résumé'?", baseCollator.compare("resume", "résumé") === 0);
console.log("'café' === 'cafe'?", baseCollator.compare("café", "cafe") === 0);

console.log("\n--- ACCENT SENSITIVITY (consider accents, ignore case) ---");
const accentCollator = new Intl.Collator("en-US", { sensitivity: "accent" });
console.log("Sorted:", [...words].sort(accentCollator.compare));
console.log("'resume' === 'résumé'?", accentCollator.compare("resume", "résumé") === 0);
console.log("'Resume' === 'resume'?", accentCollator.compare("Resume", "resume") === 0);

console.log("\n--- CASE SENSITIVITY (consider case, ignore accents) ---");
const caseCollator = new Intl.Collator("en-US", { sensitivity: "case" });
console.log("Sorted:", [...words].sort(caseCollator.compare));
console.log("'Resume' === 'resume'?", caseCollator.compare("Resume", "resume") === 0);

console.log("\n--- VARIANT SENSITIVITY (consider everything) ---");
const variantCollator = new Intl.Collator("en-US", { sensitivity: "variant" });
console.log("Sorted:", [...words].sort(variantCollator.compare));
console.log("'resume' === 'Resume'?", variantCollator.compare("resume", "Resume") === 0);