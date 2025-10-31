import { SurelyResult } from "./types/result";
import { SurelyIssue } from "./types/issue";
import { utils } from "../utils/utils";
import { respond } from "../utils/respond";

export abstract class BaseValidator<T> {
  protected _strict: boolean = false;
  protected _default: any = undefined;
  protected _optional: boolean = false;
  protected _preTransformFn?: (value: any) => T | any = undefined;
  protected _postTransformFn?: (value: any) => T | any = undefined;
  protected _customValidationFn?: <T>(value: T) => SurelyResult<T> = undefined;

  constructor() {}

  get defaultValue(): any {
    return this._default;
  }
  get isOptional(): boolean {
    return this._optional;
  }

  strict = (): this => ((this._strict = true), this);
  default = (value: any): this => ((this._default = value), this);
  optional = (): this => ((this._optional = true), this);
  customValidationFn = (fn: <T>(value: T) => SurelyResult<T>): this => (
    (this._customValidationFn = fn), this
  );
  preTransform = (fn: (value: any) => T | any): this => (
    (this._preTransformFn = fn), this
  );
  postTransform = (fn: (value: any) => T | any): this => (
    (this._postTransformFn = fn), this
  );

  protected abstract _parse(input: any, path: string): SurelyResult<T>;

  parse(input: any, path: string = ""): SurelyResult<T> {
    if (input === undefined) {
      if (this._default !== undefined) {
        return respond.success(this._default);
      } else if (this._optional) {
        return respond.success(undefined as T);
      } else {
        return respond.error.required(path);
      }
    }

    let output: any = input;

    if (this._preTransformFn) output = this._preTransformFn(output);

    const innerParsingResult = this._parse(output, path);

    if (!innerParsingResult.success) return innerParsingResult;
    else output = innerParsingResult.data;

    if (this._customValidationFn) {
      const customValidationResult = this._customValidationFn(
        innerParsingResult.data
      );

      if (!customValidationResult.success) return customValidationResult;
      else output = customValidationResult.data;
    }

    if (this._postTransformFn) output = this._postTransformFn(output);

    return respond.success(output);
  }

  parseAnArray(input: any[], path: string = ""): SurelyResult<T[]> {
    if (!Array.isArray(input)) return respond.error.type(path, "array", input);

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

  validate(input: any): boolean {
    return this.parse(input).success;
  }

  validateAnArray(input: any[]): boolean {
    return this.parseAnArray(input).success;
  }

  validateARecord<R extends Record<string, any>>(input: R): boolean {
    return this.parseARecord(input).success;
  }
}
