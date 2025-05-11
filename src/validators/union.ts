import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class UnionValidator<
  T extends BaseValidator<any>[]
> extends BaseValidator<T[number] extends BaseValidator<infer U> ? U : never> {
  constructor(private _validators: T) {
    super();
  }

  protected _parse(
    input: unknown
  ): Result<T[number] extends BaseValidator<infer U> ? U : never> {
    const errors: any[] = [];

    for (const validator of this._validators) {
      const result = validator.parse(input);
      if (result.success) return result;
      errors.push(result.error);
    }

    return {
      success: false,
      error: errors as any,
    };
  }
}
