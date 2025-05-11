import { BaseValidator } from "../types/base";
import { Result } from "../types/result";

export class EnumValidator extends BaseValidator<any> {
  constructor(public options: any[]) {
    super();
  }

  protected _parse(input: any): Result<any> {
    let value = input;

    if (!this.options.includes(value)) {
      return { success: false, error: `value must be one of: ${this.options}` };
    }

    return { success: true, data: value };
  }
}
