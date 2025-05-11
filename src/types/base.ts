import { Result } from "./result";

/**
 * An abstract base class for creating custom validators with support for default values,
 * optional values, transformations, and custom validation logic.
 *
 * @template T - The type of the value being validated.
 */
export abstract class BaseValidator<T> {
  protected _strict: boolean = false;
  protected _default: any = undefined;
  protected _optional: boolean = false;
  protected _customValidationFn?: <T>(value: any) => Result<T> = undefined;

  constructor() {}

  protected abstract _parse(input: any): Result<T>;

  strict(): this {
    this._strict = true;
    return this;
  }

  default(value: any): this {
    this._default = value;
    return this;
  }

  optional(): this {
    this._optional = true;
    return this;
  }

  customValidation(fn: <T>(value: any) => Result<T>): this {
    this._customValidationFn = fn;
    return this;
  }

  parse(input: any): Result<T> {
    let value: any = input;

    if (this._default !== undefined && value === undefined) {
      value = this._default;
    }

    if (value === undefined) {
      return this._optional
        ? { success: true, data: undefined as T }
        : { success: false, error: "value is required" as any };
    }

    const result = this._parse(value);

    if (!result.success) return result;

    value = result.data;

    if (this._customValidationFn) {
      const customResult = this._customValidationFn<T>(value);
      if (!customResult.success) return customResult;

      if (customResult.data !== undefined) value = customResult.data;
    }

    return { success: true, data: value };
  }
}
