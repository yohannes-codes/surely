// core types
export * from "./core/types/result";
export * from "./core/types/issue";

export * from "./core/base";
export * from "./schemas/boolean";
export * from "./schemas/number";

import { BooleanValidator } from "./schemas/boolean";
import { NumberValidator } from "./schemas/number";

export const surely = {
  boolean: () => new BooleanValidator(),
  bool: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  num: () => new NumberValidator(),
};

export const S = surely;
