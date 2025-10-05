import { SurelyPath } from "./path";

export type SurelyIssue = {
  path: SurelyPath;
  message: string;
  value?: any;
};
