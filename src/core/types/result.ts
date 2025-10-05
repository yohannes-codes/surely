import { SurelyIssue } from "./issue";

export type SurelyResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      issues: SurelyIssue[];
    };
