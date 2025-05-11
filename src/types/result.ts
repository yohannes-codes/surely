export type Result<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: T extends any[]
        ? string[]
        : T extends Date
        ? string
        : T extends object
        ? { [K in keyof T]?: Result<T> }
        : string;
    };
