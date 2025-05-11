export * from "./types/base";
export * from "./types/result";
export * from "./validators/boolean";
export * from "./validators/number";
export * from "./validators/string";
export * from "./validators/datetime";
export * from "./validators/array";
export * from "./validators/object";

import { BaseValidator } from "./types/base";
import { BooleanValidator } from "./validators/boolean";
import { NumberValidator } from "./validators/number";
import { StringValidator } from "./validators/string";
import { DatetimeValidator } from "./validators/datetime";
import { EnumValidator } from "./validators/enum";
import { UnionValidator } from "./validators/union";
import { ArrayValidator } from "./validators/array";
import { ObjectValidator } from "./validators/object";

export const surely = {
  boolean: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  string: () => new StringValidator(),
  datetime: () => new DatetimeValidator(),
  enum: (elements: any[]) => new EnumValidator(elements),
  union: (types: BaseValidator<any>[]) => new UnionValidator(types),
  array: () => new ArrayValidator(),
  object: (props: Record<string, BaseValidator<any>>) =>
    new ObjectValidator(props),

  bool: () => new BooleanValidator(),
  num: () => new NumberValidator(),
  str: () => new StringValidator(),
  dt: () => new DatetimeValidator(),
  en: (elements: any[]) => new EnumValidator(elements),
  un: (types: BaseValidator<any>[]) => new UnionValidator(types),
  arr: () => new ArrayValidator(),
  obj: (props: Record<string, BaseValidator<any>>) =>
    new ObjectValidator(props),
};

export const s = surely;
