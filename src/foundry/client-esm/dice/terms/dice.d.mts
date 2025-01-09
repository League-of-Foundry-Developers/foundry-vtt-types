import type { InexactPartial, FixedInstanceType } from "../../../../utils/index.d.mts";
import type { DiceRollParseNode } from "../_types.d.mts";

import type RollTerm from "./term.d.mts";
import type Roll from "../roll.d.mts";

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
  constructor(termData?: InexactPartial<DiceTerm.TermData>);

  get method(): string; // TODO: Convert to CONFIG.Dice.fulfillment.methods

  set method(method: string); // TODO: Convert to CONFIG.Dice.fulfillment.methods

  #method: string; // TODO: Convert to CONFIG.Dice.fulfillment.methods

  /**  An Array of dice term modifiers which are applied. */
  modifiers: DiceTerm.TermData["modifiers"];

  /** The array of dice term results which have been rolled. */
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

  static REGEXP: RegExp;

  /**
   * @defaultValue `["number", "faces", "modifiers", "results", "method"]`
   */
  static SERIALIZE_ATTRIBUTES: string[];

  /* -------------------------------------------- */
  /*  Dice Term Attributes                        */
  /* -------------------------------------------- */

  /** The number of dice of this term to roll. Returns undefined if the number is a
   * complex term that has not yet been evaluated.
   */
  get number(): DiceTerm.TermData["number"] | undefined;
  /** The number of dice of this term to roll. */
  set number(value: DiceTerm.TermData["number"]);

  /**
   * The number of dice of this term to roll, before modifiers are applied, or a Roll instance that will be evaluated to
   * a number.
   */
  _number: DiceTerm.TermData["number"] | Roll;

  /**
   * The number of faces on the die. Returns undefined if the faces are represented as a complex term that has not yet
   * been evaluated.
   */
  get faces(): DiceTerm.TermData["faces"] | undefined;
  set faces(value: DiceTerm.TermData["faces"]);

  /** The number of faces on the die, or a Roll instance that will be evaluated to a number. */
  _faces: DiceTerm.TermData["faces"] | Roll;

  /* -------------------------------------------- */
  /**  The denomination of this DiceTerm instance. */
  get denomination(): string;

  /** An array of additional DiceTerm instances involved in resolving this DiceTerm. */
  get dice(): DiceTerm[];

  override get total(): number | undefined;

  /** Return an array of rolled values which are still active within this term */
  get values(): number[];

  override get isDeterministic(): boolean;

  /* -------------------------------------------- */
  /*  Dice Term Methods                           */
  /* -------------------------------------------- */

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param multiply - A factor to multiply. Dice are multiplied before any additions.
   * @param add      - A number of dice to add. Dice are added after multiplication.
   * @returns The altered term
   */
  alter(multiply: number, add: number): this;

  /* -------------------------------------------- */

  protected _evaluate(options?: InexactPartial<DiceTerm.EvaluationOptions>): this | Promise<this>;

  /* -------------------------------------------- */

  /**
   * Evaluate this dice term asynchronously.
   * @param options - Options forwarded to inner Roll evaluation. (Default: `{}`)
   */
  _evaluateAsync(options?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<this>;

  /* -------------------------------------------- */
  /**
   * Evaluate deterministic values of this term synchronously.
   * @param options - Options forwarded to inner Roll evaluation. (Default: `{}`)
   */
  _evaluateSync(options?: InexactPartial<DiceTerm.EvaluationOptions>): this;

  /* -------------------------------------------- */

  /**
   * Roll the DiceTerm by mapping a random uniform draw against the faces of the dice term.
   * @param minimize - Minimize the result, obtaining the smallest possible value.
   * @param maximize - Maximize the result, obtaining the largest possible value.
   * @returns The produced result
   */
  roll({ minimize, maximize, ...options }?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<DiceTerm.Result>;

  /* -------------------------------------------- */

  /**
   * Generate a roll result value for this DiceTerm based on its fulfillment method.
   * @param  options - Options forwarded to the fulfillment method handler.
   * @returns Returns a Promise that resolves to the fulfilled number, or undefined if it could
   *          not be fulfilled.
   */
  protected _roll(options?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<number | undefined>;

  /* -------------------------------------------- */

  /**
   * Invoke the configured fulfillment handler for this term to produce a result value.
   * @param options -Options forwarded to the fulfillment method handler.
   * @returns Returns a Promise that resolves to the fulfilled number, or undefined if it could
   *          not be fulfilled.
   */
  #invokeFulfillmentHandler(options?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<number | undefined>;

  /* -------------------------------------------- */

  /**
   * Maps a randomly-generated value in the interval [0, 1) to a face value on the die.
   * @param randomUniform - A value to map. Must be in the interval [0, 1).
   * @returns The face value.
   */
  mapRandomFace(randomUniform: number): number;

  /* -------------------------------------------- */

  /** Generate a random face value for this die using the configured PRNG. */
  randomFace(): number;

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
    { keep, highest }?: InexactPartial<{ keep: boolean; highest: boolean }>,
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
    { flagSuccess, flagFailure }?: InexactPartial<{ flagSuccess: boolean; flagFailure: boolean }>,
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
    { deductFailure, invertFailure }?: InexactPartial<{ deductFailure: boolean; invertFailure: boolean }>,
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
  static matchTerm(
    expression: string,
    { imputeNumber }?: InexactPartial<{ imputeNumber: boolean }>,
  ): RegExpMatchArray | null;

  /* -------------------------------------------- */

  /**
   * Construct a term of this type given a matched regular expression array.
   * @param match - The matched regular expression array
   * @returns The constructed term
   */
  static fromMatch(match: RegExpMatchArray): DiceTerm;

  /* -------------------------------------------- */
  /** Construct a DiceTerm from parser information. */
  static override fromParseNode(node: DiceRollParseNode): DiceTerm;

  /* -------------------------------------------- */
  /*  Serialization & Loading                     */
  /* -------------------------------------------- */

  protected static _fromData<T extends RollTerm.AnyConstructor>(
    this: T,
    data: Record<string, unknown>,
  ): FixedInstanceType<T>;

  override toJSON(): Record<string, unknown>;
}

declare namespace DiceTerm {
  type AnyConstructor = typeof AnyDiceTerm;

  interface Data extends InexactPartial<TermData> {
    class?: string | undefined;
    results: DiceTerm.Result[];
  }

  interface TermData {
    number: number;
    faces: number;
    modifiers: string[];
    results: Result[];
    options: DiceTerm.Options;
  }

  interface Options extends RollTerm.Options {}

  interface Result {
    /** The numeric result. */
    result: number;
    /** Is this result active, contributing to the total? */
    active?: boolean | undefined;
    /** A value that the result counts as, otherwise the result is not used directly as. */
    count?: number | undefined;
    /** Does this result denote a success? */
    success?: boolean | undefined;
    /** Does this result denote a failure? */
    failure?: boolean | undefined;
    /** Was this result discarded? */
    discarded?: boolean | undefined;
    /** Was this result rerolled? */
    rerolled?: boolean | undefined;
    /** Was this result exploded? */
    exploded?: boolean | undefined;
  }

  interface ToolTipData {
    total: number;
    faces: number;
    flavor: string;
    icon: string;
    method: string;
    formula: string;
    rolls: { result: string; classes: string }[];
  }

  interface EvaluationOptions extends RollTerm.EvaluationOptions {
    /**
     * Throw an error if attempting to evaluate a die term in a way that cannot be done
     *  synchronously.
     * @defaultValue `true`
     */
    strict: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Modifiers {}
}

declare abstract class AnyDiceTerm extends DiceTerm {
  constructor(arg0: never, ...args: never[]);
}

export default DiceTerm;
