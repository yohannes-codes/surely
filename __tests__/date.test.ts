import { surely } from "../src";

describe("DateValidator", () => {
  const now = new Date();

  // BASIC VALIDATION
  test("validates Date instance", () => {
    const result = surely.date().parse(now);
    if (result.success) expect(result.data).toEqual(now);
    else throw new Error("Expected result to be successful");
  });

  test("invalidates non-Date (default strict mode)", () => {
    const result = surely.date().parse("2020-01-01");
    if (!result.success) expect(result.issues[0].message).toMatch(/Date/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // COERCION
  test("coerces ISO string to Date when using coerce()", () => {
    const dateStr = "2023-12-25";
    const result = surely.date().coerce().parse(dateStr);
    if (result.success) expect(result.data instanceof Date).toBe(true);
    else throw new Error("Expected result to be successful");
  });

  test("rejects invalid date strings even in coerce mode", () => {
    const result = surely.date().coerce().parse("not-a-date");
    if (!result.success) expect(result.issues[0].message).toMatch(/Date/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // BEFORE / AFTER / BETWEEN
  test("before() rejects later date", () => {
    const past = new Date("2020-01-01");
    const future = new Date("2030-01-01");
    const result = surely.date().before(past).parse(future);
    if (!result.success) expect(result.issues[0].message).toMatch(/before/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("after() rejects earlier date", () => {
    const past = new Date("2020-01-01");
    const result = surely.date().after(new Date("2022-01-01")).parse(past);
    if (!result.success) expect(result.issues[0].message).toMatch(/after/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("between() only allows within range", () => {
    const a = new Date("2020-01-01");
    const b = new Date("2030-01-01");
    const result = surely.date().between(a, b).parse(new Date("2025-01-01"));
    if (result.success) expect(result.data.getUTCFullYear()).toBe(2025);
    else throw new Error("Expected result to be successful");
  });

  test("between() rejects outside range", () => {
    const a = new Date("2020-01-01");
    const b = new Date("2030-01-01");
    const result = surely.date().between(a, b).parse(new Date("2035-01-01"));
    if (!result.success)
      expect(result.issues[0].message).toMatch(/before|after/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  // DAYS AHEAD / AGO
  test("daysAhead() passes correct future date", () => {
    const target = new Date();
    target.setUTCDate(target.getUTCDate() + 3);
    const result = surely.date().daysAhead(3).parse(target);
    if (result.success)
      expect(result.data.getUTCDate()).toBe(target.getUTCDate());
    else throw new Error("Expected result to be successful");
  });

  test("daysAhead() rejects wrong date", () => {
    const wrong = new Date();
    wrong.setUTCDate(wrong.getUTCDate() + 1);
    const result = surely.date().daysAhead(3).parse(wrong);
    if (!result.success) expect(result.issues[0].message).toMatch(/ahead/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("daysAgo() passes correct past date", () => {
    const target = new Date();
    target.setUTCDate(target.getUTCDate() - 2);
    const result = surely.date().daysAgo(2).parse(target);
    if (result.success)
      expect(result.data.getUTCDate()).toBe(target.getUTCDate());
    else throw new Error("Expected result to be successful");
  });

  // ADD
  test("add() shifts the date correctly", () => {
    const base = new Date("2024-01-01T00:00:00Z");
    const result = surely.date().add({ days: 1, hours: 2 }).parse(base);
    if (result.success)
      expect(result.data.getTime()).toBe(
        base.getTime() + 1 * 86400000 + 2 * 3600000
      );
    else throw new Error("Expected result to be successful");
  });

  // DATE PARTS
  test("day() enforces day of week", () => {
    // get Monday after today
    const monday = new Date();
    monday.setUTCDate(monday.getUTCDate() + ((1 + 7 - monday.getUTCDay()) % 7));
    const result = surely.date().day(1).parse(monday);
    if (result.success) expect(result.data.getUTCDay()).toBe(1);
    else throw new Error("Expected result to be successful");
  });

  test("day() rejects wrong weekday", () => {
    const today = new Date();
    const wrongDay = (today.getUTCDay() % 7) + 1;
    const result = surely.date().day(wrongDay).parse(today);
    if (!result.success)
      expect(result.issues[0].message).toMatch(/day of the week/i);
    else throw new Error("Expected result to be unsuccessful");
  });

  test("date() enforces calendar date", () => {
    const target = new Date("2024-06-15");
    const result = surely.date().date(15).parse(target);
    if (result.success) expect(result.data.getUTCDate()).toBe(15);
    else throw new Error("Expected result to be successful");
  });

  test("month() enforces calendar month", () => {
    const target = new Date("2024-07-10");
    const result = surely.date().month(7).parse(target);
    if (result.success) expect(result.data.getUTCMonth() + 1).toBe(7);
    else throw new Error("Expected result to be successful");
  });

  test("year() enforces year", () => {
    const target = new Date("2022-08-05");
    const result = surely.date().year(2022).parse(target);
    if (result.success) expect(result.data.getUTCFullYear()).toBe(2022);
    else throw new Error("Expected result to be successful");
  });

  test("year() rejects wrong year", () => {
    const target = new Date("2022-08-05");
    const result = surely.date().year(2023).parse(target);
    if (!result.success) expect(result.issues[0].message).toMatch(/year/i);
    else throw new Error("Expected result to be unsuccessful");
  });
});
