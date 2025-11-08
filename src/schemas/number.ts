import { BaseValidator } from "../core/base";
import { SurelyResult } from "../exports";
import { respond } from "../utils/respond";

export class NumberValidator extends BaseValidator<number> {
  _type!: number;

  private _roundMode?: "round" | "ceil" | "floor" = undefined;
  private _clamp?: [number, number] = undefined;

  private _lt?: number = undefined;
  private _gt?: number = undefined;
  private _lte?: number = undefined;
  private _gte?: number = undefined;
  private _numberType?: "integer" | "float" = undefined;
  private _polarity?: "positive" | "negative" = undefined;
  private _finite?: boolean = undefined;
  private _parity?: "even" | "odd" = undefined;
  private _multipleOf?: number = undefined;

  constructor() {
    super();
  }

  round = (): this => ((this._roundMode = "round"), this);
  ceil = (): this => ((this._roundMode = "ceil"), this);
  floor = (): this => ((this._roundMode = "floor"), this);
  clamp = (min: number, max: number): this => (
    (this._clamp = [Math.min(min, max), Math.max(min, max)]), this
  );

  lt = (n: number): this => ((this._lt = n), this);
  gt = (n: number): this => ((this._gt = n), this);
  lte = (n: number): this => ((this._lte = n), this);
  gte = (n: number): this => ((this._gte = n), this);
  range = (min: number, max: number): this => (
    (this._gte = min), (this._lte = max), this
  );
  int = (): this => ((this._numberType = "integer"), this);
  float = (): this => ((this._numberType = "float"), this);
  positive = (): this => ((this._polarity = "positive"), this);
  negative = (): this => ((this._polarity = "negative"), this);
  finite = (state: boolean = true): this => ((this._finite = state), this);
  even = (): this => ((this._parity = "even"), this);
  odd = (): this => ((this._parity = "odd"), this);
  multipleOf = (n: number): this => ((this._multipleOf = n), this);

  protected _parse(input: any, path: string = ""): SurelyResult<number> {
    let output: number;

    if (typeof input !== "number") {
      if (this._strict) return respond.error.type("number", input, path);

      output = Number(input);

      if (Number.isNaN(output))
        return respond.error.type("number", input, path);
    } else output = input;

    if (this._roundMode) output = Math[this._roundMode](output);
    if (this._clamp) {
      const [min, max] = this._clamp;
      output = Math.min(Math.max(output, min), max);
    }

    if (this._numberType === "integer" && !Number.isInteger(output)) {
      return respond.error.type("integer", output, path);
    }
    if (this._numberType === "float" && Number.isInteger(output)) {
      return respond.error.type("float", output, path);
    }
    if (this._polarity === "positive" && !(output > 0)) {
      return respond.error.generic(
        `[positive] Expected positive number, but received ${output}`,
        output,
        path
      );
    }
    if (this._polarity === "negative" && !(output < 0)) {
      return respond.error.generic(
        `[negative] Expected negative number, but received ${output}`,
        output,
        path
      );
    }
    if (this._finite && !Number.isFinite(output)) {
      return respond.error.generic(
        `[finite] Expected finite number, but received ${output}`,
        output,
        path
      );
    }
    if (this._lt !== undefined && !(output < this._lt)) {
      return respond.error.generic(
        `[lt] Expected number less than ${this._lt}, but received ${output}`,
        output,
        path
      );
    }
    if (this._gt !== undefined && !(output > this._gt)) {
      return respond.error.generic(
        `[gt] Expected number greater than ${this._gt}, but received ${output}`,
        output,
        path
      );
    }
    if (this._lte !== undefined && !(output <= this._lte)) {
      return respond.error.generic(
        `[lte] Expected number less than or equal to ${this._lte}, but received ${output}`,
        output,
        path
      );
    }
    if (this._gte !== undefined && !(output >= this._gte)) {
      return respond.error.generic(
        `[gte] Expected number greater than or equal to ${this._gte}, but received ${output}`,
        output,
        path
      );
    }
    if (this._parity === "even" && output % 2 !== 0) {
      return respond.error.generic(
        `[even] Expected even number, but received ${output}`,
        output,
        path
      );
    }
    if (this._parity === "odd" && output % 2 === 0) {
      return respond.error.generic(
        `[odd] Expected odd number, but received ${output}`,
        output,
        path
      );
    }
    if (this._multipleOf !== undefined) {
      if (this._multipleOf === 0) {
        return respond.error.generic(
          `[multipleOf] Expected non-zero step value, but received ${output}`,
          output,
          path
        );
      }

      const step = this._multipleOf;
      const remainder = output % step;
      const tolerance = Math.abs(step) * Number.EPSILON * 10;

      if (
        Math.abs(remainder) > tolerance &&
        Math.abs(remainder - step) > tolerance
      ) {
        return respond.error.generic(
          `[multipleOf] Expected number to be a multiple of ${step}, but received ${output}`,
          output,
          path
        );
      }
    }

    return respond.success(output);
  }
}
