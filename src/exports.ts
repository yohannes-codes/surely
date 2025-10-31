// core types
export * from "./core/types/result";
export * from "./core/types/issue";
export * from "./utils/patterns";

export * from "./core/base";
export * from "./schemas/boolean";
export * from "./schemas/number";
export * from "./schemas/string";

import { BooleanValidator } from "./schemas/boolean";
import { NumberValidator } from "./schemas/number";
import { StringValidator } from "./schemas/string";

export const surely = {
  boolean: () => new BooleanValidator(),
  bool: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  num: () => new NumberValidator(),
  string: () => new StringValidator(),
  str: () => new StringValidator(),
};

export const S = surely;
