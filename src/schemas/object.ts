import { BaseValidator } from "../core/base";
import { SurelyIssue, SurelyResult } from "../exports";
import { respond } from "../utils/respond";
import { utils } from "../utils/utils";

export class ObjectValidator<
  T extends Record<string, any>
> extends BaseValidator<T> {
  private _schema: { [K in keyof T]: BaseValidator<T[K]> };
  private _makeAllOptional: boolean = false;

  constructor(schema: { [K in keyof T]: BaseValidator<T[K]> }) {
    super();
    this._schema = schema;
  }

  pick<K extends keyof T>(keys: K[]): ObjectValidator<Pick<T, K>> {
    const picked = {} as { [P in K]: BaseValidator<T[P]> };
    for (const key of keys) {
      picked[key] = this._schema[key];
    }
    return new ObjectValidator<Pick<T, K>>(picked);
  }

  omit<K extends keyof T>(keys: K[]): ObjectValidator<Omit<T, K>> {
    const omitted: Partial<{ [K in keyof T]: BaseValidator<T[K]> }> = {
      ...this._schema,
    };
    for (const key of keys) {
      delete omitted[key];
    }
    return new ObjectValidator<Omit<T, K>>(
      omitted as { [P in Exclude<keyof T, K>]: BaseValidator<T[P]> }
    );
  }

  makeAllOptional = (): this => ((this._makeAllOptional = true), this);

  protected _parse(
    input: Partial<Record<keyof T, any>>,
    path: string = ""
  ): SurelyResult<T> {
    if (
      typeof input !== "object" ||
      input === null ||
      Array.isArray(input) ||
      input instanceof Date
    ) {
      return respond.error.type("object", input, path);
    }

    const output: { [K in keyof T]?: T[K] } = {};
    const issues: SurelyIssue[] = [];

    if (this._strict) {
      const inputKeys = Object.keys(input) as (keyof T)[];
      const schemaKeys = Object.keys(this._schema) as (keyof T)[];
      const extraKeys = inputKeys.filter((key) => !schemaKeys.includes(key));

      if (extraKeys.length)
        issues.push({
          message: `[strict] Unexpected keys: ${extraKeys
            .map((k) => `"${String(k)}"`)
            .join(", ")}`,
          path,
        });
    }
    if (issues.length)
      return respond.error.subIssues(
        `[object] Object validation failed with ${issues.length} issue(s).`,
        input,
        path,
        issues
      );

    for (const key in this._schema) {
      const validator = this._schema[key];
      const subPath = utils.makePath(path, String(key));

      if (!(validator instanceof BaseValidator)) {
        issues.push({
          message: `[schema] Invalid schema for key "${key}". Expected a validator instance.`,
          path: subPath,
        });

        continue;
      }

      if (this._makeAllOptional) validator.optional();

      const result = validator.parse(input[key], subPath);

      if (!result.success) issues.push(...result.issues);
      else output[key] = result.data;
    }

    return issues.length > 0
      ? respond.error.subIssues(
          `[object] Object validation failed with ${issues.length} issue(s).`,
          input,
          path,
          issues
        )
      : respond.success(output as T);
  }
}
