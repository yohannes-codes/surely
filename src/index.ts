// core types
export type { SurelyResult } from "./core/types/result";
export type { SurelyIssue } from "./core/types/issue";
export type { patterns } from "./utils/patterns";
export type {
  DayEnum,
  DateEnum,
  MonthEnum,
  DateParts,
  DateOffset,
} from "./core/types/temporal";

export { BaseValidator, OptionalValidator } from "./core/base";
export { BooleanValidator } from "./schemas/boolean";
export { NumberValidator } from "./schemas/number";
export { StringValidator } from "./schemas/string";
export { DateValidator } from "./schemas/date";
export { EnumValidator } from "./schemas/enum";
export { NativeEnumValidator } from "./schemas/native_enum";
export { ObjectValidator } from "./schemas/object";
export { UnionValidator } from "./schemas/union";
export { TupleValidator } from "./schemas/tuple";
export { ArrayValidator } from "./schemas/array";

import { BaseValidator } from "./core/base";
import { BooleanValidator } from "./schemas/boolean";
import { NumberValidator } from "./schemas/number";
import { StringValidator } from "./schemas/string";
import { DateValidator } from "./schemas/date";
import { EnumValidator } from "./schemas/enum";
import { NativeEnumValidator } from "./schemas/native_enum";
import { ObjectValidator } from "./schemas/object";
import { UnionValidator } from "./schemas/union";
import { TupleValidator } from "./schemas/tuple";
import { ArrayValidator } from "./schemas/array";

export const surely = {
  boolean: () => new BooleanValidator(),
  bool: () => new BooleanValidator(),
  number: () => new NumberValidator(),
  num: () => new NumberValidator(),
  string: () => new StringValidator(),
  str: () => new StringValidator(),
  date: () => new DateValidator(),
  dt: () => new DateValidator(),
  enum: <T extends readonly (string | number)[]>(options: T) =>
    new EnumValidator(options),
  nativeEnum: <T extends Record<string, string | number>>(options: T) =>
    new NativeEnumValidator(options),
  object: <S extends Record<string, BaseValidator<any>>>(schema: S) =>
    new ObjectValidator<{
      [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
    }>(schema),
  obj: <S extends Record<string, BaseValidator<any>>>(schema: S) =>
    new ObjectValidator<{
      [K in keyof S]: S[K] extends BaseValidator<infer U> ? U : never;
    }>(schema),
  union: <T extends readonly BaseValidator<any>[]>(validators: T) =>
    new UnionValidator(validators),

  tuple: <T extends readonly BaseValidator<any>[]>(items: T) =>
    new TupleValidator(items),

  array: <T extends BaseValidator<any>>(item: T) => new ArrayValidator(item),
};

export const S = surely;

export type Infer<T extends BaseValidator<any>> = T["_type"];
