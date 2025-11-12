import { surely } from "../src";

describe("NumberValidator", () => {
  // BASIC VALIDATION
  test("validates a number", () => {
    const result = surely.number().parse(42);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(42);
    else throw new Error("Expected result to be successful");
  });

  test("invalidates a non-number", () => {
    const result = surely.number().parse("hello");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues[0].message).toMatch(/number/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // COERCION (opt-in)
  test("coerces string numbers when coerce() is used", () => {
    const result = surely.number().coerce().parse("12.5");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(12.5);
    else throw new Error("Expected result to be successful");
  });

  test("invalidates string numbers in strict (default) mode", () => {
    const result = surely.number().parse("12.5");
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues[0].message).toMatch(/number/i);
  });

  // ROUNDING
  test("round() rounds correctly", () => {
    const result = surely.number().round().parse(4.6);
    if (result.success) expect(result.data).toBe(5);
    else throw new Error("Expected result to be successful");
  });

  test("ceil() rounds up", () => {
    const result = surely.number().ceil().parse(4.1);
    if (result.success) expect(result.data).toBe(5);
    else throw new Error("Expected result to be successful");
  });

  test("floor() rounds down", () => {
    const result = surely.number().floor().parse(4.9);
    if (result.success) expect(result.data).toBe(4);
    else throw new Error("Expected result to be successful");
  });

  // CLAMP
  test("clamp() limits within range", () => {
    const schema = surely.number().clamp(10, 20);
    const [_15, _10, _20] = [15, 5, 25].map((n) => schema.parse(n));
    if (_10.success) expect(_10.data).toBe(10);
    else throw new Error("Expected result to be successful");
    if (_20.success) expect(_20.data).toBe(20);
    else throw new Error("Expected result to be successful");
    if (_15.success) expect(_15.data).toBe(15);
    else throw new Error("Expected result to be successful");
  });

  // RANGE CHECKS
  test("lt() enforces less-than", () => {
    const result = surely.number().lt(10).parse(12);
    expect(result.success).toBe(false);
  });

  test("gt() enforces greater-than", () => {
    const result = surely.number().gt(10).parse(9);
    expect(result.success).toBe(false);
  });

  test("lte() enforces less-than-or-equal", () => {
    const result = surely.number().lte(5).parse(6);
    expect(result.success).toBe(false);
  });

  test("gte() enforces greater-than-or-equal", () => {
    const result = surely.number().gte(5).parse(4);
    expect(result.success).toBe(false);
  });

  test("range() enforces inclusive bounds", () => {
    const schema = surely.number().range(5, 10);
    expect(schema.parse(7).success).toBe(true);
    expect(schema.parse(4).success).toBe(false);
    expect(schema.parse(11).success).toBe(false);
  });

  // TYPE
  test("int() requires integer", () => {
    const result = surely.number().int().parse(5.5);
    expect(result.success).toBe(false);
  });

  test("float() requires float", () => {
    const result = surely.number().float().parse(10);
    expect(result.success).toBe(false);
  });

  // POLARITY
  test("positive() allows only positive numbers", () => {
    const result = surely.number().positive().parse(-3);
    expect(result.success).toBe(false);
  });

  test("negative() allows only negative numbers", () => {
    const result = surely.number().negative().parse(3);
    expect(result.success).toBe(false);
  });

  // FINITE
  test("finite() rejects infinity", () => {
    const result = surely.number().finite().parse(Infinity);
    expect(result.success).toBe(false);
  });

  // PARITY
  test("even() accepts even numbers", () => {
    const result = surely.number().even().parse(4);
    expect(result.success).toBe(true);
  });

  test("even() rejects odd numbers", () => {
    const result = surely.number().even().parse(5);
    expect(result.success).toBe(false);
  });

  test("odd() accepts odd numbers", () => {
    const result = surely.number().odd().parse(7);
    expect(result.success).toBe(true);
  });

  test("odd() rejects even numbers", () => {
    const result = surely.number().odd().parse(6);
    expect(result.success).toBe(false);
  });

  // MULTIPLE OF
  test("multipleOf() validates multiples", () => {
    const result = surely.number().multipleOf(5).parse(20);
    expect(result.success).toBe(true);
  });

  test("multipleOf() rejects non-multiples", () => {
    const result = surely.number().multipleOf(5).parse(22);
    expect(result.success).toBe(false);
  });
});
