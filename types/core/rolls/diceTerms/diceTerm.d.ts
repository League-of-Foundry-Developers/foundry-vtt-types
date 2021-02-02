/**
 * An abstract base class for any term which appears in a dice roll formula
 */
declare abstract class DiceTerm {
  /**
   * @param termData  - Data used to create the Dice Term, including the following:
   *                    (default: `{}`)
   * @param number    - The number of dice of this term to roll, before modifiers are applied
   *                    (default: `1`)
   * @param faces     - The number of faces on each die of this type
   *                    (default: `6`)
   * @param modifiers - An array of modifiers applied to the results
   *                    (default: `[]`)
   * @param options   - Additional options that modify the term
   *                    (default: `{}`)
   */
  constructor(termData?: Partial<DiceTerm.TermData>);

  /**
   * The number of dice of this term to roll, before modifiers are applied
   */
  number: DiceTerm.TermData['number'];

  /**
   * The number of faces on the die
   */
  faces: DiceTerm.TermData['faces'];

  /**
   * An Array of dice term modifiers which are applied
   */
  modifiers: DiceTerm.TermData['modifiers'];

  /**
   * An object of additional options which modify the dice term
   */
  options: DiceTerm.TermData['options'];

  /**
   * The array of dice term results which have been rolled
   */
  results: DiceTerm.Result[];

  /**
   * An internal flag for whether the dice term has been evaluated
   */
  protected _evaluated: boolean;

  /* -------------------------------------------- */

  /**
   * Return the dice expression portion of the full term formula, excluding any flavor text.
   */
  get expression(): string;

  /* -------------------------------------------- */

  /**
   * Return a standardized representation for the displayed formula associated with this DiceTerm
   */
  get formula(): string;

  /* -------------------------------------------- */

  /**
   * Return the flavor text associated with a particular DiceTerm, possibly an empty string if the term is flavorless.
   */
  get flavor(): string;

  /* -------------------------------------------- */

  /**
   * Return the total result of the DiceTerm if it has been evaluated
   */
  get total(): number | null;

  /* -------------------------------------------- */

  /**
   * Return an array of rolled values which are still active within this term
   */
  get values(): number[];

  /* -------------------------------------------- */

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param multiply - A factor to multiply. Dice are multiplied before any additions.
   * @param add      - A number of dice to add. Dice are added after multiplication.
   * @returns The altered term
   */
  alter(multiply: number, add: number): this;

  /* -------------------------------------------- */

  /**
   * Evaluate the roll term, populating the results Array.
   * @param options - (default: `{}`)
   * @param minimize - Apply the minimum possible result for each roll.
   *                   (default: `false`)
   * @param maximize - Apply the maximum possible result for each roll.
   *                   (default: `false`)
   * @returns The evaluated dice term
   */
  evaluate({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): this;

  /* -------------------------------------------- */

  /**
   * Roll the DiceTerm by mapping a random uniform draw against the faces of the dice term.
   * @param minimize - Apply the minimum possible result instead of a random result.
   * @param maximize - Apply the maximum possible result instead of a random result.
   */
  roll({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): DiceTerm.Result;

  /* -------------------------------------------- */

  /**
   * Return a string used as the label for each rolled result
   * @param result - The numeric result
   * @returns The result label
   */
  static getResultLabel(result: string): string;

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
   * A helper comparison function.
   * Returns a boolean depending on whether the result compares favorably against the target.
   * @param result     - The result being compared
   * @param comparison - The comparison operator in [=,\<,\<=,\>,\>=]
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
    results: DiceTerm.Result,
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
   * Construct a DiceTerm from a provided data object
   * @param data - Provided data from an un-serialized term
   * @returns The constructed DiceTerm
   */
  static fromData(data: Coin.Data | Coin.OldData): Coin;
  static fromData(data: FateDie.Data | FateDie.OldData): FateDie;
  static fromData(data: Die.Data | Die.OldData): Die;
  static fromData(data: DiceTerm.Data | DiceTerm.OldData): Die;

  /* -------------------------------------------- */

  /**
   * Parse a provided roll term expression, identifying whether it matches this type of term.
   * @param options - Additional term options
   * @returns The constructed DiceTerm instance
   */
  static fromExpression(expression: string, options: DiceTerm.Options): DiceTerm | null;

  /* -------------------------------------------- */

  /**
   * Check if the expression matches this type of term
   * @param expression - The expression to parse
   * @param imputeNumber - Allow the number of dice to be optional, i.e. "d6"
   *                       (default: `true`)
   */
  static matchTerm(expression: string, { imputeNumber }?: { imputeNumber: boolean }): RegExpMatchArray | null;

  /* -------------------------------------------- */

  /**
   * Create a "fake" dice term from a pre-defined array of results
   * @param options - Arguments used to initialize the term
   * @param results - An array of pre-defined results
   * @example
   * ```javascript
   * let d = new Die({faces: 6, number: 4, modifiers: ["r<3"]});
   * d.evaluate();
   * let d2 = Die.fromResults({faces: 6, number: 4, modifiers: ["r<3"]}, d.results);
   * ```
   */
  static fromResults(options: Partial<DiceTerm.TermData>, results: DiceTerm.Result[]): DiceTerm;

  /* -------------------------------------------- */

  /**
   * Serialize the DiceTerm to a JSON string which allows it to be saved in the database or embedded in text.
   * This method should return an object suitable for passing to the JSON.stringify function.
   */
  toJSON(): object;

  /* -------------------------------------------- */

  /**
   * Reconstruct a DiceTerm instance from a provided JSON string
   * @param json - A serialized JSON representation of a DiceTerm
   * @returns A reconstructed DiceTerm from the provided JSON
   */
  static fromJSON(json: string): DiceTerm;

  /* -------------------------------------------- */

  /**
   * Provide backwards compatibility for Die syntax prior to 0.7.0
   */
  protected static _backwardsCompatibleTerm(data: DiceTerm.OldData): DiceTerm.Data;

  /* -------------------------------------------- */

  /**
   * Define the denomination string used to register this Dice type in
   * CONFIG.Dice.terms
   * @defaultValue `''`
   */
  static DENOMINATION: string;

  /**
   * Define the modifiers that can be used for this particular DiceTerm type.
   */
  static MODIFIERS: Record<string, string | ((diceTerm: DiceTerm, m: string) => void)>;

  /**
   * A regular expression pattern which identifies a potential DiceTerm modifier
   * @defaultValue `/([A-z]+)([^A-z\s()+\-*\/]+)?/g`
   */
  static MODIFIER_REGEX: RegExp;

  /**
   * A regular expression pattern which indicates the end of a DiceTerm
   * @defaultValue `'([^ ()+\\-/*\\[]+)?'`
   */
  static MODIFIERS_REGEX: string;

  /**
   * A regular expression pattern which identifies part-specific flavor text
   * @defaultValue `'(?:\\[(.*)\\])?'`
   */
  static FLAVOR_TEXT_REGEX: string;
}

declare namespace DiceTerm {
  interface Data extends Partial<TermData> {
    class?: string;
    results: DiceTerm.Result[];
  }

  interface TermData {
    faces: number;
    modifiers: string[];
    number: number;
    options: DiceTerm.Options;
  }

  interface OldData {
    class: Data['class'];
    formula: string;
    rolls: Array<{
      active: boolean;
      roll: number;
    }>;
  }

  interface Options {
    flavor?: string;
  }

  interface Result {
    active: boolean;
    discarded?: boolean;
    result: number;
  }
}
