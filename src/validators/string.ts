import { BaseValidator } from "../types/base";
import { patterns } from "../types/patterns";
import { Result } from "../types/result";

export class StringValidator extends BaseValidator<string> {
  protected _trim?: boolean = undefined;
  protected _uppercase?: boolean = undefined;
  protected _lowercase?: boolean = undefined;
  protected _capitalize?: boolean = undefined;
  protected _prefix?: string = undefined;
  protected _suffix?: string = undefined;
  protected _replace?: [string, string][] = undefined;

  protected _minLength?: number = undefined;
  protected _minLengthError: string = `value must be at least minimum length`;
  protected _maxLength?: number = undefined;
  protected _maxLengthError: string = `value must be at most maximum length`;
  protected _length?: number = undefined;
  protected _lengthError: string = `value must be the right length`;
  protected _email?: boolean = undefined;
  protected _emailError: string = `value must be a valid email`;
  protected _url?: boolean = undefined;
  protected _urlError: string = `value must be a valid url`;
  protected _ip?: boolean = undefined;
  protected _ipError: string = `value must be a valid ip`;
  protected _uuid?: boolean = undefined;
  protected _uuidError: string = `value must be a valid uuid`;
  protected _regex?: RegExp = undefined;
  protected _regexError: string = `value must match regex`;
  protected _contains?: string = undefined;
  protected _containsError: string = `value must contain specified string`;
  protected _startsWith?: string = undefined;
  protected _startsWithError: string = `value must start with specified string`;
  protected _endsWith?: string = undefined;
  protected _endsWithError: string = `value must end with specified string`;
  protected _datetime?: boolean = undefined;
  protected _datetimeError: string = `value must be a valid datetime`;
  protected _date?: boolean = undefined;
  protected _dateError: string = `value must be a valid date`;
  protected _time?: boolean = undefined;
  protected _timeError: string = `value must be a valid time`;
  protected _enum?: string[] = undefined;
  protected _enumError: string = `value must be one of the specified values`;

  constructor() {
    super();
  }

  trim(): this {
    this._trim = true;
    return this;
  }

  uppercase(): this {
    this._uppercase = true;
    return this;
  }

  lowercase(): this {
    this._lowercase = true;
    return this;
  }

  capitalize(): this {
    this._capitalize = true;
    return this;
  }

  prefix(value: string): this {
    this._prefix = value;
    return this;
  }

  suffix(value: string): this {
    this._suffix = value;
    return this;
  }

  replace(value: [string, string][]): this {
    this._replace = value;
    return this;
  }

  minLength(value: number, errorMessage?: string): this {
    this._minLength = value;
    this._minLengthError =
      errorMessage || `value must be at least ${value} characters long`;
    return this;
  }

  maxLength(value: number, errorMessage?: string): this {
    this._maxLength = value;
    this._maxLengthError =
      errorMessage || `value must be at most ${value} characters long`;
    return this;
  }

  length(value: number, errorMessage?: string): this {
    this._length = value;
    this._lengthError =
      errorMessage || `value must be exactly ${value} characters long`;
    return this;
  }

  email(errorMessage?: string): this {
    this._email = true;
    if (errorMessage) this._emailError = errorMessage;
    return this;
  }

  url(errorMessage?: string): this {
    this._url = true;
    if (errorMessage) this._urlError = errorMessage;
    return this;
  }

  ip(errorMessage?: string): this {
    this._ip = true;
    if (errorMessage) this._ipError = errorMessage;
    return this;
  }

  uuid(errorMessage?: string): this {
    this._uuid = true;
    if (errorMessage) this._uuidError = errorMessage;
    return this;
  }

  regex(value: RegExp, errorMessage?: string): this {
    this._regex = value;
    this._regexError = errorMessage || `value must match regex: ${value}`;
    return this;
  }

  matches = this.regex;

  contains(value: string, errorMessage?: string): this {
    this._contains = value;
    this._containsError = errorMessage || `value must contain: ${value}`;
    return this;
  }

  startsWith(value: string, errorMessage?: string): this {
    this._startsWith = value;
    this._startsWithError = errorMessage || `value must start with: ${value}`;
    return this;
  }

  endsWith(value: string, errorMessage?: string): this {
    this._endsWith = value;
    this._endsWithError = errorMessage || `value must end with: ${value}`;
    return this;
  }

  datetime(errorMessage?: string): this {
    this._datetime = true;
    if (errorMessage) this._datetimeError = errorMessage;
    return this;
  }

  date(errorMessage?: string): this {
    this._date = true;
    if (errorMessage) this._dateError = errorMessage;
    return this;
  }

  time(errorMessage?: string): this {
    this._time = true;
    if (errorMessage) this._timeError = errorMessage;
    return this;
  }

  enum(values: string[], errorMessage?: string): this {
    this._enum = values;
    this._enumError =
      errorMessage || `value must be one of: ${values.join(", ")}`;
    return this;
  }

  private _applyTransformations(value: string): string {
    if (this._trim) value = value.trim();
    if (this._uppercase) value = value.toUpperCase();
    if (this._lowercase) value = value.toLowerCase();
    if (this._capitalize && value.length > 0)
      value = value.charAt(0).toUpperCase() + value.slice(1);
    if (this._prefix) value = this._prefix + value;
    if (this._suffix) value = value + this._suffix;
    if (this._replace) {
      for (const [searchValue, replaceValue] of this._replace) {
        value = value.replace(new RegExp(searchValue, "g"), replaceValue);
      }
    }

    return value;
  }

  private _applyRefinementValidation(input: string): Result<string> {
    let value = input;

    if (this._minLength !== undefined && value.length < this._minLength) {
      return { success: false, error: this._minLengthError };
    }

    if (this._maxLength !== undefined && value.length > this._maxLength) {
      return { success: false, error: this._maxLengthError };
    }

    if (this._length !== undefined && value.length !== this._length) {
      return { success: false, error: this._lengthError };
    }

    if (this._email && !patterns.email.test(value)) {
      return { success: false, error: this._emailError };
    }

    if (this._url && !patterns.url.test(value)) {
      return { success: false, error: this._urlError };
    }

    if (this._ip && !patterns.ip.test(value)) {
      return { success: false, error: this._ipError };
    }

    if (this._uuid && !patterns.uuid.test(value)) {
      return { success: false, error: this._uuidError };
    }

    if (this._regex && !this._regex.test(value)) {
      return { success: false, error: this._regexError };
    }

    if (this._contains && !value.includes(this._contains)) {
      return { success: false, error: this._containsError };
    }

    if (this._startsWith && !value.startsWith(this._startsWith)) {
      return { success: false, error: this._startsWithError };
    }

    if (this._endsWith && !value.endsWith(this._endsWith)) {
      return { success: false, error: this._endsWithError };
    }

    if (this._datetime && isNaN(Date.parse(value))) {
      return { success: false, error: this._datetimeError };
    }

    if (this._date && isNaN(Date.parse(value))) {
      return { success: false, error: this._dateError };
    }

    if (this._time && !/^\d{2}:\d{2}:\d{2}$/.test(value)) {
      return { success: false, error: this._timeError };
    }

    if (this._enum && !this._enum.includes(value)) {
      return { success: false, error: this._enumError };
    }

    return { success: true, data: value };
  }

  protected _parse(input: any): Result<string> {
    let value = input;

    if (typeof input !== "string") {
      return { success: false, error: "value must be a string" };
    }

    value = this._applyTransformations(value);

    return this._applyRefinementValidation(value);
  }
}
