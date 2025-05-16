import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class ObjectValidator<
  T extends Record<string, any>
> extends BaseValidator<T> {
  private _schema: { [K in keyof T]: BaseValidator<T[K]> };

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

  protected _parse(input: { [K in keyof T]: any }): Result<T> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return { success: false, error: "expected an object" } as any;
    }

    const output: { [K in keyof T]: T[K] } = {} as any;
    const errors: { [K in keyof T]?: string | string[] } = {};

    if (this._strict) {
      const inputKeys = Object.keys(input) as (keyof T)[];
      const schemaKeys = Object.keys(this._schema) as (keyof T)[];
      const extraKeys = inputKeys.filter((key) => !schemaKeys.includes(key));

      if (extraKeys.length > 0) {
        for (const key of extraKeys) {
          errors[key] = "extra field not allowed";
        }
      }
    }

    for (const key in this._schema) {
      const validator = this._schema[key];
      const value = input[key];

      if (!(validator instanceof BaseValidator)) {
        errors[key] = "invalid validator for field";
        continue;
      }

      const result = validator.parse(value);

      if (!result.success) {
        errors[key] = result.error as string | string[];
      } else {
        output[key] = result.data;
      }
    }

    return Object.keys(errors).length > 0
      ? {
          success: false,
          error: errors as any,
        }
      : { success: true, data: output };
  }
}
