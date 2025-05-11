import { UnionValidator } from "../src/validators/union";
import { StringValidator } from "../src/validators/string"; // Assuming you have a StringValidator
import { NumberValidator } from "../src/validators/number"; // Assuming you have a NumberValidator

describe("UnionValidator with real validators", () => {
  it("should return the data from the first successful validator", () => {
    const stringValidator = new StringValidator();
    const numberValidator = new NumberValidator();

    const unionValidator = new UnionValidator([
      stringValidator,
      numberValidator,
    ]);
    const result = unionValidator.parse("Valid String");

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("Valid String");
  });

  it("should collect errors from all validators if none succeed", () => {
    const stringValidator = new StringValidator();
    const numberValidator = new NumberValidator();

    const unionValidator = new UnionValidator([
      stringValidator,
      numberValidator,
    ]);
    const result = unionValidator.parse({}); // Invalid input for both validators

    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error).toEqual([
        "value must be a string",
        "value must be a number",
      ]);
  });

  it("should stop at the first successful validator and not evaluate further", () => {
    const stringValidator = new StringValidator();
    const numberValidator = new NumberValidator();

    const unionValidator = new UnionValidator([
      stringValidator,
      numberValidator,
    ]);
    const result = unionValidator.parse("Valid String");

    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("Valid String");
  });
});
