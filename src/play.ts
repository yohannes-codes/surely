import { surely as s } from "./index";

console.log("🧠 Surely – Full Feature Walkthrough");

// ✅ STRING
console.log("---- String ----");
console.log(s.string().parse("hello")); // ✅
console.log(s.string().minLength(3).parse("hi")); // ❌ too short
console.log(s.string().maxLength(5).parse("hello!")); // ❌ too long
console.log(s.string().regex(/^a/).parse("apple")); // ✅
console.log(s.string().email().parse("x@x.com")); // ✅
console.log(s.string().url().parse("invalid")); // ❌
console.log(s.string().uuid().parse("550e8400-e29b-41d4-a716-446655440000")); // ✅
console.log(s.string().optional().parse(undefined)); // ✅

// ✅ NUMBER
console.log("---- Number ----");
console.log(s.number().parse(42)); // ✅
console.log(s.number().gte(10).lte(50).parse(5)); // ❌
console.log(s.number().optional().parse(undefined)); // ✅

// ✅ BOOLEAN
console.log("---- Boolean ----");
console.log(s.boolean().parse(true)); // ✅
console.log(s.boolean().parse("no")); // ❌

// ✅ ENUM
console.log("---- Enum ----");
const role = s.enum(["admin", "user", "guest"]);
console.log(role.parse("user")); // ✅
console.log(role.parse("unknown")); // ❌

// ✅ UNION
console.log("---- Union ----");
const nameOrId = s.union([s.string(), s.number()]);
console.log(nameOrId.parse("john")); // ✅
console.log(nameOrId.parse(99)); // ✅
console.log(nameOrId.parse(true)); // ❌ ["expected string", "expected number"]

// ✅ ARRAY
console.log("---- Array ----");
console.log(s.array().of(s.string()).parse(["a", "b", "c"])); // ✅
console.log(s.array().of(s.number()).parse(["a"])); // ❌

// ✅ OBJECT
console.log("---- Object ----");
const person = s
  .object({
    name: s.string(),
    age: s.number().optional(),
    email: s.string().email(),
  })
  .strict();

console.log(person.parse({ name: "John", email: "john@doe.com" })); // ✅
console.log(person.parse({ name: "John", age: 30, extra: true })); // ❌ extra field

// ✅ PICK / OMIT
const fullUser = s.object({
  id: s.number(),
  name: s.string(),
  email: s.string(),
  password: s.string(),
});
const publicUser = fullUser.omit(["password"]);
console.log(publicUser.parse({ id: 1, name: "Yo", email: "yo@mail.com" })); // ✅

const idOnly = fullUser.pick(["id"]);
console.log(idOnly.parse({ id: 999 })); // ✅

console.log("✅ Done testing Surely validators!");
