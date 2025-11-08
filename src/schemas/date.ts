import { BaseValidator } from "../core/base";
import {
  DateEnum,
  DateOffset,
  DateParts,
  DayEnum,
  MonthEnum,
} from "../core/types/temporal";
import { SurelyResult } from "../exports";
import { respond } from "../utils/respond";

export class DateValidator extends BaseValidator<Date> {
  _type!: Date;

  private _add?: DateOffset = undefined;
  private _before?: Date;
  private _after?: Date;
  private _daysFromNow?: number;
  private _dateParts: DateParts = {};

  constructor() {
    super();
  }

  before = (d: Date): this => ((this._before = d), this);
  after = (d: Date): this => ((this._after = d), this);
  between = (a: Date, b: Date): this => {
    const [min, max] = a < b ? [a, b] : [b, a];
    this._after = min;
    this._before = max;
    return this;
  };

  daysAhead = (n: number): this => ((this._daysFromNow = n), this);
  daysAgo = (n: number): this => ((this._daysFromNow = -n), this);

  day = (d: DayEnum): this => ((this._dateParts.day = d), this);
  date = (d: DateEnum): this => ((this._dateParts.date = d), this);
  month = (m: MonthEnum): this => ((this._dateParts.month = m), this);
  year = (y: number): this => ((this._dateParts.year = y), this);

  add = (d: DateOffset): this => ((this._add = d), this);

  protected _parse(input: any, path: string = ""): SurelyResult<Date> {
    let output: Date;

    if (!(input instanceof Date)) {
      if (this._strict) return respond.error.type("Date", input, path);

      output = new Date(input);

      if (isNaN(output.getTime()))
        return respond.error.type("Date", input, path);
    } else output = input;

    if (this._add) {
      let delta = 0;
      if (this._add.days) delta += this._add.days * 86400000;
      if (this._add.hours) delta += this._add.hours * 3600000;
      if (this._add.minutes) delta += this._add.minutes * 60000;
      if (this._add.seconds) delta += this._add.seconds * 1000;
      if (this._add.milliseconds) delta += this._add.milliseconds;
      output = new Date(output.getTime() + delta);
    }

    if (this._before && !(output < this._before)) {
      return respond.error.generic(
        `Expected a date before ${this._before.toISOString()}, but received ${output.toISOString()}`,
        output,
        path
      );
    }
    if (this._after && !(output > this._after)) {
      return respond.error.generic(
        `Expected a date after ${this._after.toISOString()}, but received ${output.toISOString()}`,
        output,
        path
      );
    }
    if (this._daysFromNow !== undefined) {
      const target = new Date();
      target.setUTCDate(target.getUTCDate() + this._daysFromNow);

      if (
        target.getUTCFullYear() !== output.getUTCFullYear() ||
        target.getUTCMonth() !== output.getUTCMonth() ||
        target.getUTCDate() !== output.getUTCDate()
      ) {
        return respond.error.generic(
          `Expected the date to be ${
            this._daysFromNow === 0
              ? "today"
              : this._daysFromNow > 0
              ? this._daysFromNow + " days ahead"
              : this._daysFromNow + " days ago"
          }, but received ${output.toISOString().split("T")[0]}`,
          output,
          path
        );
      }
    }
    if (this._dateParts.day !== undefined) {
      const jsDay = output.getUTCDay() === 0 ? 7 : output.getUTCDay();
      if (jsDay !== this._dateParts.day) {
        return respond.error.generic(
          `Expected the day of the week to be ${this._dateParts.day}, but received ${jsDay}`,
          output,
          path
        );
      }
    }
    if (
      this._dateParts.date !== undefined &&
      output.getUTCDate() !== this._dateParts.date
    ) {
      return respond.error.generic(
        `Expected the date to be ${
          this._dateParts.date
        }, but received ${output.getUTCDate()}`,
        output,
        path
      );
    }
    if (
      this._dateParts.month !== undefined &&
      output.getUTCMonth() + 1 !== this._dateParts.month
    ) {
      return respond.error.generic(
        `Expected the month to be ${this._dateParts.month}, but received ${
          output.getUTCMonth() + 1
        }`,
        output,
        path
      );
    }
    if (
      this._dateParts.year !== undefined &&
      output.getUTCFullYear() !== this._dateParts.year
    ) {
      return respond.error.generic(
        `Expected the year to be ${
          this._dateParts.year
        }, but received ${output.getUTCFullYear()}`,
        output,
        path
      );
    }

    return respond.success(output);
  }
}
