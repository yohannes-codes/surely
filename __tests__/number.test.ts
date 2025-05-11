import { NumberValidator } from "../src/validators/number";

describe("NumberValidator - range", () => {
  let validator: NumberValidator;

  beforeEach(() => {
    validator = new NumberValidator();
  });

  it("should pass when the value is within the range", () => {
    const result = validator.range(10, 20).parse(15);
    expect(result.success).toBe(true);
    if (result.success) expect(result!.data).toBe(15);
  });

  it("should fail when the value is below the range", () => {
    const result = validator.range(10, 20).parse(5);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toBe("value must be between 10 and 20");
  });

  it("should fail when the value is above the range", () => {
    const result = validator.range(10, 20).parse(25);
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toBe("value must be between 10 and 20");
  });

  it("should pass when the value is equal to the minimum of the range", () => {
    const result = validator.range(10, 20).parse(10);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(10);
  });

  it("should pass when the value is equal to the maximum of the range", () => {
    const result = validator.range(10, 20).parse(20);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(20);
  });

  it("should use a custom error message when provided", () => {
    const customMessage = "Custom range error";
    const result = validator.range(10, 20, customMessage).parse(25);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe(customMessage);
  });
});
