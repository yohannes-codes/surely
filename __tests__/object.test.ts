import { ObjectValidator } from "../src/validators/object";
import { StringValidator } from "../src/validators/string";
import { NumberValidator } from "../src/validators/number";
import { BooleanValidator } from "../src/validators/boolean";

describe("ObjectValidator", () => {
  it("should validate an object with correct schema", () => {
    const schema = {
      name: new StringValidator().minLength(3),
      age: new NumberValidator().gte(18),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse({
      name: "John",
      age: 25,
      isActive: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 25,
        isActive: true,
      });
    }
  });

  it("should return errors for invalid fields", () => {
    const schema = {
      name: new StringValidator().minLength(3),
      age: new NumberValidator().gte(18),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse({
      name: "Jo", // Too short
      age: 16, // Too young
      isActive: "nope", // Invalid boolean
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toEqual({
        name: "value must be at least 3 characters long",
        age: "value must be greater than or equal to 18",
        isActive: "value must be a boolean",
      });
    }
  });

  it("should handle extra fields in strict mode", () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator(),
    };

    const validator = new ObjectValidator(schema);
    (validator as any)._strict = true; // Enable strict mode

    const result = validator.parse({
      name: "John",
      age: 30,
      extraField: "not allowed",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toEqual({
        extraField: "extra field not allowed",
      });
    }
  });

  it("should allow extra fields in non-strict mode", () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse({
      name: "John",
      age: 30,
      extraField: "allowed",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 30,
      });
    }
  });

  it("should pick specific fields from the schema", () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator(),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema).pick(["name", "age"]);

    const result = validator.parse({
      name: "John",
      age: 30,
      isActive: true, // Should be ignored
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 30,
      });
    }
  });

  it("should omit specific fields from the schema", () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator(),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema).omit(["isActive"]);

    const result = validator.parse({
      name: "John",
      age: 30,
      isActive: true, // Should be ignored
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 30,
      });
    }
  });

  it("should return an error if input is not an object", () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse("not an object");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("expected an object");
    }
  });

  it("should validate nested objects", () => {
    const schema = {
      user: new ObjectValidator({
        name: new StringValidator().minLength(3),
        age: new NumberValidator().gte(18),
      }),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse({
      user: {
        name: "John",
        age: 25,
      },
      isActive: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        user: {
          name: "John",
          age: 25,
        },
        isActive: true,
      });
    }
  });

  it("should return errors for invalid nested objects", () => {
    const schema = {
      user: new ObjectValidator({
        name: new StringValidator().minLength(3),
        age: new NumberValidator().gte(18),
      }),
      isActive: new BooleanValidator(),
    };

    const validator = new ObjectValidator(schema);

    const result = validator.parse({
      user: {
        name: "Jo", // Too short
        age: 16, // Too young
      },
      isActive: "nope", // Invalid boolean
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toEqual({
        user: {
          name: "value must be at least 3 characters long",
          age: "value must be greater than or equal to 18",
        },
        isActive: "value must be a boolean",
      });
    }
  });
});
