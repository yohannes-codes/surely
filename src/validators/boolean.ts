import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class BooleanValidator extends BaseValidator<boolean> {
  protected _true: boolean = false;
  protected _trueError: string = `value must be true`;
  protected _false: boolean = false;
  protected _falseError: string = `value must be false`;

  constructor() {
    super();
  }

  true(errorMessage?: string): this {
    this._true = true;
    this._trueError = errorMessage || this._trueError;
    return this;
  }

  false(errorMessage?: string): this {
    this._false = true;
    this._falseError = errorMessage || this._falseError;
    return this;
  }

  private _applyRefinementValidation(input: boolean): Result<boolean> {
    let value = input;

    if (this._true && !value) {
      return { success: false, error: this._trueError };
    }

    if (this._false && value) {
      return { success: false, error: this._falseError };
    }

    return { success: true, data: value };
  }

  protected _parse(input: any): Result<boolean> {
    let value = input;

    if (typeof value !== "boolean") {
      if (this._strict) {
        return { success: false, error: `value must be a boolean` };
      } else {
        if (
          value === "true" ||
          value === "TRUE" ||
          value === "True" ||
          value === 1 ||
          value === "1" ||
          value === "yes" ||
          value === "YES" ||
          value === "Yes" ||
          value === "on" ||
          value === "ON" ||
          value === "On" ||
          value === "Y" ||
          value === "y" ||
          value === "T" ||
          value === "t"
        ) {
          value = true;
        } else if (
          value === "false" ||
          value === "FALSE" ||
          value === "False" ||
          value === 0 ||
          value === "0" ||
          value === "no" ||
          value === "NO" ||
          value === "No" ||
          value === "off" ||
          value === "OFF" ||
          value === "Off" ||
          value === "N" ||
          value === "n" ||
          value === "F" ||
          value === "f"
        ) {
          value = false;
        } else {
          return { success: false, error: `value must be a boolean` };
        }
      }
    }

    return this._applyRefinementValidation(value);
  }
}
