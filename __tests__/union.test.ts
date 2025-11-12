import { surely } from "../src";

describe("UnionValidator", () => {
  const schema = surely.union([surely.string(), surely.number()]);

  // BASIC VALIDATION
  test("validates a string successfully", () => {
    const result = schema.parse("hello");
    if (result.success) expect(result.data).toBe("hello");
    else throw new Error("Expected result to be successful");
  });

  test("validates a number successfully", () => {
    const result = schema.parse(123);
    if (result.success) expect(result.data).toBe(123);
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid type (boolean)", () => {
    const result = schema.parse(true);
    if (!result.success) {
      expect(result.issues[0].message).toMatch(/union/i);
      expect(result.issues.length).toBeGreaterThanOrEqual(1);
    } else throw new Error("Expected result to be unsuccessful");
  });

  // STRICT BEHAVIOR — no coercion leaks
  test("does not coerce values implicitly", () => {
    const result = schema.parse("42");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("42");

    const numSchema = surely.union([surely.number(), surely.boolean()]);
    const bad = numSchema.parse("123");
    expect(bad.success).toBe(false);
    if (!bad.success)
      expect(
        bad.issues[0].subIssues!.some((i) => /number|boolean/i.test(i.message))
      ).toBe(true);
  });

  // COERCION — explicit and safe
  test("coerces when inner validators explicitly call coerce()", () => {
    const coercive = surely.union([surely.string(), surely.number().coerce()]);
    const result = coercive.parse("42");
    if (result.success) expect(result.data).toBe("42");
    else throw new Error("Expected result to be successful");
  });

  // ERROR AGGREGATION
  test("aggregates multiple errors if all validators fail", () => {
    const result = schema.parse({});
    if (!result.success) {
      expect(result.issues[0].subIssues!.length).toBeGreaterThan(1);
      expect(
        result.issues[0].subIssues!.some((i) => /string/i.test(i.message))
      ).toBe(true);
      expect(
        result.issues[0].subIssues!.some((i) => /number/i.test(i.message))
      ).toBe(true);
    } else throw new Error("Expected result to be unsuccessful");
  });

  test("reports clear top-level union message", () => {
    const result = schema.parse([]);
    if (!result.success) expect(result.issues[0].message).toMatch(/union/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // NESTING
  test("supports nested unions", () => {
    const nested = surely.union([
      surely.boolean(),
      surely.union([surely.string(), surely.number()]),
    ]);
    const result = nested.parse("abc");
    if (result.success) expect(result.data).toBe("abc");
    else throw new Error("Expected result to be successful");
  });

  // SCHEMA VALIDATION
  test("throws if constructed with an empty array", () => {
    expect(() => surely.union([])).toThrow(/Must provide at least one/);
  });

  test("exposes validators through getter", () => {
    const validators = schema.validators;
    expect(Array.isArray(validators)).toBe(true);
    expect(validators.length).toBe(2);
  });
});
