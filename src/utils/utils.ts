import { SurelyIssue } from "../core/types/issue";

function isObject(value: any): value is Record<string, any> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function success<T>(data: T): { success: true; data: T } {
  return { success: true, data };
}

function failure(issues: SurelyIssue[]): {
  success: false;
  issues: SurelyIssue[];
} {
  return { success: false, issues: issues };
}

const makePath = (p: string, key: string) => (p ? `${p}.${key}` : key);

export const utils = { isObject, success, failure, makePath };
