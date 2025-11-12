import { surely } from "../src";

describe("EnumValidator", () => {
  // BASIC STRING ENUM
  test("accepts valid literal", () => {
    const result = surely.enum(["red", "green", "blue"]).parse("red");
    if (result.success) expect(result.data).toBe("red");
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid literal", () => {
    const result = surely.enum(["red", "green", "blue"]).parse("yellow");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // NUMBER ENUM
  test("accepts valid number literal", () => {
    const result = surely.enum([10, 20, 30]).parse(20);
    if (result.success) expect(result.data).toBe(20);
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid number literal", () => {
    const result = surely.enum([10, 20, 30]).parse(40);
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // MIXED ENUM (strict by default)
  test("accepts valid mixed literal", () => {
    const result = surely.enum(["a", 2, "c"]).parse(2);
    if (result.success) expect(result.data).toBe(2);
    else throw new Error("Expected result to be successful");
  });

  test("rejects string '2' since it's not strictly equal to number 2", () => {
    const result = surely.enum(["a", 2, "c"]).parse("2");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // DUPLICATE HANDLING
  test("handles duplicates gracefully", () => {
    const result = surely.enum(["x", "x", "y"] as const).parse("y");
    if (result.success) expect(result.data).toBe("y");
    else throw new Error("Expected result to be successful");
  });

  // OPTIONS PROPERTY
  test("options getter returns original list", () => {
    const schema = surely.enum(["on", "off"] as const);
    expect(schema.options).toEqual(["on", "off"]);
  });
});
