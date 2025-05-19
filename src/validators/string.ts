import { BaseValidator } from "../types/base";
import { patterns } from "../types/patterns";
import { Result } from "../types/result";

export class StringValidator extends BaseValidator<string> {
  private _trim?: boolean = undefined;
  private _uppercase?: boolean = undefined;
  private _lowercase?: boolean = undefined;
  private _capitalize?: boolean = undefined;
  private _prefix?: string = undefined;
  private _suffix?: string = undefined;
  private _replace?: [string, string][] = undefined;

  private _minLength?: number = undefined;
  private _minLengthError: string = `value must be at least minimum length`;
  private _maxLength?: number = undefined;
  private _maxLengthError: string = `value must be at most maximum length`;
  private _length?: number = undefined;
  private _lengthError: string = `value must be the right length`;
  private _email?: boolean = undefined;
  private _emailError: string = `value must be a valid email`;
  private _url?: boolean = undefined;
  private _urlError: string = `value must be a valid url`;
  private _ip?: boolean = undefined;
  private _ipError: string = `value must be a valid ip`;
  private _uuid?: boolean = undefined;
  private _uuidError: string = `value must be a valid uuid`;
  private _regex?: RegExp = undefined;
  private _regexError: string = `value must match regex`;
  private _contains?: string = undefined;
  private _containsError: string = `value must contain specified string`;
  private _startsWith?: string = undefined;
  private _startsWithError: string = `value must start with specified string`;
  private _endsWith?: string = undefined;
  private _endsWithError: string = `value must end with specified string`;
  private _datetime?: boolean = undefined;
  private _datetimeError: string = `value must be a valid datetime`;
  private _date?: boolean = undefined;
  private _dateError: string = `value must be a valid date`;
  private _time?: boolean = undefined;
  private _timeError: string = `value must be a valid time`;
  private _enum?: string[] = undefined;
  private _enumError: string = `value must be one of the specified values`;

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
