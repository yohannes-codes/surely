import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { SurelyIssue } from "../core/types/issue";
import { respond } from "../utils/respond";
import { utils } from "../utils/utils";

export class ObjectValidator<
  T extends Record<string, any>
> extends BaseValidator<T> {
  _type!: T;
  private _schema: { [K in keyof T]: BaseValidator<T[K]> };
  private _allowExtraKeys = false;
  private _stripUnknown = false;

  constructor(schema: { [K in keyof T]: BaseValidator<T[K]> }) {
    super();

    if (Object.values(schema).some((v) => !(v instanceof BaseValidator)))
      throw new Error(
        "[Invalid schema] Expected valid BaseValidator instances in schema."
      );

    this._schema = schema;
  }

  get schemaKeys(): (keyof T)[] {
    return Object.keys(this._schema) as (keyof T)[];
  }

  loose = (): this => ((this._allowExtraKeys = true), this);
  strict = (): this => ((this._allowExtraKeys = false), this);
  strip = (): this => ((this._stripUnknown = true), this);

  extend<U extends Record<string, BaseValidator<any>>>(
    extension: U
  ): ObjectValidator<
    T & {
      [K in keyof U]: U[K] extends BaseValidator<infer V> ? V : never;
    }
  > {
    return new ObjectValidator({
      ...this._schema,
      ...extension,
    }) as any;
  }

  pick<K extends keyof T>(keys: K[]): ObjectValidator<Pick<T, K>> {
    const picked = {} as { [P in K]: BaseValidator<T[P]> };
    for (const k of keys) picked[k] = this._schema[k];
    return new ObjectValidator<Pick<T, K>>(picked);
  }

  omit<K extends keyof T>(keys: K[]): ObjectValidator<Omit<T, K>> {
    const clone = { ...this._schema };
    for (const k of keys) delete clone[k];
    return new ObjectValidator<Omit<T, K>>(
      clone as { [P in Exclude<keyof T, K>]: BaseValidator<T[P]> }
    );
  }

  asPartial(): ObjectValidator<Partial<T>> {
    const partialSchema = {} as {
      [K in keyof Partial<T>]: BaseValidator<Partial<T>[K]>;
    };
    for (const k of this.schemaKeys) {
      partialSchema[k] = this._schema[k].optional();
    }
    return new ObjectValidator(partialSchema as any);
  }

  protected _parse(input: unknown, path: string = ""): SurelyResult<T> {
    if (
      typeof input !== "object" ||
      input === null ||
      Array.isArray(input) ||
      input instanceof Date
    ) {
      return respond.error.type("object", input, path);
    }

    const obj = input as Record<string, any>;
    const output: Record<string, any> = {};
    const issues: SurelyIssue[] = [];

    for (const key of this.schemaKeys) {
      const validator = this._schema[key];
      const subPath = utils.makePath(path, String(key));
      const result = validator.parse(obj[key as string], subPath);
      if (!result.success) issues.push(...result.issues);
      else if (result.data !== undefined) output[key as string] = result.data;
    }

    const extraKeys = Object.keys(obj).filter(
      (k) => !this.schemaKeys.includes(k as keyof T)
    );

    if (extraKeys.length && !this._stripUnknown) {
      if (this._allowExtraKeys) {
        for (const k of extraKeys) output[k] = obj[k];
      } else {
        issues.push({
          message: `[object.strict] Unexpected keys: ${extraKeys
            .map((k) => `"${k}"`)
            .join(", ")}`,
          path,
        });
      }
    }

    return issues.length
      ? respond.error.subIssues(
          `[object] Validation failed with ${issues.length} issue(s).`,
          input,
          path,
          issues
        )
      : respond.success(output as T);
  }
}
