import { BaseValidator } from "../core/base";
import { SurelyPath } from "../core/types/path";
import { SurelyResult } from "../core/types/result";
import { utils } from "../utils/utils";

export class BooleanValidator extends BaseValidator<boolean> {
  _truthy?: boolean;
  _falsy?: boolean;

  truthy = (): this => ((this._truthy = true), this);
  falsy = (): this => ((this._falsy = true), this);

  constructor() {
    super();
  }

  protected _parse(input: any, path: SurelyPath = ""): SurelyResult<boolean> {
    let output = input;

    if (typeof output !== "boolean") {
      if (this._strict) {
        return utils.failure([
          {
            message: `[type] Expected boolean, but received ${typeof input}`,
            path: path,
            value: input,
          },
        ]);
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
        } else {
          return utils.failure([
            {
              message: `[type] Expected boolean, but received ${typeof input}`,
              path: path,
              value: input,
            },
          ]);
        }
      }
    }

    if (this._truthy && !output) {
      return utils.failure([
        {
          message: `[truthy] Expected truthy value, but received falsy value`,
          path: path,
          value: input,
        },
      ]);
    }

    if (this._falsy && output) {
      return utils.failure([
        {
          message: `[falsy] Expected falsy value, but received truthy value`,
          path: path,
          value: input,
        },
      ]);
    }

    return utils.success(output);
  }
}
