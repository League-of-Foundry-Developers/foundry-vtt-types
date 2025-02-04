import type { AnyObject, InexactPartial, FixedInstanceType, IntentionalPartial } from "fvtt-types/utils";
import type { RollParseNode } from "./_types.d.mts";
import type DiceTerm from "./terms/dice.d.mts";
import type PoolTerm from "./terms/pool.d.mts";
import type RollTerm from "./terms/term.d.mts";
import type RollResolver from "../applications/dice/roll-resolver.d.mts";

/**
 * An interface and API for constructing and evaluating dice rolls.
 * The basic structure for a dice roll is a string formula and an object of data against which to parse it.
 *
 * @typeParam D - the type of data object against which to parse attributes within the formula
 *
 * @example Attack with advantage!
 * ```typescript
 * let r = new Roll("2d20kh + @prof + @strMod", {prof: 2, strMod: 4});
 *
 * // The parsed terms of the roll formula
 * console.log(r.terms);    // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
 *
 * // Execute the roll
 * await r.evaluate();
 *
 * // The resulting equation after it was rolled
 * console.log(r.result);   // 16 + 2 + 4
 *
 * // The total resulting from the roll
 * console.log(r.total);    // 22
 * ```
 */
declare class Roll<D extends AnyObject = AnyObject> {
  /**
   * @param formula - The string formula to parse
   * @param data    - The data object against which to parse attributes within the formula
   *                  (default: `{}`)
   * @param options - (default: `{}`)
   */
  constructor(formula: string, data?: D, options?: Roll["options"]);

  /**
   * The original provided data object which substitutes into attributes of the roll formula
   */
  data: D;

  /**
   * Options which modify or describe the Roll
   */
  options: InexactPartial<Roll.Options>;

  /**
   * The identified terms of the Roll
   */
  terms: RollTerm[];

  /**
   * An array of inner DiceTerms which were evaluated as part of the Roll evaluation
   * @defaultValue `[]`
   */
  protected _dice: DiceTerm[];

  /**
   * Store the original cleaned formula for the Roll, prior to any internal evaluation or simplification
   */
  protected _formula: string;

  /**
   * Track whether this Roll instance has been evaluated or not. Once evaluated the Roll is immutable.
   * @defaultValue `false`
   */
  protected _evaluated: boolean;

  /**
   * Cache the numeric total generated through evaluation of the Roll.
   * @defaultValue `undefined`
   */
  protected _total: number | undefined;

  /**
   * A reference to the Roll at the root of the evaluation tree.
   * @defaultValue `undefined`
   */
  protected _root: Roll | undefined;

  /**
   * A reference to the RollResolver app being used to externally resolve this Roll.
   */
  protected _resolver: RollResolver; // TODO: Fix this

  /** A Proxy environment for safely evaluating a string using only available Math functions */
  static MATH_PROXY: Math;

  /**
   * The HTML template path used to render a complete Roll object to the chat log
   * @defaultValue `"templates/dice/roll.html"`
   */
  static CHAT_TEMPLATE: string;

  /**
   * The HTML template used to render an expanded Roll tooltip to the chat log
   * @defaultValue `"templates/dice/tooltip.html"`
   */
  static TOOLTIP_TEMPLATE: string;

  /**
   * A mapping of Roll instances to currently-active resolvers.
   */
  static RESOLVERS: Map<Roll, RollResolver>; // TODO: Fix this

  /* -------------------------------------------- */

  /**
   * Prepare the data structure used for the Roll.
   * This is factored out to allow for custom Roll classes to do special data preparation using provided input.
   * @param data - Provided roll data
   * @returns The prepared data object
   */
  protected _prepareData(data: D): D;

  /* -------------------------------------------- */
  /*  Roll Attributes                             */
  /* -------------------------------------------- */

  /**
   * Return an Array of the individual DiceTerm instances contained within this Roll.
   */
  get dice(): DiceTerm[];

  /**
   * Return a standardized representation for the displayed formula associated with this Roll.
   */
  get formula(): string;

  /**
   * The resulting arithmetic expression after rolls have been evaluated
   */
  get result(): string;

  /**
   * Return the total result of the Roll expression if it has been evaluated.
   */
  get total(): number | undefined;

  /**
   * Return the arbitrary product of evaluating this Roll.
   */
  get product(): number | undefined;

  /** Whether this Roll contains entirely deterministic terms or whether there is some randomness. */
  get isDeterministic(): boolean;

  /* -------------------------------------------- */
  /*  Roll Instance Methods                       */
  /* -------------------------------------------- */

  /**
   * Alter the Roll expression by adding or multiplying the number of dice which are rolled
   * @param multiply        - A factor to multiply. Dice are multiplied before any additions.
   * @param add             - A number of dice to add. Dice are added after multiplication.
   * @param multiplyNumeric - Apply multiplication factor to numeric scalar terms
   *                          (default: `false`)
   * @returns The altered Roll expression
   */
  alter(multiply: number, add: number, { multiplyNumeric }?: { multiplyNumeric: boolean }): this;

  /**
   * Clone the Roll instance, returning a new Roll instance that has not yet been evaluated.
   */
  clone(): this;

  /* -------------------------------------------- */

  /**
   * Execute the Roll, replacing dice and evaluating the total result
   * @param options - Options which inform how the Roll is evaluated
   *                  (default: `{}`)
   * @returns The evaluated Roll instance
   *
   * @example Evaluate a Roll expression
   * ```typescript
   * let r = new Roll("2d6 + 4 + 1d4");
   * await r.evaluate();
   * console.log(r.result); // 5 + 4 + 2
   * console.log(r.total);  // 11
   * ```
   */
  evaluate({
    minimize,
    maximize,
    allowStrings,
    allowInteractive,
    ...options
  }?: InexactPartial<Roll.Options>): Promise<Roll.Evaluated<this>>;

  /* -------------------------------------------- */

  /**
   * Execute the Roll synchronously, replacing dice and evaluating the total result.
   * @param options - Options which inform how the Roll is evaluated
   *                  (default: `{}`)
   *
   * @returns The evaluated Roll instance.
   */
  evaluateSync({ minimize, maximize, allowStrings, strict }?: InexactPartial<Roll.Options>): Roll.Evaluated<this>;

  /**
   * Evaluate the roll asynchronously.
   * A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
   * @param options - Options which inform how evaluation is performed
   * @internal
   */
  protected _evaluate(options?: InexactPartial<Roll.Options>): Promise<Roll.Evaluated<this>>;

  /* -------------------------------------------- */

  /**
   * Evaluate an AST asynchronously.
   * @param node    - The root node or term.
   * @param options - Options which inform how evaluation is performed
   *                  (default: `{}`)
   */
  protected _evaluateASTAsync(
    node: RollParseNode | RollTerm,
    options?: InexactPartial<Roll.Options>,
  ): Promise<string | number>;

  /* -------------------------------------------- */

  /**
   * Evaluate the roll synchronously.
   * @param options - Options which inform how evaluation is performed
   *                  (default: `{}`)
   */
  protected _evaluateSync(options?: InexactPartial<Roll.Options>): Roll.Evaluated<this>;

  /* -------------------------------------------- */

  /**
   * Evaluate an AST synchronously.
   * @param node    - The root node or term.
   * @param options - Options which inform how evaluation is performed
   *                  (default: `{}`)
   */
  protected _evaluateASTSync(node: RollParseNode | RollTerm, options?: InexactPartial<Roll.Options>): string | number;

  /* -------------------------------------------- */

  /**
   * Safely evaluate the final total result for the Roll using its component terms.
   * @returns The evaluated total
   */
  protected _evaluateTotal(): number;

  /* -------------------------------------------- */

  /**
   * Alias for evaluate.
   * @see Roll#evaluate
   * @param options - Options passed to Roll#evaluate.
   */
  roll(options?: InexactPartial<Roll.Options>): Promise<Roll.Evaluated<this>>;

  /* -------------------------------------------- */

  /**
   * Create a new Roll object using the original provided formula and data.
   * Each roll is immutable, so this method returns a new Roll instance using the same data.
   * @param options - Evaluation options passed to Roll#evaluate
   * @returns A new Roll object, rolled using the same formula and data
   */
  reroll(options?: InexactPartial<Roll.Options>): Promise<Roll.Evaluated<this>>;

  /* -------------------------------------------- */

  /**
   * Recompile the formula string that represents this Roll instance from its component terms.
   * @returns The re-compiled formula
   */
  resetFormula(): string;

  /* -------------------------------------------- */

  /**
   * Propagate flavor text across all terms that do not have any.
   * @param flavor -The flavor text.
   */
  propagateFlavor(flavor: string): void;

  /* -------------------------------------------- */

  /** @override */
  toString(): string;

  /* -------------------------------------------- */
  /*  Static Class Methods                        */
  /* -------------------------------------------- */

  /**
   * A factory method which constructs a Roll instance using the default configured Roll class.
   * @typeParam D - the type of data object against which to parse attributes within the formula
   * @param formula - The formula used to create the Roll instance
   * @param data    - The data object which provides component data for the formula
   * @param options - Additional options which modify or describe this Roll
   * @returns The constructed Roll instance
   */
  static create<D extends AnyObject = AnyObject>(
    formula: string,
    data?: D,
    options?: InexactPartial<Roll.Options>,
  ): typeof CONFIG.Dice.rolls extends [infer T] ? T : Roll<D>;

  /**
   * Get the default configured Roll class.
   */
  static get defaultImplementation(): typeof Roll;

  /**
   * Retrieve the appropriate resolver implementation based on the user's configuration.
   */
  static get resolverImplementation(): typeof RollResolver;

  /**
   * Transform an array of RollTerm objects into a cleaned string formula representation.
   * @param terms - An array of terms to represent as a formula
   * @returns The string representation of the formula
   */
  static getFormula(terms: RollTerm[]): string;

  /**
   * A sandbox-safe evaluation function to execute user-input code with access to scoped Math methods.
   * @param expression - The input string expression
   * @returns The numeric evaluated result
   */
  static safeEval(expression: string): number;

  /**
   * After parenthetical and arithmetic terms have been resolved, we need to simplify the remaining expression.
   * Any remaining string terms need to be combined with adjacent non-operators in order to construct parsable terms.
   * @param terms - An array of terms which is eligible for simplification
   * @returns An array of simplified terms
   */
  static simplifyTerms(terms: RollTerm[]): RollTerm[];

  /**
   * Simulate a roll and evaluate the distribution of returned results
   * @param formula - The Roll expression to simulate
   * @param n       - The number of simulations
   *                  (default: `10000`)
   * @returns The rolled totals
   */
  static simulate(formula: string, n?: number): Promise<number[]>;

  /**
   * Register an externally-fulfilled result with an active RollResolver.
   * @param method       - The fulfillment method.
   * @param denomination - The die denomination being fulfilled.
   * @param result       - The obtained result.
   */
  static registerResult(method: string, denomination: string, result: number): boolean | void;

  /* -------------------------------------------- */
  /*  Roll Formula Parsing                        */
  /* -------------------------------------------- */

  /**
   * Parse a formula expression using the compiled peggy grammar.
   *
   * @param formula - The original string expression to parse
   * @param data    - A data object used to substitute for attributes in the formula
   * @returns A parsed array of RollTerm instances
   */
  static parse(formula: string, data: Record<string, unknown>): RollTerm[];

  /* -------------------------------------------- */

  /**
   * Instantiate the nodes in an AST sub-tree into RollTerm instances.
   * @param ast - The root of the AST sub-tree.
   */
  static instantiateAST(ast: RollParseNode): RollTerm[];

  /**
   * Replace referenced data attributes in the roll formula with values from the provided data.
   * Data references in the formula use the \@attr syntax and would reference the corresponding attr key.
   *
   * @param formula - The original formula within which to replace
   * @param data    - The data object which provides replacements
   * @param options - Options which modify formula replacement
   */
  static replaceFormulaData<D extends Record<string, unknown>>(
    formula: string,
    data: D,
    options?: {
      /**
       * The value that should be assigned to any unmatched keys.
       * If null, the unmatched key is left as-is.
       */
      missing?: string;
      /**
       * Display a warning notification when encountering an un-matched key.
       * (default: `false`)
       */
      warn?: boolean;
    },
  ): string;

  /**
   * Validate that a provided roll formula can represent a valid
   * @param formula - A candidate formula to validate
   * @returns Is the provided input a valid dice formula?
   */
  static validate(formula: string): boolean;

  /**
   * Determine which of the given terms require external fulfillment.
   * @param terms - The terms.
   */
  static identifyFulfillableTerms(terms: RollTerm[]): DiceTerm[];

  /**
   * Classify a remaining string term into a recognized RollTerm class
   * @param term         - A remaining un-classified string
   * @param options      - Options which customize classification
   *                       (default: `{}`)
   * @param intermediate - Allow intermediate terms
   *                       (default: `true`)
   * @param prior        - The prior classified term
   * @param next         - The next term to classify
   * @returns A classified RollTerm instance
   */
  protected static _classifyStringTerm(
    term: string,
    {
      intermediate,
      prior,
      next,
    }?: InexactPartial<{ intermediate: boolean; prior: RollTerm | string; next: RollTerm | string }>,
  ): RollTerm;

  /* -------------------------------------------- */
  /*  Chat Messages                               */
  /* -------------------------------------------- */

  /**
   * Render the tooltip HTML for a Roll instance
   * @returns The rendered HTML tooltip as a string
   */
  getTooltip(): Promise<string>;

  /**
   * Render a Roll instance to HTML
   * @param options - Options which affect how the Roll is rendered
   *                  (default: `{}`)
   * @returns The rendered HTML template as a string
   */
  render(
    options?: InexactPartial<{
      /**
       * Flavor text to include
       * @defaultValue `undefined`
       */
      flavor: string;

      /**
       * A custom HTML template path
       * @defaultValue `this.constructor.CHAT_TEMPLATE`
       */
      template: string;

      /**
       * Is the Roll displayed privately?
       * @defaultValue `false`
       */
      isPrivate: boolean;
    }>,
  ): Promise<string>;

  /**
   * Transform a Roll instance into a ChatMessage, displaying the roll result.
   * This function can either create the ChatMessage directly, or return the data object that will be used to create.
   *
   * @param messageData - The data object to use when creating the message
   *                      (default: `{}`)
   * @param options     - Additional options which modify the created message.
   *                      (default: `{}`)
   * @param rollMode    - The template roll mode to use for the message from CONFIG.Dice.rollModes
   * @param create      - Whether to automatically create the chat message, or only return the
   *                      prepared chatData object.
   *                      (default: `true`)
   * @returns A promise which resolves to the created ChatMessage entity, if create is true
   *          or the Object of prepared chatData otherwise.
   */
  toMessage<const Create extends boolean | null | undefined>(
    messageData?: Roll.MessageData,
    options?: Roll.ToMessageOptions<Create>,
  ): Promise<Roll.ToMessageReturn<Create>>;

  /* -------------------------------------------- */
  /*  Interface Helpers                           */
  /* -------------------------------------------- */

  /**
   * Expand an inline roll element to display its contained dice result as a tooltip.
   * @param a - The inline-roll button
   */
  static expandInlineResult(a: HTMLAnchorElement): Promise<void>;

  /**
   * Collapse an expanded inline roll to conceal its tooltip.
   * @param a - The inline-roll button
   */
  static collapseInlineResult(a: HTMLAnchorElement): void;

  /**
     * Construct an inline roll link for this Roll.
     * @param object - Additional options to configure how the link is constructed.

     */
  toAnchor(options?: InexactPartial<Roll.ToAnchorOptions>): HTMLAnchorElement;

  /**
   * Represent the data of the Roll as an object suitable for JSON serialization.
   * @returns Structured data which can be serialized into JSON
   */
  toJSON(): {
    class: string;
    options: Roll.Options;
    dice: DiceTerm[];
    formula: string;
    terms: RollTerm[];
    total: number | undefined;
    evaluated: boolean;
  };

  /**
   * Recreate a Roll instance using a provided data object
   * @param data - Unpacked data representing the Roll
   * @returns A reconstructed Roll instance
   */
  static fromData<T extends Roll.AnyConstructor>(this: T, data: Roll.Data): FixedInstanceType<T>;

  /**
   * Recreate a Roll instance using a provided JSON string
   * @param json - Serialized JSON data representing the Roll
   * @returns A reconstructed Roll instance
   */
  static fromJSON(json: string): Roll;

  /**
   * Manually construct a Roll object by providing an explicit set of input terms
   * @param terms -The array of terms to use as the basis for the Roll
   * @param options - Additional options passed to the Roll constructor
   * @returns The constructed Roll instance
   *
   * @example Construct a Roll instance from an array of component terms
   * ```typescript
   * const t1 = new Die({number: 4, faces: 8};
   * const plus = new OperatorTerm({operator: "+"});
   * const t2 = new NumericTerm({number: 8});
   * const roll = Roll.fromTerms([t1, plus, t2]);
   * roll.formula; // 4d8 + 8
   * ```
   */
  static fromTerms<T extends Roll.AnyConstructor>(
    this: T,
    terms: RollTerm[],
    options?: InexactPartial<Roll.Options>,
  ): FixedInstanceType<T>;
}

declare namespace Roll {
  type Any = Roll<any>;
  type AnyConstructor = typeof AnyRoll;

  interface Options extends RollTerm.EvaluationOptions {
    /**
     * If false, force the use of non-interactive rolls and do not prompt the user to make manual rolls.
     * @defaultValue `true`
     */
    allowInteractive?: boolean | undefined;
    /**
     * Throw an Error if the Roll contains non-deterministic terms that cannot be evaluated synchronously.
     *  If this is set to false, non-deterministic terms will be ignored.
     */
    strict?: boolean | undefined;
  }

  interface SplitGroupOptions {
    openRegexp: RegExp | string;
    closeRegexp: RegExp | string;
    openSymbol: string;
    closeSymbol: string;
    onClose: (group: { open: string; terms: string[]; close: string }) => string[];
  }

  /** Additional options to configure how the link is constructed. */
  interface ToAnchorOptions {
    /** A custom label for the total. */
    label: string;

    /** Attributes to set on the link. (default: `{}`) */
    attrs: Record<string, string>;

    /** Custom data attributes to set on the link. (default: `{}`) */
    dataset: Record<string, string | undefined>;

    /**
     * Additional Classes to add to the link. (default: `[]`)
     * The classes `inline-roll` and `inline-result` are added by default.
     */
    classes: string[];

    /** A font-awesome icon class to use as the icon instead of a d20. */
    icon: string;
  }

  interface Data {
    formula: string;
    results: Array<number | string>;
    terms: Array<PoolTerm.TermData | DiceTerm.Data>;
    total: number | null;
  }

  // TODO(LukeAbby): When shims are added then `"user"` should also be added here #3065. Specifically `user` should be added as partial.
  // Also use `IntentionalPartial<ChatMessageCreateData, "content" | "sound" | "rolls">` once `documents-v2` is merged.
  //
  // This is `IntentionalPartial` because Foundry merges in defaults with `mergeObject`.
  interface MessageData
    extends Omit<ChatMessageCreateData, "content" | "sound" | "rolls">,
      IntentionalPartial<Pick<ChatMessageCreateData, "content" | "sound" | "rolls">> {
    /**
     * The HTML content of this chat message
     * @defaultValue `String(this.total)`
     */
    content?: ChatMessageCreateData["content"];

    /**
     * The URL of an audio file which plays when this message is received
     * @defaultValue `CONFIG.sounds.dice`
     */
    sound?: ChatMessageCreateData["sound"];

    /**
     * The URL of an audio file which plays when this message is received
     *
     * @deprecated - In `Roll.MessageData`, Foundry always overrides `rolls` to `[this]`.
     * This makes it useless to set. Do not use.
     */
    rolls?: ChatMessageCreateData["rolls"];
  }

  type Evaluated<T extends Roll> = T & { _evaluated: true; _total: number; get total(): number };

  interface ToMessageOptions<Create extends boolean | null | undefined> {
    /**
     * The template roll mode to use for the message from CONFIG.Dice.rollModes
     * @remarks "roll" equivalent to explicit undefined
     */
    rollMode?: keyof CONFIG.Dice.RollModes | "roll" | null | undefined;

    /**
     * Whether to automatically create the chat message, or only return the prepared chatData object.
     * @defaultValue `true`
     */
    create?: Create;
  }

  type ToMessageReturn<Create extends boolean | null | undefined> =
    | (Create extends true | undefined ? ChatMessage.ConfiguredInstance | undefined : never)
    | (Create extends false | null ? ChatMessageCreateData : never);
}

// TODO: Replace when `documents-v2` is merged.
type ChatMessageCreateData = foundry.data.fields.SchemaField.InnerPersistedType<ChatMessage.Schema>;

declare abstract class AnyRoll extends Roll<any> {
  constructor(arg0: never, ...args: never[]);
}

export default Roll;
