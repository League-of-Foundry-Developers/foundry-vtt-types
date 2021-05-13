/**
 * A type of RollTerm used to capture static numbers.
 */
declare class NumericTerm extends RollTerm {
  constructor({ number, options }?: Partial<NumericTerm.TermData>);

  number: NumericTerm.TermData['number'];

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * Determine whether a string expression matches a NumericTerm
   * @param expression The expression to parse
   */
  static matchTerm(expression: string): RegExpMatchArray | null;

  /* -------------------------------------------- */

  /**
   * Construct a term of this type given a matched regular expression array.
   * @param match The matched regular expression array
   */
  static fromMatch(match: RegExpMatchArray): NumericTerm;
}

declare namespace NumericTerm {
  interface TermData {
    number: number;
    options: RollTerm.Options;
  }
}
