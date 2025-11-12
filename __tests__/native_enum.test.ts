import { Infer, surely } from "../src";

enum Color {
  RED = "red",
  GREEN = "green",
  BLUE = "blue",
}

enum Status {
  ACTIVE,
  INACTIVE,
  PENDING,
}

describe("EnumValidator (native enums)", () => {
  // BASIC STRING ENUM
  test("accepts a valid enum value", () => {
    const result = surely.nativeEnum(Color).parse("red");
    if (result.success) expect(result.data).toBe("red");
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid enum value", () => {
    const result = surely.nativeEnum(Color).parse("yellow");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // NUMBER ENUM
  test("accepts a valid number enum value", () => {
    const result = surely.nativeEnum(Status).parse(0);
    if (result.success) expect(result.data).toBe(0);
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid number enum value", () => {
    const result = surely.nativeEnum(Status).parse(5);
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // STRICT BEHAVIOR
  test("string enum does not accept number values", () => {
    const result = surely.nativeEnum(Color).parse(1);
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("number enum does not accept string values", () => {
    const result = surely.nativeEnum(Status).parse("ACTIVE");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // COERCION (opt-in)
  test("coerces string numeric '0' to 0 when coerce() is used", () => {
    const result = surely.nativeEnum(Status).coerce().parse("0");
    if (result.success) expect(result.data).toBe(0);
    else throw new Error("Expected result to be successful");
  });

  test("still rejects non-convertible strings in coerce() mode", () => {
    const result = surely.nativeEnum(Status).coerce().parse("five");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // ARRAY-LIKE MISUSE
  test("rejects literal arrays passed directly", () => {
    const result = surely.nativeEnum(["x", "y", "z"] as any).parse("y");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // OPTIONS PROPERTY
  test("exposes valid options array", () => {
    const schema = surely.nativeEnum(Color);
    expect(schema.options).toEqual(["red", "green", "blue"]);
  });
});
