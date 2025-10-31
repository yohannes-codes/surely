export enum DayEnum {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}
export enum DateEnum {
  First = 1,
  Second = 2,
  Third = 3,
  Fourth = 4,
  Fifth = 5,
  Sixth = 6,
  Seventh = 7,
  Eighth = 8,
  Ninth = 9,
  Tenth = 10,
  Eleventh = 11,
  Twelfth = 12,
  Thirteenth = 13,
  Fourteenth = 14,
  Fifteenth = 15,
  Sixteenth = 16,
  Seventeenth = 17,
  Eighteenth = 18,
  Nineteenth = 19,
  Twentieth = 20,
  TwentyFirst = 21,
  TwentySecond = 22,
  TwentyThird = 23,
  TwentyFourth = 24,
  TwentyFifth = 25,
  TwentySixth = 26,
  TwentySeventh = 27,
  TwentyEighth = 28,
  TwentyNinth = 29,
  Thirtieth = 30,
  ThirtyFirst = 31,
}
export enum MonthEnum {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export type DateParts = {
  day?: DayEnum;
  date?: DateEnum;
  month?: MonthEnum;
  year?: number;
};

export type DateOffset = {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
};
