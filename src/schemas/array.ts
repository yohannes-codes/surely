import { BaseValidator } from "../core/base";
import { SurelyIssue } from "../core/types/issue";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

type InferArray<T extends BaseValidator<any>> = T extends BaseValidator<infer U>
  ? U[]
  : never;

export class ArrayValidator<T extends BaseValidator<any>> extends BaseValidator<
  InferArray<T>
> {
  _type!: InferArray<T>;

  private readonly _item: T;

  constructor(item: T) {
    super();
    this._item = item;
  }

  protected _parse(input: any, path: string = ""): SurelyResult<InferArray<T>> {
    if (!Array.isArray(input)) return respond.error.type("array", input, path);

    const issues: SurelyIssue[] = [];
    const output = [] as unknown as InferArray<T>;

    for (let i = 0; i < input.length; i++) {
      const result = this._item.parse(input[i], path ? `${path}.${i}` : `${i}`);

      if (!result.success) {
        issues.push(...result.issues);
      } else {
        (output as any)[i] = result.data;
      }
    }

    return issues.length > 0
      ? respond.error.subIssues(
          `[array] Validation failed with ${issues.length} issue(s).`,
          input,
          path,
          issues
        )
      : respond.success(output);
  }
}
