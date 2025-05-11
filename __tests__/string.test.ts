import { StringValidator } from "../src/validators/string";

describe("StringValidator", () => {
  it("should trim the input string", () => {
    const validator = new StringValidator().trim();
    const result = validator.parse("  hello  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");
  });

  it("should convert the input string to uppercase", () => {
    const validator = new StringValidator().uppercase();
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("HELLO");
  });

  it("should convert the input string to lowercase", () => {
    const validator = new StringValidator().lowercase();
    const result = validator.parse("HELLO");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");
  });

  it("should capitalize the input string", () => {
    const validator = new StringValidator().capitalize();
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("Hello");
  });

  it("should add a prefix to the input string", () => {
    const validator = new StringValidator().prefix("pre-");
    const result = validator.parse("fix");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("pre-fix");
  });

  it("should add a suffix to the input string", () => {
    const validator = new StringValidator().suffix("-post");
    const result = validator.parse("fix");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("fix-post");
  });

  it("should replace substrings in the input string", () => {
    const validator = new StringValidator().replace([["foo", "bar"]]);
    const result = validator.parse("foo is foo");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("bar is bar");
  });

  it("should enforce a minimum length", () => {
    const validator = new StringValidator().minLength(5);
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");

    const resultFail = validator.parse("hi");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be at least 5 characters long");
  });

  it("should enforce a maximum length", () => {
    const validator = new StringValidator().maxLength(5);
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");

    const resultFail = validator.parse("hello world");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be at most 5 characters long");
  });

  it("should enforce an exact length", () => {
    const validator = new StringValidator().length(5);
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");

    const resultFail = validator.parse("hi");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be exactly 5 characters long");
  });

  it("should validate email format", () => {
    const validator = new StringValidator().email();
    const result = validator.parse("test@example.com");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("test@example.com");

    const resultFail = validator.parse("invalid-email");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid email");
  });

  it("should validate URL format", () => {
    const validator = new StringValidator().url();
    const result = validator.parse("https://example.com");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("https://example.com");

    const resultFail = validator.parse("invalid-url");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid url");
  });

  it("should validate IP format", () => {
    const validator = new StringValidator().ip();
    const result = validator.parse("192.168.1.1");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("192.168.1.1");

    const resultFail = validator.parse("invalid-ip");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid ip");
  });

  it("should validate UUID format", () => {
    const validator = new StringValidator().uuid();
    const result = validator.parse("123e4567-e89b-12d3-a456-426614174000");
    expect(result.success).toBe(true);
    if (result.success)
      expect(result.data).toBe("123e4567-e89b-12d3-a456-426614174000");

    const resultFail = validator.parse("invalid-uuid");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid uuid");
  });

  it("should validate against a regex", () => {
    const validator = new StringValidator().regex(/^[a-z]+$/);
    const result = validator.parse("hello");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("hello");

    const resultFail = validator.parse("Hello123");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must match regex: /^[a-z]+$/");
  });

  it("should validate if the string contains a substring", () => {
    const validator = new StringValidator().contains("test");
    const result = validator.parse("this is a test");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("this is a test");

    const resultFail = validator.parse("no match here");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must contain: test");
  });

  it("should validate if the string starts with a substring", () => {
    const validator = new StringValidator().startsWith("start");
    const result = validator.parse("start of the string");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("start of the string");

    const resultFail = validator.parse("no match here");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must start with: start");
  });

  it("should validate if the string ends with a substring", () => {
    const validator = new StringValidator().endsWith("end");
    const result = validator.parse("this is the end");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("this is the end");

    const resultFail = validator.parse("no match here");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must end with: end");
  });

  it("should validate datetime format", () => {
    const validator = new StringValidator().datetime();
    const result = validator.parse("2023-01-01T12:00:00Z");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("2023-01-01T12:00:00Z");

    const resultFail = validator.parse("invalid-datetime");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid datetime");
  });

  it("should validate date format", () => {
    const validator = new StringValidator().date();
    const result = validator.parse("2023-01-01");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("2023-01-01");

    const resultFail = validator.parse("invalid-date");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid date");
  });

  it("should validate time format", () => {
    const validator = new StringValidator().time();
    const result = validator.parse("12:00:00");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("12:00:00");

    const resultFail = validator.parse("invalid-time");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be a valid time");
  });

  it("should validate against an enum", () => {
    const validator = new StringValidator().enum(["one", "two", "three"]);
    const result = validator.parse("two");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("two");

    const resultFail = validator.parse("four");
    expect(resultFail.success).toBe(false);
    if (!resultFail.success)
      expect(resultFail.error).toBe("value must be one of: one, two, three");
  });
});
