# Surely

Surely is a lightweight, type-safe validation library for TypeScript.  
It helps you define schemas for your data, run validations and transformations, and get structured results — **without ever throwing exceptions**.

---

## Overview

Surely provides a fluent, chainable API for defining validation logic.  
Each validator is built on top of a shared `BaseValidator<T>` that provides core methods for default handling, optionality, transformations, and custom validations.

Validation never throws. Instead, every parse returns a `SurelyResult<T>` object:

```ts
type SurelyResult<T> =
  | { success: true; data: T }
  | { success: false; issues: SurelyIssue[] };

type SurelyIssue = {
  path: string[] | string;
  message: string;
  value?: any;
};
```

---

## 📦 Installation

```bash
npm install @yohannes.codes/surely
```

---

## ✨ Quick Start

```ts
import { surely } from "@yohannes.codes/surely";

// Primitive validation
surely.boolean().parse("notBoolean"); // ❌ fails
surely.number().parse("42"); // ❌ fails
surely.string().parse("hello"); // ✅ success

// Optional
surely.number().optional().parse(undefined); // ✅
```

## 🛣️ Validation Flow

1. **Default & Optional Check**

   - If the value is `undefined` and a default is provided, the default is returned immediately without any validation or transformation.
   - Optional values simply skip validation if `undefined`.

2. **Pre-Transform**  
   Modify the input before internal validation.

3. **Internal Validation & Transform**  
   Perform schema-specific checks (e.g. type checks).

4. **Custom Validation**  
   Execute a user-defined validation that returns a `SurelyResult<T>`.

5. **Post-Transform**  
   Final transformation before returning valid data.

## Base Methods

| Method                  | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `.strict()`             | Enables strict mode. Its effect depends on the validator type.               |
| `.default(value)`       | Sets a default value. If input is `undefined`, this value is returned as-is. |
| `.optional()`           | Marks the value as optional — `undefined` passes validation.                 |
| `.preTransform(fn)`     | Runs before internal validation.                                             |
| `.customValidation(fn)` | Runs after internal validation. Must return a `SurelyResult<T>`.             |
| `.postTransform(fn)`    | Runs after successful validation, before returning.                          |

## 💡 Why Surely?

- Lightweight and dependency-free
- Explicit design — no hidden coercions
- TypeScript-first: Types are inferred, always

---

## 📜 License

MIT © 2025 yohannes.codes (Surely)
