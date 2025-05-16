export type ErrorPart<T> = T extends any[]
  ? string[]
  : T extends Date
  ? string
  : T extends object
  ? { [K in keyof T]?: ErrorPart<T[K]> }
  : string;

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ErrorPart<T> };
