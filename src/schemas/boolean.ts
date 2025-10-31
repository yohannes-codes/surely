import { BaseValidator } from "../core/base";
import { SurelyResult } from "../core/types/result";
import { respond } from "../utils/respond";

export class BooleanValidator extends BaseValidator<boolean> {
  _truthy?: boolean;
  _falsy?: boolean;

  truthy = (): this => ((this._truthy = true), this);
  falsy = (): this => ((this._falsy = true), this);

  constructor() {
    super();
  }

  protected _parse(input: any, path: string = ""): SurelyResult<boolean> {
    let output = input;

    if (typeof output !== "boolean") {
      if (this._strict) {
        return respond.error.type("boolean", input, path);
      } else {
        if (
          output === "true" ||
          output === "TRUE" ||
          output === "True" ||
          output === 1 ||
          output === "1" ||
          output === "yes" ||
          output === "YES" ||
          output === "Yes" ||
          output === "on" ||
          output === "ON" ||
          output === "On" ||
          output === "Y" ||
          output === "y" ||
          output === "T" ||
          output === "t"
        ) {
          output = true;
        } else if (
          output === "false" ||
          output === "FALSE" ||
          output === "False" ||
          output === 0 ||
          output === "0" ||
          output === "no" ||
          output === "NO" ||
          output === "No" ||
          output === "off" ||
          output === "OFF" ||
          output === "Off" ||
          output === "N" ||
          output === "n" ||
          output === "F" ||
          output === "f"
        ) {
          output = false;
        } else return respond.error.type("boolean", input, path);
      }
    }

    if (this._truthy && !output) {
      return respond.error.generic(
        `[truthy] Expected truthy value, but received falsy value`,
        path,
        input
      );
    }

    if (this._falsy && output) {
      return respond.error.generic(
        `[falsy] Expected falsy value, but received truthy value`,
        path,
        input
      );
    }

    return respond.success(output);
  }
}
