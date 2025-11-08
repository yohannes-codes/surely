import { BaseValidator } from "../core/base";
import { SurelyIssue, SurelyResult } from "../exports";
import { respond } from "../utils/respond";

type InferValidatorType<V> = V extends BaseValidator<infer T> ? T : never;
type UnionOfValidators<T extends readonly BaseValidator<any>[]> =
  InferValidatorType<T[number]>;

export class UnionValidator<
  T extends readonly BaseValidator<any>[]
> extends BaseValidator<UnionOfValidators<T>> {
  _type!: UnionOfValidators<T>;

  constructor(private _validators: T) {
    super();
  }

  protected _parse(
    input: any,
    path: string = ""
  ): SurelyResult<UnionOfValidators<T>> {
    const issues: SurelyIssue[] = [];

    for (const validator of this._validators) {
      const result = validator.parse(input, path);
      if (result.success) return result as SurelyResult<UnionOfValidators<T>>;
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
