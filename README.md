# Surely

> Version: 1.0.0-beta
> Type-safe validation for TypeScript

**Surely** is a lightweight, type-safe validation library for TypeScript.
It helps you define schemas for data, perform precise validation and transformation, and get predictable results — without throwing exceptions.

Surely’s philosophy is simple:
Validation should be explicit, functional, and never surprising.
Every check returns a structured result you can trust, without side effects or hidden coercions.

## 🌱 What Makes Surely Different

**Zero exceptions** — no try/catch gymnastics, just clean result.success checks.

**TypeScript-first** — every schema infers its own TypeScript type.

**Composable design** — chain transformations, mix validators, and build complex schemas.

**Lightweight** — zero runtime dependencies, built for both frontend and backend.

**Predictable flow** — from pre-transform to post-transform, every step is visible and testable.

## 🧩 Core Idea

Every validator in Surely extends the shared `BaseValidator<T> `— a fluent foundation that handles defaults, optionality, and transformation.

Validation is never thrown. Each parse returns a typed result:

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

This design makes Surely ideal for functional pipelines, API parsing, and any system that demands reliability without runtime chaos.

## 📦 Installation

```bash
npm install @yohannes.codes/surely
```

```ts
import { surely } from "@yohannes.codes/surely";
```

Surely has no external dependencies, only TypeScript itself.
You can use it in both Node and browser environments.

## ✨ Quick Start

```ts
import { surely } from "@yohannes.codes/surely";

// Primitive validation
surely.boolean().parse("true"); // ❌ fails
surely.number().parse(42); // ✅ success
surely.string().parse("hello"); // ✅ success

// Optional & Default
surely.number().optional().parse(undefined); // ✅
surely.string().default("guest").parse(undefined); // ✅ returns "guest"

// Custom validation
const adult = surely.number().customValidation((n) => {
  if (n >= 18) return { success: true, data: n };
  return { success: false, issues: [{ path: [], message: "Must be adult" }] };
});

adult.parse(17); // ❌ { success: false, issues: [...] }
adult.parse(22); // ✅ { success: true, data: 22 }
```

## 🛣️ Validation Flow

1. **Default & Optional Check**
   If a value is undefined:

   - A default value (if defined) is returned directly.
   - Otherwise, optional values simply pass validation.

2. **beforeFn**  
   Modify the input before internal validation.

3. **Internal Validation & Transform**  
   Type and structure are verified (e.g., is it a `number?` a `string`?).

4. **customFn**  
   Execute a user-defined validation that returns a `SurelyResult<T>`.

5. **afterFn**  
   Final transformation before returning valid data.

This predictable sequence means you always know why a value failed — and how it was transformed.

## 🧩 BaseValidator API

| Method            | Description                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `.optional()`     | Marks the value as optional — `undefined` passes validation.                 |
| `.default(value)` | Sets a default value. If input is `undefined`, this value is returned as-is. |
| `.coerce()`       | Enables automatic type coercion (e.g., string to number, string to boolean). |
| `.customFn(fn)`   | Runs after internal validation. Must return a `SurelyResult<T>`.             |
| `.beforeFn(fn)`   | Runs before internal validation.                                             |
| `.afterFn(fn)`    | Runs after successful validation, before returning.                          |
| `.clone()`        | Creates a copy of the validator with all its configurations and transforms.  |

Each of these returns this, allowing elegant, chainable validation flows. Except `.optional()` — it returns a `new OptionalValidator` that wraps the original validator.

```ts
import { surely } from "@yohannes.codes/surely";

const userSchema = surely
  .string()
  .beforeFn((v) => v?.trim())
  .customValidation((v) =>
    v.length >= 3
      ? { success: true, data: v }
      : { success: false, issues: [{ path: [], message: "Too short" }] }
  )
  .afterFn((v) => v.toUpperCase())
  .default("Guest");

const optionalUserSchema = userSchema.default(undefined).optional();

userSchema.parse(undefined); // ✅ "Guest"
userSchema.parse(" yo "); // ✅ "YO"
userSchema.parse("a"); // ❌ [{ message: "Too short" }]

optionalUserSchema.parse("  Alice  "); // ✅ "ALICE"
optionalUserSchema.parse(undefined); // ✅ undefined
```

This one schema:

- Accepts empty input and falls back to "Guest".
- Trims input before validation.
- Checks minimum length.
- Converts final result to uppercase.

That’s the Surely pattern — explicit control, graceful results.

---

## 🧠 API Overview

Surely provides a set of built-in validators.  
Each validator extends `BaseValidator<T>` and supports `.optional()`, `.default()`, `.coerce()`,`.beforeFn()`, `.customValidation()`, and `.afterFn()`.

### 🟢 BooleanValidator

```ts
surely.boolean();
surely.bool();
```

- `.coerce()` — converts `"true"`/`"false"` strings and `1`/`0` numbers to booleans

---

- `.truthy()` — accepts truthy value only
- `.falsy()` — accepts falsy value only

### 🔢 NumberValidator

```ts
surely.number();
surely.num();
```

- `.coerce()` — converts numeric strings to numbers
- `.round()` — rounds to nearest integer
- `.ceil()` — rounds up to nearest integer
- `.floor()` — rounds down to nearest integer
- `.clamp(min: number, max: number)` — clamps value within range

---

- `.lt(n: number)` — less than
- `.lte(n: number)` — less than or equal
- `.gt(n: number)` — greater than
- `.gte(n: number)` — greater than or equal
- `.range(min: number, max: number)` — within range
- `.int()` — must be an integer
- `.float()` — must be a floating-point number
- `.positive()` — must be positive
- `.negative()` — must be negative
- `.finite(state: boolean)` — must be finite/infinite
- `.even()` — must be even
- `.odd()` — must be odd
- `.multipleOf(factor: number)` — must be multiple of factor

### 📜 StringValidator

```ts
surely.string();
surely.str();
```

- `.coerce()` — converts numbers and booleans to strings
- `.trim()` — trims whitespace
- `.toLowerCase()` — converts to lowercase
- `.toUpperCase()` — converts to uppercase
- `.capitalize()` — capitalizes first letter
- `.prefix(prefix: string)` — adds prefix
- `.suffix(suffix: string)` — adds suffix
- `.replace(searchValue: string | RegExp, replaceValue: string)` — replaces substrings

---

- `.minLength(length: number)` — minimum length
- `.maxLength(length: number)` — maximum length
- `.length(length: number)` — exact length
- `.enums(values: string[])` — must be one of the specified values
- `.regex(regex: RegExp)` — matches regex pattern
- `.contains(substr: string)` — contains substring
- `.startsWith(prefix: string)` — starts with prefix
- `.endsWith(suffix: string)` — ends with suffix
- `.email()` — valid email format
- `.url()` — valid URL format
- `.uuid()` — valid UUID format
- `.ip()` — valid IP address
- `.numeric()` — contains only numeric characters
- `.alphanumeric()` — contains only alphanumeric characters
- `.hex()` — valid hexadecimal string
- `.alphabetic()` — contains only alphabetic characters
- `.mac()` — valid MAC address
- `.datetime()` — valid date string

### 🗓️ DateValidator

```ts
surely.date();
surely.dt();
```

- `.coerce()` — converts timestamps and date strings to Date objects
- `.add(offset: DateOffset)` — adds time offset

---

- `.before(date: Date)` — before specified date
- `.after(date: Date)` — after specified date
- `.between(start: Date, end: Date)` — between two dates
- `.daysAhead(n: number)` — within next n days
- `.daysAgo(n: number)` — within past n days
- `.day(weekday: DayEnum)` — specific day of week (0=Sunday)
- `.date(date: DateEnum)` — specific day of month
- `.month(month: MonthEnum)` — specific month
- `.year(year: number)` — specific year

### 🔢 EnumValidator

```ts
surely.enum(values: any[]);
```

- `.options` — getter to retrieve the enum values.

```ts
const colorValidator = surely.enum(["red", "green", "blue"]);
const colors = colorValidator.options; // ["red", "green", "blue"]
```

### 🔢 NativeEnumValidator

```ts
surely.nativeEnum(enumObject: object);
```

- `.options` — getter to retrieve the enum values.

```ts
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}
const colorValidator = surely.nativeEnum(Color);
const colors = colorValidator.options; // ["red", "green", "blue"]
```

### ObjectValidator

```ts
interface User {
  name: string;
  age: number;
  email?: string;
}
surely.object<User>(schema: {
   name: surely.string();
   age: surely.number();
   email: surely.string().optional();
   });
});
```

- `.getSchemaKeys()` — returns the keys of the object schema.
- `.loose()` — allows extra properties not defined in the schema.
- `.strict()` — disallows extra properties not defined in the schema **& is the default behavior**.
- `.asPartial()` — makes all properties optional.
- `.pick<K extends keyof T>(...keys: K[])` — creates a new schema with only the specified keys.
- `.omit<K extends keyof T>(...keys: K[])` — creates a new schema without the specified keys.

### 🧩 UnionValidator

```ts
surely.union([surely.string(), surely.number()]);
```

- `.validators` — getter to retrieve the array of member validators.

```ts
const unionValidator = surely.union([surely.string(), surely.number()]);
const validators = unionValidator.validators; // [StringValidator, NumberValidator]
```

### 🧾 Parsing & Validation Utilities

All validators expose a consistent set of parsing and validation utilities.

#### `.parse(input)`

Runs full validation and returns a structured result:

```ts
const result = surely.string().parse("hello");

if (result.success) console.log(result.data); // validated value
else console.error(result.issues); // list of issues
```

#### `.parseAnArray(input: any[])`

Validates an array of items using the same validator for each element.

- Returns `SurelyResult<T[]>`
- Collects and merges all element-level issues.

```ts
const result = surely.string().parseAnArray(["hello", "world", 123]);
// ❌ fails for element at index 2, inside subIssues with path containing '2'
```

#### `.parseARecord(input: Record<string, any>)`

Validates all properties of an object using the same validator.

- Returns `SurelyResult<Record<string, T>>`
- Reports sub-issues with property paths.

```ts
const result = surely.number().parseARecord({ a: 1, b: "two", c: 3 });
// ❌ fails with issues for property 'b', inside subIssues with path containing 'b'
```

#### `.validate(input)`

A shorthand for `.parse(input).success`.

It returns a simple boolean:

```ts
const isValid = surely.number().validate(42); // true
const isValid2 = surely.number().validate("not a number"); // false
```

#### `.validateAnArray(input: any[])`

Boolean shortcut for .parseAnArray(input).success.

```ts
surely.number().validateAnArray([1, 2, 3]); // ✅ true
surely.number().validateAnArray(["a", 2]); // ❌ false
```

#### `.validateARecord(input: Record<string, any>)`

Boolean shortcut for .parseARecord(input).success.

```ts
surely.string().validateARecord({ name: "John", title: 404 }); // false
```

### `Infer<T extends BaseValidator<any>>`

Extracts the validated TypeScript type from a validator.

```ts
const nameValidator = surely.string();
type Name = Infer<typeof nameValidator>; // string

const nameValidatorOptional = nameValidator.optional();
type OptionalName = Infer<typeof nameValidatorOptional>; // string | undefined

const userValidator = surely.object({
  name: surely.string(),
  age: surely.number(),
});
type User = Infer<typeof userValidator>;
// { name: string; age: number }

const userValidatorAsPartial = userValidator.asPartial();
type PartialUser = Infer<typeof userValidatorAsPartial>;
// { name?: string | undefined; age?: number | undefined; }
```

### Types & Enums

- `DayEnum` — Enum for days of the week (Monday=1 to Sunday=7)
- `DateEnum` — Enum for days of the month (1 to 31)
- `MonthEnum` — Enum for months of the year (January=1 to December=12)
- `DateParts` — Type representing parts of a date (day, date, month, year)

```ts
export type DateParts = {
  day?: DayEnum;
  date?: DateEnum;
  month?: MonthEnum;
  year?: number;
};
```

- `DateOffset` — Type representing time offsets for date manipulation

```ts
export type DateOffset = {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
};
```

- `Patterns` — Common regex patterns for string validation

```ts
export const patterns: { [key: string]: RegExp } = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  url: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabetic: /^[a-zA-Z]+$/,
  numeric: /^[0-9]+$/,
  hex: /^[0-9a-fA-F]+$/,
  mac: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
  datetime:
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/,
};
```

---

## 📜 License

MIT © 2025 yohannes.codes (Surely)

```

```
