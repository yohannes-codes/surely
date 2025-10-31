// core types
export * from "./core/types/result";
export * from "./core/types/issue";

export * from "./core/base";
export * from "./schemas/boolean";

import { BooleanValidator } from "./schemas/boolean";

export const surely = {
  boolean: () => new BooleanValidator(),
  bool: () => new BooleanValidator(),
};

export const S = surely;
