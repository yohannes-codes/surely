import { BaseValidator } from "../core/base";
import { SurelyIssue } from "../core/types/issue";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

type InferTuple<T extends readonly BaseValidator<any>[]> = {
  [K in keyof T]: T[K] extends BaseValidator<infer U> ? U : never;
};

export class TupleValidator<
  T extends readonly BaseValidator<any>[]
> extends BaseValidator<InferTuple<T>> {
  _type!: InferTuple<T>;

  private readonly _items: T;

  constructor(items: T) {
    super();
    this._items = items;
  }

  protected _parse(input: any, path: string = ""): SurelyResult<InferTuple<T>> {
    if (!Array.isArray(input))
      return respond.error.type("tuple (array)", input, path);

    if (input.length !== this._items.length) {
      return respond.error.generic(
        `[length] Expected tuple of length ${this._items.length}, but received ${input.length}`,
        input,
        path
      );
    }

    const output = [] as InferTuple<T>;
    const issues: SurelyIssue[] = [];

    for (let i = 0; i < this._items.length; i++) {
      const validator = this._items[i];
      const result = validator.parse(input[i], path ? `${path}.${i}` : `${i}`);

      if (!result.success) issues.push(...result.issues);
      else (output as any)[i] = result.data;
    }

    return issues.length > 0
      ? respond.error.subIssues(
          `[tuple] Validation failed with ${issues.length} issue(s).`,
          input,
          path,
          issues
        )
      : respond.success(output);
  }
}
