import { surely } from "../src";

describe("BooleanValidator", () => {
  // BASIC (strict by default)
  test("validates true as boolean", () => {
    const result = surely.boolean().parse(true);
    if (result.success) expect(result.data).toBe(true);
    else throw new Error("Expected result to be successful");
  });

  test("invalidates non-boolean in strict mode (default)", () => {
    const result = surely.boolean().parse("true");
    if (!result.success) expect(result.issues[0].message).toMatch(/boolean/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // COERCION (must opt in)
  test("coerces 'true' string to true", () => {
    const result = surely.boolean().coerce().parse("true");
    if (result.success) expect(result.data).toBe(true);
    else throw new Error("Expected result to be successful");
  });

  test("coerces 'false' string to false", () => {
    const result = surely.boolean().coerce().parse("false");
    if (result.success) expect(result.data).toBe(false);
    else throw new Error("Expected result to be successful");
  });

  test("coerces 1 to true", () => {
    const result = surely.boolean().coerce().parse(1);
    if (result.success) expect(result.data).toBe(true);
    else throw new Error("Expected result to be successful");
  });

  test("coerces 0 to false", () => {
    const result = surely.boolean().coerce().parse(0);
    if (result.success) expect(result.data).toBe(false);
    else throw new Error("Expected result to be successful");
  });

  test("invalidates numbers other than 0 or 1 in coerce mode", () => {
    const result = surely.boolean().coerce().parse(2);
    if (!result.success) expect(result.issues[0].message).toMatch(/boolean/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("invalidates strings other than 'true'/'false' in coerce mode", () => {
    const result = surely.boolean().coerce().parse("yes");
    if (!result.success) expect(result.issues[0].message).toMatch(/boolean/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // TRUTHY/FALSY METHODS (work in strict mode too)
  test("truthy() rejects false", () => {
    const result = surely.boolean().truthy().parse(false);
    if (!result.success) expect(result.issues[0].message).toMatch(/truthy/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("truthy() accepts true", () => {
    const result = surely.boolean().truthy().parse(true);
    if (result.success) expect(result.data).toBe(true);
    else throw new Error("Expected result to be successful");
  });

  test("falsy() rejects true", () => {
    const result = surely.boolean().falsy().parse(true);
    if (!result.success) expect(result.issues[0].message).toMatch(/falsy/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("falsy() accepts false", () => {
    const result = surely.boolean().falsy().parse(false);
    if (result.success) expect(result.data).toBe(false);
    else throw new Error("Expected result to be successful");
  });
});
