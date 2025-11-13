import { SurelyResult } from "./types/result";
import { SurelyIssue } from "./types/issue";
import { utils } from "../utils/utils";
import { respond } from "../utils/respond";

export abstract class BaseValidator<T> {
  abstract _type: T;

  protected _strict: boolean = true;
  protected _default: any = undefined;
  protected _beforeFn?: (value: any) => T | any = undefined;
  protected _afterFn?: (value: any) => T | any = undefined;
  protected _custom?: (value: T) => SurelyResult<T>;

  constructor() {}

  coerce = (): this => ((this._strict = false), this);
  default = (value: any): this => ((this._default = value), this);
  optional = () => new OptionalValidator(this);
  customFn = (fn: (value: T) => SurelyResult<T>) => ((this._custom = fn), this);

  beforeFn = (fn: (value: any) => T | any): this => (
    (this._beforeFn = fn), this
  );
  afterFn = (fn: (value: any) => T | any): this => ((this._afterFn = fn), this);

  clone(): this {
    return Object.assign(Object.create(this.constructor.prototype), this);
  }

  protected abstract _parse(input: any, path: string): SurelyResult<T>;

  parse(input: any, path: string = ""): SurelyResult<T> {
    if (input === undefined)
      if (this._default !== undefined)
        return respond.success(this._default as T);
      else return respond.error.required(path);

    let output: any = input;

    if (this._beforeFn) output = this._beforeFn(output);

    const innerParsingResult = this._parse(output, path);

    if (!innerParsingResult.success) return innerParsingResult;
    else output = innerParsingResult.data;

    if (this._custom) {
      const customValidationResult = this._custom(innerParsingResult.data);

      if (!customValidationResult.success) return customValidationResult;
      else output = customValidationResult.data;
    }

    if (this._afterFn) output = this._afterFn(output);

    return respond.success(output);
  }

  parseAnArray(input: any[], path: string = ""): SurelyResult<T[]> {
    if (!Array.isArray(input)) return respond.error.type("array", path, input);

    const output: T[] = [];
    const issues: SurelyIssue[] = [];

    for (let i = 0; i < input.length; i++) {
      const result = this.parse(input[i], utils.makePath(path, String(i)));
      if (result.success) output.push(result.data);
      else issues.push(...result.issues);
    }

    if (issues.length > 0)
      return respond.error.subIssues(
        `[array] One or more issues found in array elements.`,
        input,
        path,
        issues
      );
    else return respond.success(output);
  }

  parseARecord<R extends Record<string, any>>(
    input: R,
    path: string = "self"
  ): SurelyResult<Record<string, T>> {
    if (!utils.isObject(input))
      return respond.error.type(path, "object", input);

    const output = {} as Record<keyof R, T>;
    const issues: SurelyIssue[] = [];

    for (const key in input) {
      const result = this.parse(input[key], utils.makePath(path, String(key)));

      if (result.success) output[key] = result.data;
      else issues.push(...result.issues);
    }

    if (issues.length > 0)
      return respond.error.subIssues(
        `[record] One or more issues found in record properties.`,
        input,
        path,
        issues
      );
    else return respond.success(output);
  }

  validate = (input: any) => this.parse(input).success;

  validateAnArray = (input: any[]) => this.parseAnArray(input).success;

  validateARecord = <R extends Record<string, any>>(input: R) =>
    this.parseARecord(input).success;
}

export class OptionalValidator<T> extends BaseValidator<T | undefined> {
  _type!: T | undefined;
  private _inner: BaseValidator<T>;

  constructor(inner: BaseValidator<T>) {
    super();
    this._inner = inner;
  }

  parse(input: any, path = ""): SurelyResult<T | undefined> {
    if (input === undefined || input === null)
      return respond.success(undefined);
    else return this._inner.parse(input, path);
  }
  protected _parse = (input: any, path = "") => this._inner.parse(input, path);
}
