import { SurelyIssue } from "../exports";
import { utils } from "./utils";

export const respond = {
  error: {
    required: (path: string) => {
      return utils.failure([
        {
          message: `[required] Expected real/defined value, but received nothing.`,
          path: path,
        },
      ]);
    },
    type: (expected: string, value: any, path: string) => {
      return utils.failure([
        {
          message: `[type] Expected ${expected}, but received ${typeof value}`,
          path: path,
          value: value,
        },
      ]);
    },
    generic: (message: string, value: any, path: string) => {
      return utils.failure([
        {
          message: message,
          path: path,
          value: value,
        },
      ]);
    },
    subIssues: (
      message: string,
      value: any,
      path: string,
      issues: SurelyIssue[]
    ) => {
      return utils.failure([
        {
          message,
          path,
          value,
          subIssues: [...issues],
        },
      ]);
    },
  },
  success: <T>(data: T) => utils.success(data),
};
