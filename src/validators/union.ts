import { BaseValidator } from "../types/base";
import { Result } from "../types/result";
import { NumberValidator } from "./number";
import { StringValidator } from "./string";

type InferValidatorType<V> = V extends BaseValidator<infer T> ? T : never;
type UnionOfValidators<T extends readonly BaseValidator<any>[]> =
  InferValidatorType<T[number]>;

export class UnionValidator<
  T extends readonly BaseValidator<any>[]
> extends BaseValidator<UnionOfValidators<T>> {
  constructor(private _validators: T) {
    super();
  }

  protected _parse(input: unknown): Result<UnionOfValidators<T>> {
    const errors: any[] = [];

    for (const validator of this._validators) {
      const result = validator.parse(input);
      if (result.success) return result as Result<UnionOfValidators<T>>;
      errors.push(result.error);
    }

    return { success: false, error: errors as any };
  }
}

// Usage example:
const u = new UnionValidator([
  new StringValidator(),
  new NumberValidator(),
] as const);

const r = u.parse("123"); // r is Result<string | number>

if (r.success) {
  r.data; // string | number
} else {
}
