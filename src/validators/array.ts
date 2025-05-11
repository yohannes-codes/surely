import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class ArrayValidator<T extends BaseValidator<any>> extends BaseValidator<
  T[]
> {
  private _removeDuplicates: boolean = false;

  private _minLength?: number = undefined;
  private _minLengthError: string = `value must be at least minimum amount elements`;
  private _maxLength?: number = undefined;
  private _maxLengthError: string = `value must be at most maximum amount elements`;
  private _length?: number = undefined;
  private _lengthError: string = `value must be the right amount of elements`;
  private _nonEmpty: boolean = false;
  private _nonEmptyError: string = `value must be a non-empty array`;
  private _unique: boolean = false;
  private _uniqueError: string = `value must be unique`;
  private _of?: T = undefined;
  private _ofError: string = `value must be of the specified type & structure`;

  constructor() {
    super();
  }

  removeDuplicates(): this {
    this._removeDuplicates = true;
    return this;
  }

  minLength(value: number, errorMessage?: string): this {
    this._minLength = value;
    this._minLengthError =
      errorMessage || `value must have at least ${value} elements`;
    return this;
  }

  maxLength(value: number, errorMessage?: string): this {
    this._maxLength = value;
    this._maxLengthError =
      errorMessage || `value must have at most ${value} elements`;
    return this;
  }

  length(value: number, errorMessage?: string): this {
    this._length = value;
    this._lengthError =
      errorMessage || `value must have exactly ${value} elements`;
    return this;
  }

  nonEmpty(errorMessage?: string): this {
    this._nonEmpty = true;
    if (errorMessage) this._nonEmptyError = errorMessage;
    return this;
  }

  unique(errorMessage?: string): this {
    this._unique = true;
    if (errorMessage) this._uniqueError = errorMessage;
    return this;
  }

  of(value: T, errorMessage?: string): this {
    this._of = value;
    if (errorMessage) this._ofError = errorMessage;
    return this;
  }

  private applyTransformations(input: any[]): any[] {
    let value = input;

    if (this._removeDuplicates) {
      value = [...new Set(value)];
    }

    return value;
  }

  private applyRefinementValidation(input: any[]): Result<any[]> {
    const value = input;

    if (this._minLength !== undefined && value.length < this._minLength) {
      return { success: false, error: [this._minLengthError] };
    }

    if (this._maxLength !== undefined && value.length > this._maxLength) {
      return { success: false, error: [this._maxLengthError] };
    }

    if (this._length !== undefined && value.length !== this._length) {
      return { success: false, error: [this._lengthError] };
    }

    if (this._nonEmpty && value.length === 0) {
      return { success: false, error: [this._nonEmptyError] };
    }

    if (this._unique && new Set(value).size !== value.length) {
      return { success: false, error: [this._uniqueError] };
    }

    if (this._of !== undefined) {
      const errors = Array(value.length).fill("");

      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const result = this._of.parse(item);
        if (!result.success) errors[i] = result.error || this._ofError;
      }

      if (errors.some((error) => error !== "")) {
        return { success: false, error: errors };
      }
    }

    return { success: true, data: value };
  }

  protected _parse(input: any): Result<T[]> {
    let value = input;

    if (!Array.isArray(value)) {
      if (this._strict) {
        return { success: false, error: [`value must be an array`] };
      } else {
        if (typeof value === "string" && value.includes(",")) {
          value = value.split(",").map((item) => item.trim());
        } else {
          return { success: false, error: [`value must be an array`] };
        }
      }
    }

    value = this.applyTransformations(value);

    return this.applyRefinementValidation(value);
  }
}
