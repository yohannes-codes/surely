import { BaseValidator } from "../types/base";
import { ErrorPart, Result } from "../types/result";
import { StringValidator } from "./string";

export class RecordValidator<
  T extends { [key: string]: any }
> extends BaseValidator<T> {
  constructor(private _validator: BaseValidator<any>) {
    super();
  }

  protected _parse(input: T): Result<T> {
    const errors: ErrorPart<T> = {} as ErrorPart<T>;
    const keys = Object.keys(input);
    const successOutput: T = {} as T;

    for (const key of keys) {
      const result = this._validator.parse(input[key]);
      if (!result.success) {
        (errors as Record<string, any>)[key] = result.error;
      } else {
        successOutput[key as keyof T] = result.data;
      }
    }

    if (Object.keys(errors).length === 0) {
      return { success: true, data: successOutput };
    } else {
      return {
        success: false,
        error: errors,
      };
    }
  }
}

const r = new RecordValidator(new StringValidator()).parse({
  name: "John",
  age: 30,
  email: "john@example.com",
});

if (r.success) {
  r.data; // { [key: string]: string }
} else {
  r.error; // { [key: string]: string }
}
