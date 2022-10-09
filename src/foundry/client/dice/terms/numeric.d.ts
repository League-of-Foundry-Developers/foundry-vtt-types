declare global {
  /**
   * A type of RollTerm used to represent static numbers.
   */
  class NumericTerm extends RollTerm {
    constructor({ number, options }: NumericTermData);

    number: NumericTermData["number"];

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
    static SERIALIZE_ATTRIBUTES: string[];

    get expression(): string;

    get total(): number;

    /**
     * Determine whether a string expression matches a NumericTerm
     * @param expression - The expression to parse
     */
    static matchTerm(expression: string): RegExpMatchArray | null;

    /* -------------------------------------------- */

    /**
     * Construct a term of this type given a matched regular expression array.
     * @param match -  The matched regular expression array
     * @returns The constructed term
     */
    static fromMatch(match: RegExpMatchArray): NumericTerm;
  }
}

interface NumericTermData {
  number: number;

  /**
   * @defaultValue `{}`
   */
  options?: RollTerm.Options;
}

export {};
