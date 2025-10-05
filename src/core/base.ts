import { SurelyResult } from "./types/result";
import { SurelyIssue } from "./types/issue";
import { utils } from "../utils/utils";

export abstract class BaseValidator<T> {
  protected _strict: boolean = false;
  protected _default: any = undefined;
  protected _optional: boolean = false;
  protected _preTransformFn?: (value: any) => T | any = undefined;
  protected _postTransformFn?: (value: any) => T | any = undefined;
  protected _customValidationFn?: <T>(value: T) => SurelyResult<T> = undefined;

  constructor() {}

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

  protected abstract _parse(
    input: any,
    path: string[] | string
  ): SurelyResult<T>;

  parse(input: any, path: string[] | string = ""): SurelyResult<T> {
    if (input === undefined) {
      if (this._default !== undefined) {
        return utils.success(this._default);
      } else if (this._optional) {
        return utils.success(undefined as T);
      } else {
        return utils.failure([
          {
            path: path,
            message: `[required] Expected real/defined value, but received nothing.`,
            value: input,
          },
        ]);
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

    return utils.success(output);
  }

  parseAnArray(input: any[], path: string = ""): SurelyResult<T[]> {
    if (!Array.isArray(input)) {
      return {
        success: false,
        issues: [
          {
            path: path,
            message: `[type] Expected an array, but received ${typeof input}`,
            value: input,
          },
        ],
      };
    }

    const output: T[] = [];
    const issues: SurelyIssue[] = [];

    for (let i = 0; i < input.length; i++) {
      const result = this.parse(input[i], [path, `${i}`]);
      if (result.success) output.push(result.data);
      else issues.push(...result.issues);
    }

    if (issues.length > 0) return { success: false, issues: issues };
    else return { success: true, data: output };
  }

  parseARecord<R extends Record<string, any>>(
    input: R,
    path: string = "self"
  ): SurelyResult<Record<string, T>> {
    if (!utils.isObject(input)) {
      return {
        success: false,
        issues: [
          {
            path: path,
            message: `[type] Expected a record/object, but received ${typeof input}`,
            value: input,
          },
        ],
      };
    }

    const output = {} as Record<keyof R, T>;
    const issues: SurelyIssue[] = [];

    for (const key in input) {
      const result = this.parse(input[key], [path, key]);

      if (result.success) output[key] = result.data;
      else issues.push(...result.issues);
    }

    if (issues.length > 0) return { success: false, issues: issues };
    else return { success: true, data: output };
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
