# Surely 🧠 – A Minimal, Type-Safe Validation Library

**Surely** is a lightweight, TypeScript-first validation library built for flexibility, safety, and simplicity — inspired by Zod, but designed to be faster and more minimal. No magic. Just clean validation.

---

## 🚀 Features

- ✅ Fully type-safe validation
- 🔗 Chainable validators
- 🎯 Enum & Union support
- 🧩 Object schema validation
- 🪄 Optional fields, strict mode, and error shaping
- 🔍 Developer-friendly errors

---

## 📦 Installation

```bash
npm install surely
# or
yarn add surely
```

---

## ✨ Quick Start

```ts
import { surely } from "surely";

// Primitive validation
surely.string().parse("hello"); // ✅ success
surely.number().parse("42"); // ❌ fails
surely.boolean().parse("notBoolean"); // ❌ fails

// Optional
surely.number().optional().parse(undefined); // ✅
```

---

## 🧱 Object Schemas

```ts
const user = surely
  .object({
    name: surely.string(),
    age: surely.number().optional(),
  })
  .strict();

user.parse({ name: "Yohannes", age: 30 }); // ✅
user.parse({ name: "Yohannes" }); // ✅
user.parse({ name: "Yohannes", extra: true }); // ❌ "extra field not allowed"
```

### ✂️ Pick & Omit

```ts
const full = surely.object({
  name: surely.string(),
  age: surely.number(),
  role: surely.string(),
});

const minimal = full.pick(["name", "age"]);
const stripped = full.omit(["role"]);
```

---

---

## 🔗 Union & Enum

```ts
const input = surely.union([surely.string(), surely.number()]);

input.parse("hello"); // ✅
input.parse(true); // ❌ ["expected string", "expected number"]

const role = surely.enum(["admin", "user", "guest"]);
role.parse("admin"); // ✅
```

---

## 🧪 Arrays

```ts
const tags = surely.array().of(surely.string());
tags.parse(["a", "b", "c"]); // ✅
tags.parse([1, "x"]); // ❌
```

---

## 🔧 API Overview

### common

| Method                | Description                       |
| --------------------- | --------------------------------- |
| `.parse()`            | Runs validation & returns result  |
| `.optional()`         | Makes the schema optional         |
| `.default()`          | Sets a default value if undefined |
| `.customValidation()` | Adds custom validation logic      |

### boolean

| Method             | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| boolean()          | Checks if the value is a boolean                            |
| boolean().strict() | only accepts booleans as input, no parsing even if possible |
| boolean().true()   | Validates if value is true                                  |
| boolean().false()  | Validates if value is false                                 |

### number

| Method                 | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| number()               | Checks if the value is a number                            |
| number().strict()      | only accepts numbers as input, no parsing even if possible |
| number().add(x)        | Adds x to the number                                       |
| number().subtract(x)   | Subtracts x from the number                                |
| number().multiply(x)   | Multiplies the number by x                                 |
| number().divide(x)     | Divides the number by x                                    |
| number().modulus(x)    | Returns the remainder of the number divided by x           |
| number().power(x)      | Raises the number to the power of x                        |
| number().sqrt()        | Returns the square root of the number                      |
| number().abs()         | Returns the absolute value of the number                   |
| number().negate()      | Negates the number                                         |
| number().round()       | Rounds the number to the nearest integer                   |
| number().ceil()        | Rounds the number up to the nearest integer                |
| number().floor()       | Rounds the number down to the nearest integer              |
| number().lt(x)         | Checks if the number is less than x                        |
| number().gt(x)         | Checks if the number is greater than x                     |
| number().lte(x)        | Checks if the number is less than or equal to x            |
| number().gte(x)        | Checks if the number is greater than or equal to x         |
| number().int()         | Converts the number to an integer                          |
| number().float()       | Converts the number to a float                             |
| number().positive()    | Checks if the number is positive                           |
| number().negative()    | Checks if the number is negative                           |
| number().even()        | Checks if the number is even                               |
| number().odd()         | Checks if the number is odd                                |
| number().multipleOf(x) | Checks if the number is a multiple of x                    |
| number().range(x, y)   | Checks if the number is between x and y                    |

### string

| Method                     | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| string()                   | Checks if the value is a string                      |
| string().strict()          | Does nothing, it's there coz it's in the base class  |
| string().trim()            | Removes whitespace from both ends of the string      |
| string().uppercase()       | Converts the string to uppercase                     |
| string().lowercase()       | Converts the string to lowercase                     |
| string().capitalize()      | Capitalizes the first letter of the string           |
| string().prefix(pre)       | Adds a prefix to the string                          |
| string().suffix(suf)       | Adds a suffix to the string                          |
| string().replace(old, new) | Replaces all occurrences of old with new             |
| string().minLength(len)    | Checks if the string is at least len characters long |
| string().maxLength(len)    | Checks if the string is at most len characters long  |
| string().length(len)       | Checks if the string is exactly len characters long  |
| string().email()           | Checks if the string is a valid email address        |
| string().url()             | Checks if the string is a valid URL                  |
| string().ip()              | Checks if the string is a valid IP address           |
| string().uuid()            | Checks if the string is a valid UUID                 |
| string().regex(pattern)    | Checks if the string matches the regex pattern       |
| string().matches(pattern)  | Checks if the string matches the pattern             |
| string().contains(sub)     | Checks if the string contains the substring          |
| string().startsWith(pre)   | Checks if the string starts with the prefix          |
| string().endsWith(suf)     | Checks if the string ends with the suffix            |
| string().datetime()        | Checks if the string is a valid datetime             |
| string().date()            | Checks if the string is a valid date                 |
| string().time()            | Checks if the string is a valid time                 |
| string().enum(elements)    | Checks if the string is a valid enum value           |

### datetime

| Method                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| datetime()              | Validates if value is a datetime                     |
| datetime().strict()     | only accepts date as input, will not perform parsing |
| datetime().before(date) | Checks if the date is before a given date            |
| datetime().after(date)  | Checks if the date is after a given date             |

### union

| Method                | Description                                         |
| --------------------- | --------------------------------------------------- |
| union(validators: []) | Validates if value is one of the types              |
| union().strict()      | Does nothing, it's there coz it's in the base class |

### array

| Method                      | Description                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| array()                     | Validates if value is an array                                               |
| array().strict()            | won't accept comma separated string (only array as input) when calling parse |
| array().removeDuplicates()  | Removes duplicate values from the array                                      |
| array().minLength(len)      | Checks if the array is at least len elements long                            |
| array().maxLength(len)      | Checks if the array is at most len elements long                             |
| array().length(len)         | Checks if the array is exactly len elements long                             |
| array().nonEmpty()          | Checks if the array is not empty                                             |
| array().unique()            | Checks if the array contains unique values                                   |
| array().of(type: validator) | Checks if the array contains elements of the specified type                  |

### object

| Method                | Description                                     |
| --------------------- | ----------------------------------------------- |
| object()              | Validates if value is an object                 |
| object().strict()     | Disallows extra fields                          |
| object().pick(fields) | Picks only the specified fields from the object |
| object().omit(fields) | Omits the specified fields from the object      |

---

## 📁 Import Variants

```ts
import { surely, s } from "surely";

s.str(); // alias for s.string()
s.num(); // alias for s.number()
```

---

## 💡 Why Surely?

- Lightweight and dependency-free
- Explicit design — no hidden coercions
- TypeScript-first: Types are inferred, always

---

## 📜 License

MIT © 2025 yohannes.codes (Surely)
