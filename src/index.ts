export * from "./types/base";
export * from "./types/patterns";
export * from "./types/result";

export * from "./validators/boolean";
export * from "./validators/number";
export * from "./validators/string";
export * from "./validators/datetime";
export * from "./validators/enum";
export * from "./validators/union";
export * from "./validators/array";
export * from "./validators/record";
export * from "./validators/object";

import { BaseValidator } from "./types/base";
import { BooleanValidator } from "./validators/boolean";
import { NumberValidator } from "./validators/number";
import { StringValidator } from "./validators/string";
import { DatetimeValidator } from "./validators/datetime";
import { EnumValidator } from "./validators/enum";
import { UnionValidator } from "./validators/union";
import { ArrayValidator } from "./validators/array";
import { RecordValidator } from "./validators/record";
import { ObjectValidator } from "./validators/object";

export const surely = {
  boolean: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  string: () => new StringValidator(),
  datetime: () => new DatetimeValidator(),
  enum: (elements: any[]) => new EnumValidator(elements),
  union: (types: BaseValidator<any>[]) => new UnionValidator(types),
  array: () => new ArrayValidator(),
  record: (validator: BaseValidator<any>) => new RecordValidator(validator),
  object: (props: Record<string, BaseValidator<any>>) =>
    new ObjectValidator(props),

  bool: () => new BooleanValidator(),
  num: () => new NumberValidator(),
  str: () => new StringValidator(),
  dt: () => new DatetimeValidator(),
  en: (elements: any[]) => new EnumValidator(elements),
  un: (types: BaseValidator<any>[]) => new UnionValidator(types),
  arr: () => new ArrayValidator(),
  rec: (validator: BaseValidator<any>) => new RecordValidator(validator),
  obj: (props: Record<string, BaseValidator<any>>) =>
    new ObjectValidator(props),
};

export const s = surely;
