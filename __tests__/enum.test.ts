import { EnumValidator } from "../src/validators/enum";

describe("EnumValidator", () => {
  describe("_parse", () => {
    it("should return success when the input is in the options", () => {
      const validator = new EnumValidator(["a", "b", "c"]);
      const result = validator["_parse"]("a");
      expect(result).toEqual({ success: true, data: "a" });
    });

    it("should return an error when the input is not in the options", () => {
      const validator = new EnumValidator(["a", "b", "c"]);
      const result = validator["_parse"]("d");
      expect(result).toEqual({
        success: false,
        error: "value must be one of: a,b,c",
      });
    });

    it("should handle numeric values correctly", () => {
      const validator = new EnumValidator([1, 2, 3]);
      const result = validator["_parse"](2);
      expect(result).toEqual({ success: true, data: 2 });
    });

    it("should return an error for undefined input", () => {
      const validator = new EnumValidator(["a", "b", "c"]);
      const result = validator["_parse"](undefined);
      expect(result).toEqual({
        success: false,
        error: "value must be one of: a,b,c",
      });
    });

    it("should return an error for null input", () => {
      const validator = new EnumValidator(["a", "b", "c"]);
      const result = validator["_parse"](null);
      expect(result).toEqual({
        success: false,
        error: "value must be one of: a,b,c",
      });
    });

    it("should handle empty options array", () => {
      const validator = new EnumValidator([]);
      const result = validator["_parse"]("a");
      expect(result).toEqual({
        success: false,
        error: "value must be one of: ",
      });
    });
  });
});
