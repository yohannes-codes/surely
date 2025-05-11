import { ArrayValidator } from "../src/validators/array";

describe("ArrayValidator.length", () => {
  let validator: ArrayValidator<any>;

  beforeEach(() => {
    validator = new ArrayValidator();
  });

  it("should pass when the array has the exact specified length", () => {
    const result = validator.length(3).parse([1, 2, 3]);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toEqual([1, 2, 3]);
  });

  it("should fail when the array has fewer elements than the specified length", () => {
    const result = validator.length(3).parse([1, 2]);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toEqual(["value must have exactly 3 elements"]);
  });

  it("should fail when the array has more elements than the specified length", () => {
    const result = validator.length(3).parse([1, 2, 3, 4]);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toEqual(["value must have exactly 3 elements"]);
  });

  it("should use a custom error message when provided", () => {
    const customError = "Array length is incorrect";
    const result = validator.length(3, customError).parse([1, 2]);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toEqual([customError]);
  });

  it("should fail when input is not an array", () => {
    const result = validator.length(3).parse("not an array");
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toEqual(["value must be an array"]);
  });
});
