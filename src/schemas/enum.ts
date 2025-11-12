import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

export class EnumValidator<
  T extends readonly (string | number)[]
> extends BaseValidator<T[number]> {
  _type!: T[number];

  private readonly _options: readonly (string | number)[];

  constructor(options: T) {
    super();

    if (options.length === 0)
      throw new Error("EnumValidator requires at least one value.");
    else this._options = [...options];
  }

  get options() {
    return [...this._options];
  }

  protected _parse(input: any, path: string = ""): SurelyResult<T[number]> {
    if (!this._options.includes(input)) {
      return respond.error.generic(
        `[enum] Expected the value to be one of: ${this._options.join(
          ", "
        )}, but received: ${input}`,
        input,
        path
      );
    }

    return respond.success(input as T[number]);
  }
}
