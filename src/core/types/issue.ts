export type SurelyIssue = {
  path: string;
  message: string;
  value?: any;
  subIssues?: SurelyIssue[];
};
