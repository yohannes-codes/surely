import { ObjectValidator } from "../src/schemas/object";
import { NumberValidator } from "../src/schemas/number";
import { StringValidator } from "../src/schemas/string";
import { BooleanValidator } from "../src/schemas/boolean";
import { Infer } from "../src/exports";

describe("ObjectValidator", () => {
  const schema = new ObjectValidator({
    name: new StringValidator(),
    age: new NumberValidator(),
    isActive: new BooleanValidator(),
  });

  test("valid object passes", () => {
    const result = schema.parse({ name: "Yohannes", age: 28, isActive: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Yohannes",
        age: 28,
        isActive: true,
      });
    }
  });

  test("type mismatch fails in strict mode (default)", () => {
    const result = schema.parse({ name: 12, age: "28", isActive: "yes" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.issues.length).toBeGreaterThan(0);
  });

  test("accepts coercion when inner validators explicitly call .coerce()", () => {
    const schemaWithCoercion = new ObjectValidator({
      name: new StringValidator(),
      age: new NumberValidator().coerce(),
      isActive: new BooleanValidator().coerce(),
    });

    const result = schemaWithCoercion.parse({
      name: "Yohannes",
      age: "28",
      isActive: "true",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "Yohannes",
        age: 28,
        isActive: true,
      });
    }
  });

  test("rejects extra keys by default", () => {
    const schema = new ObjectValidator({
      name: new StringValidator(),
    });

    const result = schema.parse({ name: "Klaus", extra: 10 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0].subIssues![0].message).toMatch(/Unexpected keys/);
    }
  });

  test("partial allows missing keys", () => {
    const partial = schema.asPartial();
    const result = partial.parse({ name: "Yohannes" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual({ name: "Yohannes" });
  });

  test("pick() keeps only selected keys", () => {
    const picked = schema.pick(["name", "age"]);
    const result = picked.parse({ name: "Yohannes", age: 22 });
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data).toEqual({ name: "Yohannes", age: 22 });
  });

  test("omit() removes selected keys", () => {
    const omitted = schema.omit(["isActive"]);
    const result = omitted.parse({ name: "Yohannes", age: 22 });
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data).toEqual({ name: "Yohannes", age: 22 });
  });

  test("invalid schema element triggers error", () => {
    expect(() => {
      // @ts-expect-error: intentional misuse
      new ObjectValidator({ foo: "bar" });
    }).toThrow(/\[Invalid schema\]/);
  });

  test("non-object input fails", () => {
    const result = schema.parse("not-an-object" as any);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.issues[0].message).toMatch(/Expected object/);
  });
});
