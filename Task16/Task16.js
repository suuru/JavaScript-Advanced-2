/**********************************************************************
 * INTERNATIONALIZATION (Intl) — Number, Date, Collation, Use Cases
 * Everything explained in simple terms with working code examples
 **********************************************************************/

/**********************************************************************
 * 1. NUMBER FORMATTING — Intl.NumberFormat
 * ---------------------------------------------------------------
 * Lets you format numbers based on language + region.
 * Common uses: currency, decimals, thousand separators.
 **********************************************************************/
console.log("\n--- 1. Intl.NumberFormat (Number Formatting) ---");

// Basic number formatting
const num = 1234567.89;

console.log("US format:", new Intl.NumberFormat("en-US").format(num));
console.log("German format:", new Intl.NumberFormat("de-DE").format(num));
console.log("Nigeria format:", new Intl.NumberFormat("en-NG").format(num));

// Currency formatting
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" });

console.log("USD:", usd.format(2500));
console.log("NGN:", ngn.format(2500));


/**********************************************************************
 * 2. DATE/TIME FORMATTING — Intl.DateTimeFormat
 * ---------------------------------------------------------------
 * Produces human-readable dates depending on the region.
 **********************************************************************/
console.log("\n--- 2. Intl.DateTimeFormat (Date/Time Formatting) ---");

const date = new Date("2025-12-15T13:25:00Z");

console.log("US date:", new Intl.DateTimeFormat("en-US").format(date));
console.log("UK date:", new Intl.DateTimeFormat("en-GB").format(date));
console.log("Nigeria date:", new Intl.DateTimeFormat("en-NG").format(date));
console.log("Japanese date:", new Intl.DateTimeFormat("ja-JP").format(date));

// Full readable date/time
console.log(
    "US (long style):",
    new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "long" }).format(date)
);


/**********************************************************************
 * 3. STRING COMPARISON — Intl.Collator
 * ---------------------------------------------------------------
 * Helps sort strings correctly according to language rules.
 * Useful for alphabetization, search, filters, UI lists.
 **********************************************************************/
console.log("\n--- 3. Intl.Collator (String Comparison) ---");

const names = ["Åke", "Ade", "Álvaro", "Zara", "Özil"];

// Default sort (may not follow language rules)
console.log("Default JS sort:", [...names].sort());

// Correct for Swedish
const swedish = new Intl.Collator("sv-SE");
console.log("Swedish sort:", [...names].sort(swedish.compare));

// Correct for Spanish
const spanish = new Intl.Collator("es-ES");
console.log("Spanish sort:", [...names].sort(spanish.compare));


/**********************************************************************
 * 4. PRACTICAL USE CASES
 **********************************************************************/
console.log("\n--- 4. PRACTICAL USE CASES ---");

/**************************************
 * A. Currency Formatting
 **************************************/
function formatCurrency(amount, currency, locale = "en-US") {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

console.log("₦ formatted:", formatCurrency(1500000, "NGN", "en-NG"));
console.log("$ formatted:", formatCurrency(499.99, "USD", "en-US"));
console.log("€ formatted:", formatCurrency(499.99, "EUR", "de-DE"));

/**************************************
 * B. Locale-Aware Sorting
 **************************************/
const cities = ["Ikeja", "Århus", "Ibadan", "Älmhult"];

const collator = new Intl.Collator("sv-SE", { sensitivity: "base" });
console.log("Locale sort:", cities.sort(collator.compare));

/**************************************
 * C. Human-Readable Dates
 **************************************/
function formatHumanDate(date, locale = "en-US") {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "full",
        timeStyle: "short"
    }).format(date);
}

console.log("US readable:", formatHumanDate(new Date(), "en-US"));
console.log("UK readable:", formatHumanDate(new Date(), "en-GB"));
console.log("Japan readable:", formatHumanDate(new Date(), "ja-JP"));
console.log("Nigeria readable:", formatHumanDate(new Date(), "en-NG"));