import { BaseValidator } from "../core/base";
import { patterns, SurelyResult } from "../exports";
import { respond } from "../utils/respond";

export class StringValidator extends BaseValidator<string> {
  _type!: string;

  private _trim?: boolean = undefined;
  private _casing?: "upper" | "lower" | "title" = undefined;
  private _prefix?: string = undefined;
  private _suffix?: string = undefined;
  private _replace: [string | RegExp, string][] = [];

  private _minLength?: number = undefined;
  private _maxLength?: number = undefined;
  private _length?: number = undefined;
  private _enum?: string[] = undefined;
  private _regex?: RegExp = undefined;
  private _contains?: string = undefined;
  private _startsWith?: string = undefined;
  private _endsWith?: string = undefined;
  private _pattern?:
    | "email"
    | "url"
    | "uuid"
    | "ip"
    | "mac"
    | "datetime"
    | "numeric"
    | "alphanumeric"
    | "hex"
    | "alphabetic" = undefined;

  constructor() {
    super();
  }

  trim = (): this => ((this._trim = true), this);
  uppercase = (): this => ((this._casing = "upper"), this);
  lowercase = (): this => ((this._casing = "lower"), this);
  capitalize = (): this => ((this._casing = "title"), this);
  prefix = (value: string): this => ((this._prefix = value), this);
  suffix = (value: string): this => ((this._suffix = value), this);
  replace = (search: string | RegExp, replacement: string): this => (
    this._replace.push([search, replacement]), this
  );

  minLength = (value: number): this => ((this._minLength = value), this);
  maxLength = (value: number): this => ((this._maxLength = value), this);
  length = (value: number): this => ((this._length = value), this);
  enum = (values: string[]): this => ((this._enum = values), this);
  regex = (pattern: RegExp): this => ((this._regex = pattern), this);
  contains = (value: string): this => ((this._contains = value), this);
  startsWith = (value: string): this => ((this._startsWith = value), this);
  endsWith = (value: string): this => ((this._endsWith = value), this);
  email = (): this => ((this._pattern = "email"), this);
  url = (): this => ((this._pattern = "url"), this);
  uuid = (): this => ((this._pattern = "uuid"), this);
  ip = (): this => ((this._pattern = "ip"), this);
  numeric = (): this => ((this._pattern = "numeric"), this);
  alphanumeric = (): this => ((this._pattern = "alphanumeric"), this);
  hex = (): this => ((this._pattern = "hex"), this);
  alphabetic = (): this => ((this._pattern = "alphabetic"), this);
  mac = (): this => ((this._pattern = "mac"), this);
  datetime = (): this => ((this._pattern = "datetime"), this);

  protected _parse(input: any, path: string = ""): SurelyResult<string> {
    let output: string;

    if (typeof input !== "string") {
      if (this._strict) return respond.error.type("string", input, path);

      output = input + "";
    } else output = input;

    if (this._trim) output = output.trim();
    if (this._casing === "upper") output = output.toUpperCase();
    else if (this._casing === "lower") output = output.toLowerCase();
    else if (this._casing === "title")
      output = output
        .toLowerCase()
        .replace(/(^|\s|-|_)\S/g, (match) => match.toUpperCase());

    if (this._prefix) output = this._prefix + output;
    if (this._suffix) output = output + this._suffix;
    if (this._replace.length) {
      for (const [searchValue, replaceValue] of this._replace) {
        output =
          searchValue instanceof RegExp
            ? output.replace(searchValue, replaceValue)
            : output.replaceAll(searchValue, replaceValue);
      }
    }

    if (this._minLength !== undefined && output.length < this._minLength) {
      return respond.error.generic(
        `[minLength] Expected the string to be at least ${this._minLength} characters, but received ${output.length} characters`,
        output,
        path
      );
    }
    if (this._maxLength !== undefined && output.length > this._maxLength) {
      return respond.error.generic(
        `[maxLength] Expected the string to be at most ${this._maxLength} characters, but received ${output.length} characters`,
        output,
        path
      );
    }
    if (this._length !== undefined && output.length !== this._length) {
      return respond.error.generic(
        `[length] Expected the string to be exactly ${this._length} characters, but received ${output.length} characters`,
        output,
        path
      );
    }
    if (this._enum !== undefined && !this._enum.includes(output)) {
      return respond.error.generic(
        `[enum] Expected the string to be one of [${this._enum.join(
          ", "
        )}], but received ${output}`,
        output,
        path
      );
    }
    if (this._regex !== undefined && !this._regex.test(output)) {
      return respond.error.generic(
        `[regex] Expected the string to match the pattern ${this._regex}, but received ${output}`,
        output,
        path
      );
    }
    if (this._contains !== undefined && !output.includes(this._contains)) {
      return respond.error.generic(
        `[contains] Expected the string to contain "${this._contains}", but received ${output}`,
        output,
        path
      );
    }
    if (
      this._startsWith !== undefined &&
      !output.startsWith(this._startsWith)
    ) {
      return respond.error.generic(
        `[startsWith] Expected the string to start with "${this._startsWith}", but received ${output}`,
        output,
        path
      );
    }
    if (this._endsWith !== undefined && !output.endsWith(this._endsWith)) {
      return respond.error.generic(
        `[endsWith] Expected the string to end with "${this._endsWith}", but received ${output}`,
        output,
        path
      );
    }
    if (this._pattern !== undefined) {
      if (patterns[this._pattern] && !patterns[this._pattern].test(output)) {
        return respond.error.generic(
          `[${this._pattern}] Expected the string to be a valid ${this._pattern}, but received ${output}`,
          output,
          path
        );
      }
    }

    return respond.success(output);
  }
}
