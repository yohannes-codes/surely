import { BaseValidator } from "../core/base";
import { SurelyResult } from "../exports";
import { respond } from "../utils/respond";

export class EnumValidator<
  T extends Record<string, string | number>
> extends BaseValidator<T[keyof T]> {
  _type!: T[keyof T];

  private readonly _options: readonly (string | number)[];

  constructor(options: T) {
    super();

    this._options = Array.isArray(options)
      ? options
      : (Object.values(options).filter(
          (v) => typeof v === "string" || typeof v === "number"
        ) as (string | number)[]);
  }

  get options() {
    return [...this._options];
  }

  protected _parse(input: any, path: string = ""): SurelyResult<T[keyof T]> {
    if (!this._options.includes(input)) {
      return respond.error.generic(
        `[enum] Expected the value to be one of: ${this._options.join(
          ", "
        )}, but received: ${input}`,
        input,
        path
      );
    }

    return respond.success(input as T[keyof T]);
  }
}
