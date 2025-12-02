//---------------------------------------------------
// ADVANCED REGULAR EXPRESSION(Task 8)
// ---------------------------------------------------

//1. RegExp Flags
// Flags modify how a regular expression behaves.
//-----------------------------------------------------------------
// Here are the common flags used in JavaScript regular expressions:
// ------------------------------------------------------------------
// g	Global search (find all matches, not just the first)
// i	Case-insensitive search
// m	Multiline (^ and $ match start/end of each line, not entire string)
// s	DotAll mode — . matches newlines (\n)
// u	Unicode mode (enables proper Unicode handling, needed for \p{...})
// y	Sticky mode — matches only at the lastIndex, doesn't skip ahead

//Examples:
"Hello Hello".match(/hello/gi); // ["Hello", "Hello"]  (g + i)

"first\nsecond".match(/^second/m); // "second" (m)

"line1\nline2".match(/.+/s); // "line1\nline2" (s)

const r = /Hello/y;
r.lastIndex = 0;
r.test("Hello World"); // true
r.test("XHello");      // false because 'y' cannot skip characters

//2. Groups
// Groups allow you to capture and organize parts of a regex pattern.
//-----------------------------------------------------------------
// Here are the main types of groups in JavaScript regex:
// -------------------------------------------------------
// Capturing groups
//Normal parentheses capture matched text.
const m = "2025-11-30".match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(m[1], m[2], m[3]); // 2025 11 30

// /B. Non-capturing Groups (?:...)
// Use (?:...) to group without capturing.
// This is useful for applying quantifiers to a group without storing the match.
// Does grouping without capturing.
// Use when:
// You need grouping for alternation
// You don’t want output array entries
const k = "cat or dog".match(/(?:cat|dog)/);
console.log(k[0]);    // "cat" but no extra captures

//C. Named Groups (?<name>...)
//Gives captured groups names
const a = "2025-11-30".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/);
console.log(m.groups.year);  // 2025
console.log(m.groups.month); // 11
console.log(m.groups.day);   // 30

//Much cleaner than numeric indices.

//3. Lookarounds
// Lookarounds match conditions without consuming characters.
// A. Lookaheads
// ✔ Positive Lookahead (?=...)
// Match only if something follows.
"item42".match(/\d+(?= item)/); // null
"42 item".match(/\d+(?= item)/); // "42"

//✔ Negative Lookahead (?!...)
// Match only if something does NOT follow.
"abc!".match(/abc(?!\?)/); // "abc" (OK because not followed by "?")
"abc?".match(/abc(?!\?)/); // null

// B. Lookbehinds (supported in modern JS)
// ✔ Positive Lookbehind (?<=...)
// Match only if preceded by something.
"USD100".match(/(?<=USD)\d+/); // "100"

//✔ Negative Lookbehind (?<!...)
//Match only if not preceded by something.
"X100".match(/(?<!USD)\d+/); // "100"
"USD100".match(/(?<!USD)\d+/); // null

//4. Unicode in RegExp (u flag + \p{...})
//The u flag enables full Unicode.
///\p{...}/u matches characters with specific Unicode properties.

//Examples:
// Pattern	Meaning
// \p{L}	Any letter
// \p{N}	Any digit/number
// \p{Emoji}	Emoji characters
// \p{Script=Greek}	Greek alphabet characters

"π".match(/\p{Script=Greek}/u); // ["π"]
"🇳🇬".match(/\p{Emoji}/gu); // ["🇳🇬"]

//This is useful for:
// international names
// emojis
// multilingual data

//5. Performance Issues

// A. Catastrophic Backtracking
// Happens when a regex has:
// nested quantifiers (e.g., (.*)+, (a|aa)+)
// ambiguous paths
// Example of BAD regex:

/(a+)+$/   // extremely dangerous
"aaaaaaaaaaaaaaaaaaaa!".match(/(a+)+$/); 

//B. ReDoS (Regular Expression Denial of Service)
//Attackers send carefully crafted strings that cause catastrophic backtracking, slowing down or freezing servers.
//Example vulnerable regex:
/^(\w+)*$/
//Fix by using:
// atomic patterns
// lookaheads
// limiting repetition
// avoiding ambiguous quantifiers