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

import { BooleanValidator } from "./schemas/boolean";
import { NumberValidator } from "./schemas/number";
import { StringValidator } from "./schemas/string";
import { DateValidator } from "./schemas/date";
import { EnumValidator } from "./schemas/enum";

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
};

export const S = surely;
