/********************************************************************************************
 *                       JAVASCRIPT MODULE SYSTEMS — ONE PAGE EXPLANATION
 * ------------------------------------------------------------------------------------------
 * This single file explains:
 *  - ES Modules (import/export)
 *  - CommonJS (require/module.exports)
 *  - ESM specifics: static structure, live bindings, top-level await
 *  - Dynamic import()
 *  - Code splitting & lazy loading
 *  - Module organization & public API design
 *
 * All explanations are inside comments only.
 ********************************************************************************************/


/********************************************************************************************
 * SECTION 1 — MODULE SYSTEMS OVERVIEW
 ********************************************************************************************
 * JavaScript has two major module systems:
 *
 * ------------------------------------------------------------------------------------------
 * **1. ES MODULES (ESM)**
 * ------------------------------------------------------------------------------------------
 * - Official modern standard (browser + Node)
 * - Uses:   import ... from 'x'    and    export ...
 * - Runs in strict mode always
 * - Supports top-level await
 * - Statically analyzed (known at compile-time)
 * - File extensions: .mjs or .js when package.json has "type": "module"
 *
 * Example syntax:
 *
 *      // math.mjs
 *      export function add(a, b) { return a + b }
 *
 *      // main.mjs
 *      import { add } from './math.mjs'
 *      console.log(add(2, 3))
 *
 *
 * ------------------------------------------------------------------------------------------
 * **2. COMMONJS (CJS)**
 * ------------------------------------------------------------------------------------------
 * - Older Node.js system
 * - Uses:   const x = require('x')   and    module.exports = {}
 * - Not statically analyzed
 * - Fully synchronous
 * - Cannot use top-level await
 * - File extension: .cjs (or .js when NOT using ESM mode)
 *
 * Example syntax:
 *
 *      // math.cjs
 *      module.exports = { add(a, b) { return a + b } }
 *
 *      // main.cjs
 *      const { add } = require('./math.cjs')
 *      console.log(add(2, 3))
 ********************************************************************************************/



/********************************************************************************************
 * SECTION 2 — ESM SPECIFICS
 ********************************************************************************************/

// ------------------------------------------------------------------------------------------
// **STATIC STRUCTURE**
// ------------------------------------------------------------------------------------------
// ESM imports/exports must appear at the top level.
// They CANNOT be inside if, loops, functions, etc.
// The reason: the engine must know all imports before execution.
//
// For example, NOT allowed:
//      if (true) { import x from 'y' }  ❌
//
// Dynamic import() is allowed inside blocks (explained later).


// ------------------------------------------------------------------------------------------
// **LIVE BINDINGS**
// ------------------------------------------------------------------------------------------
// ESM exports are *references*, not copies.
// When a module updates an exported value, anyone who imported it sees the change.
//
// Example:
//      // counter.mjs
//      export let n = 0;
//      export function inc() { n++ }
//
//      // main.mjs
//      import { n, inc } from './counter.mjs'
//      console.log(n)    // 0
//      inc()
//      console.log(n)    // 1  <-- updated automatically (live)


// ------------------------------------------------------------------------------------------
// **TOP-LEVEL AWAIT**
// ------------------------------------------------------------------------------------------
// ESM supports using await directly at top level.
//
// Example:
//      const data = await fetch('/api')
//      console.log(data)
//
// CommonJS cannot do this.



/********************************************************************************************
 * SECTION 3 — DYNAMIC IMPORT (import())
 ********************************************************************************************/

// ------------------------------------------------------------------------------------------
// **import()**
// ------------------------------------------------------------------------------------------
// Dynamic import loads modules at runtime.
// Returns a Promise.
// Can be used anywhere: inside functions, conditions, loops, events, etc.
//
// Example:
//      const mod = await import('./math.mjs')
//      console.log(mod.add(2, 3))


// ------------------------------------------------------------------------------------------
// **CODE SPLITTING**
// ------------------------------------------------------------------------------------------
// Instead of loading ALL modules upfront, you load some only when needed.
// Good for performance.
//
// Example:
//      button.onclick = async () => {
//          const { heavyFeature } = await import('./heavy.mjs')
//          heavyFeature()
//      }


// ------------------------------------------------------------------------------------------
// **LAZY LOADING**
// ------------------------------------------------------------------------------------------
// Load the module only when user triggers a certain action or feature.
// Saves memory and speeds initial load.
//
// Example:
//      async function computeWhenAsked() {
//          const math = await import('./math.mjs')
//          return math.mul(100, 20)
//      }



/********************************************************************************************
 * SECTION 4 — MODULE ORGANIZATION & API DESIGN
 ********************************************************************************************/

// ------------------------------------------------------------------------------------------
// **Designing module boundaries**
// ------------------------------------------------------------------------------------------
// Each module should have ONE responsibility.
// Example boundaries:
//      - math operations
//      - database access
//      - authentication
//      - API helpers
//      - UI components (frontend)
//
// Clean boundaries make code easier to reuse and test.


// ------------------------------------------------------------------------------------------
// **Public API vs Internal Modules**
// ------------------------------------------------------------------------------------------
//
// PUBLIC API = What you intentionally expose.
// INTERNAL MODULES = Hidden files NOT meant for consumers.
//
// Example structure:
//
//      /lib
//         math/
//            add.js      (internal)
//            sub.js      (internal)
//            index.js    (public API)
//
//      /lib/math/index.js
//          export { default as add } from './add.js'
//          export { default as sub } from './sub.js'
//
// Consumers only import:
//
//      import { add } from './lib/math/index.js'
//
// They never import add.js directly (internal).


