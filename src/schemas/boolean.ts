import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

export class BooleanValidator extends BaseValidator<boolean> {
  _type!: boolean;

  _truthy?: boolean = undefined;

  truthy = (): this => ((this._truthy = true), this);
  falsy = (): this => ((this._truthy = false), this);

  constructor() {
    super();
  }

  protected _parse(input: any, path: string = ""): SurelyResult<boolean> {
    let output: boolean | undefined;

    if (typeof input !== "boolean")
      if (this._strict) return respond.error.type("boolean", input, path);
      else if (typeof input === "number")
        if (input === 1) output = true;
        else if (input === 0) output = false;
        else output = undefined;
      else if (typeof input === "string")
        if (input === "true") output = true;
        else if (input === "false") output = false;
        else output = undefined;
      else output = undefined;
    else output = input;

    if (output === undefined) return respond.error.type("boolean", input, path);

    if (this._truthy !== undefined) {
      if (this._truthy === true && !output)
        return respond.error.generic(
          `[truthy] Expected truthy value, but received falsy value`,
          path,
          input
        );

      if (this._truthy === false && output)
        return respond.error.generic(
          `[falsy] Expected falsy value, but received truthy value`,
          path,
          input
        );
    }

    return respond.success(output);
  }
}
