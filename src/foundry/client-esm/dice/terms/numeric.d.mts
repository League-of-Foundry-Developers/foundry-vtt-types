import type { InexactPartial } from "fvtt-types/utils";
import type RollTerm from "./term.d.mts";

/**
 * A type of RollTerm used to represent static numbers.
 */
declare class NumericTerm extends RollTerm {
  constructor(termData: NumericTerm.TermData);

  number: NumericTerm.TermData["number"];

  /**
   * @defaultValue
   * ```typescript
   * new RegExp(`^([0-9]+(?:\\.[0-9]+)?)${RollTerm.FLAVOR_REGEXP_STRING}?$`)
   * ```
   */
  static REGEXP: RegExp;

  /**
   * @defaultValue `["number"]`
   */
  static override SERIALIZE_ATTRIBUTES: string[];

  override get expression(): string;

  override get total(): number;

  /**
   * Determine whether a string expression matches a NumericTerm
   * @param expression - The expression to parse
   */
  static matchTerm(expression: string): RegExpMatchArray | null;

  /**
   * Construct a term of this type given a matched regular expression array.
   * @param match -  The matched regular expression array
   * @returns The constructed term
   */
  static fromMatch(match: RegExpMatchArray): NumericTerm;
}

declare namespace NumericTerm {
  interface TermData {
    number: number;

    /**
     * @defaultValue `undefined`
     */
    options?: InexactPartial<RollTerm.Options>;
  }
}

export default NumericTerm;
