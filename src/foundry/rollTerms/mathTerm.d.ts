/**
 * A type of RollTerm used to apply a function from the Math library.
 */
declare class MathTerm extends RollTerm {
  /**
   * @param termData - Data used to create the MathTerm, including the following:
   *                   (default: `{}`)
   * @param fn - The named function in the Math environment which should be applied to the term
   * @param terms - An array of string argument terms for the function
   */
  constructor({ fn, terms, options }?: Partial<MathTerm.TermData>);

  /** The named function in the Math environment which should be applied to the term */
  fn: MathTerm.TermData['fn'];

  /** The cached result of evaluating the method arguments */
  result?: number;

  /** The cached Roll instances for each function argument */
  rolls: Roll[];

  /** An array of string argument terms for the function */
  terms: MathTerm.TermData['terms'];

  /* -------------------------------------------- */
  /*  Math Term Attributes                        */
  /* -------------------------------------------- */

  /** An array of evaluated DiceTerm instances that should be bubbled up to the parent Roll */
  get dice(): DiceTerm[];
}

declare namespace MathTerm {
  interface TermData {
    fn: string;
    options: RollTerm.Options;
    terms: string[];
  }
}
