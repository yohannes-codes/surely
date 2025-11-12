import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

export class NativeEnumValidator<
  T extends Record<string, string | number>
> extends BaseValidator<T[keyof T]> {
  _type!: T[keyof T];

  private readonly _options: readonly (string | number)[];

  constructor(options: T) {
    super();

    this._options = Object.keys(options)
      .filter((k) => isNaN(Number(k)))
      .map((k) => options[k]) as (string | number)[];
  }

  get options() {
    return [...this._options];
  }

  protected _parse(
    input: unknown,
    path: string = ""
  ): SurelyResult<T[keyof T]> {
    let output = input;

    if (
      !this._strict &&
      typeof output === "string" &&
      /^-?\d+(\.\d+)?$/.test(output)
    ) {
      output = Number(output);
    }

    if (!this._options.includes(output as string | number)) {
      return respond.error.generic(
        `[native enum] Expected one of: ${this._options.join(
          ", "
        )}, but received: ${JSON.stringify(input)}`,
        input,
        path
      );
    }

    return respond.success(output as T[keyof T]);
  }
}
