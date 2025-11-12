import { surely } from "../src";

describe("StringValidator", () => {
  // BASIC VALIDATION
  test("validates a string", () => {
    const result = surely.string().parse("hello");
    if (result.success) expect(result.data).toBe("hello");
    else throw new Error("Expected result to be successful");
  });

  test("invalidates non-string by default (strict mode)", () => {
    const result = surely.string().parse(123);
    if (!result.success) expect(result.issues[0].message).toMatch(/string/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("coerces non-string when coerce() is used", () => {
    const result = surely.string().coerce().parse(123);
    if (result.success) expect(result.data).toBe("123");
    else throw new Error("Expected result to be successful");
  });

  // TRIM
  test("trims whitespace", () => {
    const result = surely.string().trim().parse("  test  ");
    if (result.success) expect(result.data).toBe("test");
    else throw new Error("Expected result to be successful");
  });

  // CASING
  test("uppercase()", () => {
    const result = surely.string().uppercase().parse("abc");
    if (result.success) expect(result.data).toBe("ABC");
    else throw new Error("Expected result to be successful");
  });

  test("lowercase()", () => {
    const result = surely.string().lowercase().parse("ABC");
    if (result.success) expect(result.data).toBe("abc");
    else throw new Error("Expected result to be successful");
  });

  test("capitalize()", () => {
    const result = surely.string().capitalize().parse("hello world");
    if (result.success) expect(result.data).toBe("Hello World");
    else throw new Error("Expected result to be successful");
  });

  // PREFIX / SUFFIX
  test("prefix()", () => {
    const result = surely.string().prefix("pre-").parse("fix");
    if (result.success) expect(result.data).toBe("pre-fix");
    else throw new Error("Expected result to be successful");
  });

  test("suffix()", () => {
    const result = surely.string().suffix("-post").parse("after");
    if (result.success) expect(result.data).toBe("after-post");
    else throw new Error("Expected result to be successful");
  });

  // REPLACE
  test("replace() replaces substring", () => {
    const result = surely
      .string()
      .replace("world", "there")
      .parse("hello world");
    if (result.success) expect(result.data).toBe("hello there");
    else throw new Error("Expected result to be successful");
  });

  test("replace() with regex works", () => {
    const result = surely.string().replace(/o/g, "0").parse("look");
    if (result.success) expect(result.data).toBe("l00k");
    else throw new Error("Expected result to be successful");
  });

  // LENGTH
  test("minLength()", () => {
    const result = surely.string().minLength(5).parse("hey");
    if (!result.success) expect(result.issues[0].message).toMatch(/minLength/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("maxLength()", () => {
    const result = surely.string().maxLength(3).parse("hello");
    if (!result.success) expect(result.issues[0].message).toMatch(/maxLength/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("length()", () => {
    const result = surely.string().length(4).parse("yo");
    if (!result.success) expect(result.issues[0].message).toMatch(/length/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // ENUM
  test("enum() only allows specified values", () => {
    const result = surely.string().enum(["cat", "dog"]).parse("fish");
    if (!result.success) expect(result.issues[0].message).toMatch(/enum/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // REGEX
  test("regex() validates custom pattern", () => {
    const result = surely
      .string()
      .regex(/^[A-Z]+$/)
      .parse("abc");
    if (!result.success) expect(result.issues[0].message).toMatch(/regex/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // CONTAINS / STARTS / ENDS
  test("contains()", () => {
    const result = surely.string().contains("foo").parse("barbaz");
    if (!result.success) expect(result.issues[0].message).toMatch(/contains/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("startsWith()", () => {
    const result = surely.string().startsWith("pre").parse("test");
    if (!result.success)
      expect(result.issues[0].message).toMatch(/startsWith/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("endsWith()", () => {
    const result = surely.string().endsWith("end").parse("start");
    if (!result.success) expect(result.issues[0].message).toMatch(/endsWith/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // PATTERN TESTS (email, url, uuid, etc.)
  test("email() rejects invalid email", () => {
    const result = surely.string().email().parse("not-an-email");
    if (!result.success) expect(result.issues[0].message).toMatch(/email/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("url() rejects invalid url", () => {
    const result = surely.string().url().parse("ftp:/wrong");
    if (!result.success) expect(result.issues[0].message).toMatch(/url/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("uuid() rejects invalid uuid", () => {
    const result = surely.string().uuid().parse("not-a-uuid");
    if (!result.success) expect(result.issues[0].message).toMatch(/uuid/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("ip() rejects invalid ip", () => {
    const result = surely.string().ip().parse("999.999.999.999");
    if (!result.success) expect(result.issues[0].message).toMatch(/ip/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("hex() rejects non-hex string", () => {
    const result = surely.string().hex().parse("ZXC123");
    if (!result.success) expect(result.issues[0].message).toMatch(/hex/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("alphanumeric() rejects symbols", () => {
    const result = surely.string().alphanumeric().parse("abc!");
    if (!result.success)
      expect(result.issues[0].message).toMatch(/alphanumeric/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("alphabetic() rejects numbers", () => {
    const result = surely.string().alphabetic().parse("abc123");
    if (!result.success)
      expect(result.issues[0].message).toMatch(/alphabetic/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("numeric() rejects letters", () => {
    const result = surely.string().numeric().parse("12ab");
    if (!result.success) expect(result.issues[0].message).toMatch(/numeric/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("mac() rejects wrong mac", () => {
    const result = surely.string().mac().parse("GG:HH:II:JJ:KK:LL");
    if (!result.success) expect(result.issues[0].message).toMatch(/mac/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("datetime() rejects invalid datetime", () => {
    const result = surely.string().datetime().parse("not-a-date");
    if (!result.success) expect(result.issues[0].message).toMatch(/datetime/i);
    else throw new Error("Expected result to be unsuccessful");
  });
});
