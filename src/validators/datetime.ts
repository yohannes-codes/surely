import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class DatetimeValidator extends BaseValidator<Date> {
  private _before?: Date = undefined;
  private _beforeError: string = `value must be before the specified date`;
  private _after?: Date = undefined;
  private _afterError: string = `value must be after the specified date`;

  constructor() {
    super();
  }

  before(value: Date | string, errorMessage?: string): this {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string provided.");
    }
    this._before = date;
    this._beforeError = errorMessage || `value must be before ${value}`;
    return this;
  }

  after(value: Date | string, errorMessage?: string): this {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date string provided.");
    }
    this._after = date;
    this._afterError = errorMessage || `value must be after ${value}`;
    return this;
  }

  private _applyRefinementValidation(value: Date): Result<Date> {
    if (this._before && value > this._before) {
      return {
        success: false,
        error: this._beforeError,
      };
    }

    if (this._after && value < this._after) {
      return {
        success: false,
        error: this._afterError,
      };
    }

    return { success: true, data: value };
  }

  protected _parse(input: any): Result<Date> {
    let value = input;

    if (!(value instanceof Date)) {
      if (this._strict) {
        return { success: false, error: `value must be a Date` };
      } else {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return { success: false, error: `value must be a Date` };
        } else {
          value = date;
        }
      }
    }

    return this._applyRefinementValidation(value);
  }
}
