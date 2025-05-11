import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class NumberValidator extends BaseValidator<number> {
  protected _add?: number = undefined;
  protected _subtract?: number = undefined;
  protected _multiply?: number = undefined;
  protected _divide?: number = undefined;
  protected _modulus?: number = undefined;
  protected _power?: number = undefined;
  protected _sqrt?: boolean = undefined;
  protected _abs?: boolean = undefined;
  protected _negate?: boolean = undefined;
  protected _round?: boolean = undefined;
  protected _ceil?: boolean = undefined;
  protected _floor?: boolean = undefined;

  protected _lt?: number = undefined;
  protected _ltError: string = `value must be less than maximum`;
  protected _gt?: number = undefined;
  protected _gtError: string = `value must be greater than minimum`;
  protected _lte?: number = undefined;
  protected _lteError: string = `value must be less than or equal to maximum`;
  protected _gte?: number = undefined;
  protected _gteError: string = `value must be greater than or equal to minimum`;
  protected _int: boolean = false;
  protected _intError: string = `value must be an integer`;
  protected _float: boolean = false;
  protected _floatError: string = `value must be a float`;
  protected _positive: boolean = false;
  protected _positiveError: string = `value must be a positive number`;
  protected _negative: boolean = false;
  protected _negativeError: string = `value must be a negative number`;
  protected _even: boolean = false;
  protected _evenError: string = `value must be an even number`;
  protected _odd: boolean = false;
  protected _oddError: string = `value must be an odd number`;
  protected _multipleOf?: number = undefined;
  protected _multipleOfError: string = `value must be a multiple of specified number`;
  protected _range?: [number, number] = undefined;
  protected _rangeError: string = `value must be within the specified range`;

  constructor() {
    super();
  }

  add(value: number): this {
    this._add = value;
    return this;
  }

  subtract(value: number): this {
    this._subtract = value;
    return this;
  }

  multiply(value: number): this {
    this._multiply = value;
    return this;
  }

  divide(value: number): this {
    if (value == 0) throw new Error("cannot divide by zero");
    this._divide = value;
    return this;
  }

  modulus(value: number): this {
    if (value == 0) throw new Error("cannot divide/module by zero");
    this._modulus = value;
    return this;
  }

  power(value: number): this {
    this._power = value;
    return this;
  }

  sqrt(): this {
    this._sqrt = true;
    return this;
  }

  abs(): this {
    this._abs = true;
    return this;
  }

  negate(): this {
    this._negate = true;
    return this;
  }

  round(): this {
    this._round = true;
    return this;
  }

  ceil(): this {
    this._ceil = true;
    return this;
  }

  floor(): this {
    this._floor = true;
    return this;
  }

  lt(value: number, errorMessage?: string): this {
    this._lt = value;
    this._ltError = errorMessage || `value must be less than ${value}`;
    return this;
  }

  gt(value: number, errorMessage?: string): this {
    this._gt = value;
    this._gtError = errorMessage || `value must be greater than ${value}`;
    return this;
  }

  lte(value: number, errorMessage?: string): this {
    this._lte = value;
    this._lteError =
      errorMessage || `value must be less than or equal to ${value}`;
    return this;
  }

  gte(value: number, errorMessage?: string): this {
    this._gte = value;
    this._gteError =
      errorMessage || `value must be greater than or equal to ${value}`;
    return this;
  }

  int(errorMessage?: string): this {
    this._int = true;
    if (errorMessage) this._intError = errorMessage;
    return this;
  }

  float(errorMessage?: string): this {
    this._float = true;
    if (errorMessage) this._floatError = errorMessage;
    return this;
  }

  positive(errorMessage?: string): this {
    this._positive = true;
    if (errorMessage) this._positiveError = errorMessage;
    return this;
  }

  negative(errorMessage?: string): this {
    this._negative = true;
    if (errorMessage) this._negativeError = errorMessage;
    return this;
  }

  even(errorMessage?: string): this {
    this._even = true;
    if (errorMessage) this._evenError = errorMessage;
    return this;
  }

  odd(errorMessage?: string): this {
    this._odd = true;
    if (errorMessage) this._oddError = errorMessage;
    return this;
  }

  multipleOf(multipleOf: number, errorMessage?: string): this {
    this._multipleOf = multipleOf;
    this._multipleOfError =
      errorMessage || `value must be a multiple of ${multipleOf}`;
    return this;
  }

  range(min: number, max: number, errorMessage?: string): this {
    this._range = [min, max];
    this._rangeError =
      errorMessage || `value must be between ${min} and ${max}`;
    return this;
  }

  private _applyTransformations(input: number): number {
    let value = input;

    if (this._add) value += this._add;
    if (this._subtract) value -= this._subtract;
    if (this._multiply) value *= this._multiply;
    if (this._divide) value /= this._divide;
    if (this._modulus) value %= this._modulus;
    if (this._power) {
      if (value === 0 && this._power < 0) {
        throw new Error(`cannot raise zero to a negative power`);
      }
      value = Math.pow(value, this._power);
    }
    if (this._sqrt) value = Math.sqrt(value);
    if (this._abs) value = Math.abs(value);
    if (this._negate) value = -value;
    if (this._round) value = Math.round(value);
    if (this._ceil) value = Math.ceil(value);
    if (this._floor) value = Math.floor(value);

    return value;
  }

  private _applyRefinementValidation(input: number): Result<number> {
    let value = input;

    if (this._lt !== undefined && value >= this._lt) {
      return { success: false, error: this._ltError };
    }

    if (this._gt !== undefined && value <= this._gt) {
      return { success: false, error: this._gtError };
    }

    if (this._lte !== undefined && value > this._lte) {
      return { success: false, error: this._lteError };
    }
    if (this._gte !== undefined && value < this._gte) {
      return { success: false, error: this._gteError };
    }

    if (this._int && !Number.isInteger(value)) {
      return { success: false, error: this._intError };
    }

    if (this._float && Number.isInteger(value)) {
      return { success: false, error: this._floatError };
    }

    if (this._positive && value <= 0) {
      return { success: false, error: this._positiveError };
    }

    if (this._negative && value >= 0) {
      return { success: false, error: this._negativeError };
    }

    if (this._even && value % 2 !== 0) {
      return { success: false, error: this._evenError };
    }

    if (this._odd && value % 2 === 0) {
      return { success: false, error: this._oddError };
    }

    if (
      this._multipleOf !== undefined &&
      this._multipleOf !== 0 &&
      value % this._multipleOf !== 0
    ) {
      return { success: false, error: this._multipleOfError };
    }

    if (this._range && (value < this._range[0] || value > this._range[1])) {
      return { success: false, error: this._rangeError };
    }

    return { success: true, data: value };
  }

  protected _parse(input: any): Result<number> {
    let value = input;

    if (typeof value !== "number") {
      if (this._strict) {
        return { success: false, error: `value must be a number` };
      } else {
        const possiblyNaN = Number(value);
        if (!isNaN(possiblyNaN)) {
          value = possiblyNaN;
        } else {
          return { success: false, error: `value must be a number` };
        }
      }
    }

    value = this._applyTransformations(value);

    return this._applyRefinementValidation(value);
  }
}
