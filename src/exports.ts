// core types
export * from "./core/types/result";
export * from "./core/types/issue";
export * from "./utils/patterns";
export * from "./core/types/temporal";

export * from "./core/base";
export * from "./schemas/boolean";
export * from "./schemas/number";
export * from "./schemas/string";
export * from "./schemas/date";
export * from "./schemas/enum";
export * from "./schemas/object";

import { BaseValidator } from "./core/base";
import { BooleanValidator } from "./schemas/boolean";
import { NumberValidator } from "./schemas/number";
import { StringValidator } from "./schemas/string";
import { DateValidator } from "./schemas/date";
import { EnumValidator } from "./schemas/enum";
import { ObjectValidator } from "./schemas/object";

export const surely = {
  boolean: () => new BooleanValidator(),
  bool: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  num: () => new NumberValidator(),
  string: () => new StringValidator(),
  str: () => new StringValidator(),
  date: () => new DateValidator(),
  dt: () => new DateValidator(),
  enum: <
    T extends readonly (string | number)[] | Record<string, string | number>
  >(
    options: T
  ) => new EnumValidator(options),
  object: <S extends Record<string, BaseValidator<any>>>(schema: S) =>
    new ObjectValidator<{
      [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
    }>(schema),
  obj: <S extends Record<string, BaseValidator<any>>>(schema: S) =>
    new ObjectValidator<{
      [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
    }>(schema),
};

export const S = surely;
