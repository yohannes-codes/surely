import { BooleanValidator } from "../src/validators/boolean";

describe("BooleanValidator", () => {
  let validator: BooleanValidator;

  beforeEach(() => {
    validator = new BooleanValidator();
  });

  describe("true()", () => {
    it("should validate true values successfully", () => {
      validator.true();
      expect(validator.parse(true)).toEqual({ success: true, data: true });
    });

    it("should fail validation for false values when true() is set", () => {
      validator.true("Custom error message");
      expect(validator.parse(false)).toEqual({
        success: false,
        error: "Custom error message",
      });
    });
  });

  describe("false()", () => {
    it("should validate false values successfully", () => {
      validator.false();
      expect(validator.parse(false)).toEqual({ success: true, data: false });
    });

    it("should fail validation for true values when false() is set", () => {
      validator.false("Custom error message");
      expect(validator.parse(true)).toEqual({
        success: false,
        error: "Custom error message",
      });
    });
  });

  describe("_parse()", () => {
    it("should validate boolean values successfully", () => {
      expect(validator.parse(true)).toEqual({ success: true, data: true });
      expect(validator.parse(false)).toEqual({ success: true, data: false });
    });

    it("should coerce valid truthy string values to true", () => {
      expect(validator.parse("true")).toEqual({ success: true, data: true });
      expect(validator.parse("yes")).toEqual({ success: true, data: true });
      expect(validator.parse("on")).toEqual({ success: true, data: true });
      expect(validator.parse("T")).toEqual({ success: true, data: true });
    });

    it("should coerce valid falsy string values to false", () => {
      expect(validator.parse("false")).toEqual({ success: true, data: false });
      expect(validator.parse("no")).toEqual({ success: true, data: false });
      expect(validator.parse("off")).toEqual({ success: true, data: false });
      expect(validator.parse("F")).toEqual({ success: true, data: false });
    });

    it("should fail for invalid boolean-like values", () => {
      expect(validator.parse("invalid")).toEqual({
        success: false,
        error: "value must be a boolean",
      });
      expect(validator.parse(123)).toEqual({
        success: false,
        error: "value must be a boolean",
      });
    });

    it("should fail for non-boolean values in strict mode", () => {
      (validator as any)._strict = true;
      expect(validator.parse("true")).toEqual({
        success: false,
        error: "value must be a boolean",
      });
      expect(validator.parse(1)).toEqual({
        success: false,
        error: "value must be a boolean",
      });
    });
  });
});
