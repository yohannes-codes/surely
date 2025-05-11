import { DatetimeValidator } from "../src/validators/datetime";

describe("DatetimeValidator - before", () => {
  let validator: DatetimeValidator;

  beforeEach(() => {
    validator = new DatetimeValidator();
  });

  it("should set the _before property with a valid Date object", () => {
    const date = new Date("2023-01-01");
    validator.before(date);
    expect(validator["_before"]).toEqual(date);
  });

  it("should set the _before property with a valid date string", () => {
    const dateString = "2023-01-01";
    const date = new Date(dateString);
    validator.before(dateString);
    expect(validator["_before"]).toEqual(date);
  });

  it("should set the _beforeError property with a custom error message", () => {
    const date = new Date("2023-01-01");
    const errorMessage = "Custom error message";
    validator.before(date, errorMessage);
    expect(validator["_beforeError"]).toBe(errorMessage);
  });

  it("should set the default error message if no custom error message is provided", () => {
    const dateString = "2023-01-01";
    validator.before(dateString);
    expect(validator["_beforeError"]).toBe(
      `value must be before ${dateString}`
    );
  });

  it("should throw an error if an invalid date string is provided", () => {
    expect(() => {
      validator.before("invalid-date");
    }).toThrowError("Invalid date string provided.");
  });

  it("should throw an error if an invalid Date object is provided", () => {
    expect(() => {
      validator.before(new Date("invalid-date"));
    }).toThrowError("Invalid date string provided.");
  });
});
