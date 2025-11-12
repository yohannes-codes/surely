import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { SurelyIssue } from "../core/types/issue";
import { respond } from "../utils/respond";

type InferValidatorType<V> = V extends BaseValidator<infer T> ? T : never;
type UnionOfValidators<T extends readonly BaseValidator<any>[]> =
  InferValidatorType<T[number]>;

export class UnionValidator<
  T extends readonly BaseValidator<any>[]
> extends BaseValidator<UnionOfValidators<T>> {
  _type!: UnionOfValidators<T>;

  private _validators: T;

  constructor(validators: T) {
    super();
    if (!Array.isArray(validators) || validators.length === 0)
      throw new Error("[UnionValidator] Must provide at least one validator.");

    this._validators = validators;
  }

  get validators(): readonly T[number][] {
    return [...this._validators];
  }

  protected _parse(
    input: any,
    path: string = ""
  ): SurelyResult<UnionOfValidators<T>> {
    const issues: SurelyIssue[] = [];

    for (const validator of this._validators) {
      const result = validator.parse(input, path);
      if (result.success)
        return respond.success(result.data as UnionOfValidators<T>);

      issues.push(...result.issues);
    }

    return respond.error.subIssues(
      `[union] Expected input to match one of the ${this._validators.length} validators, but did not.`,
      input,
      path,
      issues
    );
  }
}
