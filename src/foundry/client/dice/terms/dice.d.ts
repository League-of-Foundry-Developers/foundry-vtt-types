/**
 * An abstract base class for any type of RollTerm which involves randomized input from dice, coins, or other devices.
 */
declare abstract class DiceTerm extends RollTerm {
  /**
   * @param termData  - Data used to create the Dice Term, including the following:
   *                    (default: `{}`)
   * @param number    - The number of dice of this term to roll, before modifiers are applied
   *                    (default: `1`)
   * @param faces     - The number of faces on each die of this type
   *                    (default: `6`)
   * @param modifiers - An array of modifiers applied to the results
   *                    (default: `[]`)
   * @param results   - An optional array of pre-cast results for the term
   *                    (default: `[]`)
   * @param options   - Additional options that modify the term
   *                    (default: `{}`)
   */
  constructor(termData?: Partial<DiceTerm.TermData>);

  /**
   * The number of dice of this term to roll, before modifiers are applied
   */
  number: DiceTerm.TermData["number"];

  /**
   * The number of faces on the die
   */
  faces: DiceTerm.TermData["faces"];

  /**
   * An Array of dice term modifiers which are applied
   */
  modifiers: DiceTerm.TermData["modifiers"];

  /**
   * The array of dice term results which have been rolled
   */
  results: DiceTerm.Result[];

  /* -------------------------------------------- */

  /**
   * Define the denomination string used to register this DiceTerm type in CONFIG.Dice.terms
   * @defaultValue ""
   */
  static DENOMINATION: string;

  /**
   * Define the named modifiers that can be applied for this particular DiceTerm type.
   * @defaultValue `{}`
   */
  static MODIFIERS: DiceTerm.Modifiers;

  /**
   * A regular expression pattern which captures the full set of term modifiers
   * Anything until a space, group symbol, or arithmetic operator
   */
  static MODIFIERS_REGEXP_STRING: string;

  /** A regular expression used to separate individual modifiers */
  static MODIFIER_REGEXP: RegExp;

  /* -------------------------------------------- */
  /*  Dice Term Attributes                        */
  /* -------------------------------------------- */

  /** Return an array of rolled values which are still active within this term */
  get values(): number[];

  override get isDeterministic(): boolean;

  /* -------------------------------------------- */

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param multiply - A factor to multiply. Dice are multiplied before any additions.
   * @param add      - A number of dice to add. Dice are added after multiplication.
   * @returns The altered term
   */
  alter(multiply: number, add: number): this;

  /* -------------------------------------------- */

  protected _evaluateSync({ minimize, maximize }?: { minimize?: boolean; maximize?: boolean }): this;

  /* -------------------------------------------- */

  /**
   * Roll the DiceTerm by mapping a random uniform draw against the faces of the dice term.
   * @param minimize - Minimize the result, obtaining the smallest possible value.
   * @param maximize - Maximize the result, obtaining the largest possible value.
   * @returns The produced result
   */
  roll({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): DiceTerm.Result;

  /* -------------------------------------------- */

  /**
   * Return a string used as the label for each rolled result
   * @param result - The rolled result
   * @returns The result label
   */
  getResultLabel(result: DiceTerm.Result): string;

  /* -------------------------------------------- */

  /**
   * Get the CSS classes that should be used to display each rolled result
   * @param result - The rolled result
   * @returns The desired classes
   */
  getResultCSS(result: DiceTerm.Result): (string | null)[];

  /* -------------------------------------------- */

  /**
   * Render the tooltip HTML for a Roll instance
   * @returns The data object used to render the default tooltip template for this DiceTerm
   */
  getTooltipData(): DiceTerm.ToolTipData;

  /* -------------------------------------------- */
  /*  Modifier Helpers                            */
  /* -------------------------------------------- */

  /**
   * Sequentially evaluate each dice roll modifier by passing the term to its evaluation function
   * Augment or modify the results array.
   */
  protected _evaluateModifiers(): void;

  /* -------------------------------------------- */

  /**
   * Evaluate a single modifier command, recording it in the array of evaluated modifiers
   * @param command - The parsed modifier command
   * @param modifier -  The full modifier request
   */
  protected _evaluateModifier(command: string, modifier: string): void;
  /* -------------------------------------------- */

  /**
   * A helper comparison function.
   * Returns a boolean depending on whether the result compares favorably against the target.
   * @param result     - The result being compared
   * @param comparison - The comparison operator in [=,&lt;,&lt;=,\>,\>=]
   * @param target     - The target value
   * @returns Is the comparison true?
   */
  static compareResult(result: number, comparison: string, target: number): boolean;

  /* -------------------------------------------- */

  /**
   * A helper method to modify the results array of a dice term by flagging certain results are kept or dropped.
   * @param results - The results array
   * @param number  - The number to keep or drop
   * @param keep    - Keep results?
   *                  (default: `true`)
   * @param highest - Keep the highest?
   *                  (default: `true`)
   * @returns The modified results array
   */
  protected static _keepOrDrop(
    results: DiceTerm.Result[],
    number: number,
    {
      keep,
      highest
    }?: {
      keep: boolean;
      highest: boolean;
    }
  ): DiceTerm.Result;

  /* -------------------------------------------- */

  /**
   * A reusable helper function to handle the identification and deduction of failures
   * @param flagFailure - (default: `false`)
   * @param flagSuccess - (default: `false`)
   */
  protected static _applyCount(
    results: DiceTerm.Result[],
    comparison: string,
    target: number,
    {
      flagSuccess,
      flagFailure
    }?: {
      flagSuccess: boolean;
      flagFailure: boolean;
    }
  ): void;

  /* -------------------------------------------- */

  /**
   * A reusable helper function to handle the identification and deduction of failures
   * @param deductFailure - (default: `false`)
   * @param invertFailure - (default: `false`)
   */
  protected static _applyDeduct(
    results: DiceTerm.Result[],
    comparison: string,
    target: number,
    {
      deductFailure,
      invertFailure
    }?: {
      deductFailure: boolean;
      invertFailure: boolean;
    }
  ): void;

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * Determine whether a string expression matches this type of term
   * @param expression - The expression to parse
   * @param options - Additional options which customize the match
   * @param imputeNumber - Allow the number of dice to be optional, i.e. "d6"
   *                       (default: `true`)
   */
  static matchTerm(expression: string, { imputeNumber }?: { imputeNumber: boolean }): RegExpMatchArray | null;

  /* -------------------------------------------- */

  /**
   * Construct a term of this type given a matched regular expression array.
   * @param match - The matched regular expression array
   * @returns The constructed term
   */
  static fromMatch(match: RegExpMatchArray): DiceTerm;
}

declare namespace DiceTerm {
  interface Data extends Partial<TermData> {
    class?: string;
    results: DiceTerm.Result[];
  }

  interface TermData {
    number: number;
    faces: number;
    modifiers: string[];
    results: Result[];
    options: DiceTerm.Options;
  }

  type Options = RollTerm.Options;

  interface Result {
    result: number;
    active?: boolean;
    count?: number;
    success?: boolean;
    failure?: boolean;
    discarded?: boolean;
    rerolled?: boolean;
    exploded?: boolean;
  }

  interface ToolTipData {
    formula: string;
    total: number;
    faces: number;
    flavor: string;
    rolls: { result: string; classes: string }[];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Modifiers {}
}
