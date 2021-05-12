/**
 * This class provides an interface and API for conducting dice rolls.
 * The basic structure for a dice roll is a string formula and an object of data against which to parse it.
 *
 * @typeParam D - the type of data object against which to parse attributes within the formula
 *
 * @example
 * ```typescript
 * // Attack with advantage!
 * let r = new Roll("2d20kh + @prof + @strMod", {prof: 2, strMod: 4});
 *
 * // The parsed terms of the roll formula
 * console.log(r.terms);    // [Die, OperatorTerm, NumericTerm, OperatorTerm, NumericTerm]
 *
 * // Execute the roll
 * r.evaluate();
 *
 * // The resulting equation after it was rolled
 * console.log(r.result);   // 16 + 2 + 4
 *
 * // The total resulting from the roll
 * console.log(r.total);    // 22
 * ```
 */
declare class Roll<D extends object = {}> {
  /**
   * @param formula - The string formula to parse
   * @param data    - The data object against which to parse attributes within the formula
   *                  (default: `{}`)
   */
  constructor(formula: string, data?: D, options?: Roll['options']);

  /**
   * The original provided data
   */
  data: D;

  /**
   * Options which modify or describe the Roll
   */
  options: Partial<Roll.Options>;

  /**
   * The identified terms of the Roll
   */
  terms: RollTerm[];

  /**
   * An array of inner DiceTerms which were evaluated as part of the Roll evaluation
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
   * A Proxy environment for safely evaluating a string using only available Math functions
   */
  static MATH_PROXY: Roll.MathProxy;

  /**
   * The HTML template path used to render a complete Roll object to the chat log
   * @defaultValue `'templates/dice/roll.html'`
   */
  static CHAT_TEMPLATE: string;

  /**
   * The HTML template used to render an expanded Roll tooltip to the chat log
   * @defaultValue `'templates/dice/tooltip.html'`
   */
  static TOOLTIP_TEMPLATE: string;

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
  get total(): number;

  /**
   * @deprecated since 0.8.1
   */
  get _rolled(): boolean;

  /**
   * A factory method which constructs a Roll instance using the default configured Roll class.
   * @typeParam D - the type of data object against which to parse attributes within the formula
   * @param formula - The formula used to create the Roll instance
   * @param data - The data object which provides component data for the formula
   * @param options - Additional options which modify or describe this Roll
   * @returns The constructed Roll instance
   */
  static create<D extends Record<string, unknown> = {}>(
    formula: string,
    data?: D,
    options?: Partial<Roll.Options>
  ): Roll<D>;

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
  static safeEval(expression: string): number | unknown;

  /**
   * After parenthetical and arithmetic terms have been resolved, we need to simplify the remaining expression.
   * Any remaining string terms need to be combined with adjacent non-operators in order to construct parsable terms.
   * @param terms - An array of terms which is eligible for simplification
   * @returns An array of simplified terms
   */
  static simplifyTerms(terms: RollTerm[]): RollTerm[];

  /**
   * Parse a formula by following an order of operations:
   *
   * Step 1: Replace formula data
   * Step 2: Split outer-most parenthetical groups
   * Step 3: Further split outer-most dice pool groups
   * Step 4: Further split string terms on arithmetic operators
   * Step 5: Classify all remaining strings
   *
   * @param formula - The original string expression to parse
   * @param data - A data object used to substitute for attributes in the formula
   * @returns A parsed array of RollTerm instances
   */
  static parse(formula: string, data: object): RollTerm[];

  /**
   * Replace referenced data attributes in the roll formula with values from the provided data.
   * Data references in the formula use the \@attr syntax and would reference the corresponding attr key.
   *
   * @param formula - The original formula within which to replace
   * @param data    - The data object which provides replacements
   * @param missing - The value that should be assigned to any unmatched keys.
   *                  If null, the unmatched key is left as-is.
   * @param warn    - Display a warning notification when encountering an un-matched key.
   *                  (default: `false`)
   */
  static replaceFormulaData<D>(
    formula: string,
    data: D,
    {
      missing,
      warn
    }?: {
      missing?: string;
      warn?: boolean;
    }
  ): string;

  /**
   * Split a formula by identifying its outer-most parenthetical and math terms
   * @param _formula - The raw formula to split
   * @returns An array of terms, split on parenthetical terms
   */
  protected static _splitParentheses(_formula: string): string[];

  /**
   * Handle closing of a parenthetical term to create a MathTerm expression with a function and arguments
   */
  protected static _splitMathTerm(fn: Function, term: string): MathTerm[];

  /**
   * Split a formula by identifying its outer-most dice pool terms
   * @param _formula - The raw formula to split
   * @returns An array of terms, split on parenthetical terms
   */
  protected _splitPools(_formula: string): string[];

  /**
   * Split a formula by identifying its outer-most groups using a certain group symbol like parentheses or brackets.
   * @param _formula - The raw formula to split
   */
  protected _splitGroup(_formula: string, options: Partial<Roll.SplitGroupOptions>): string[];

  /**
   * Split a formula by identifying arithmetic terms
   * @param _formula - The raw formula to split
   * @returns An array of terms, split on arithmetic operators
   */
  protected _splitOperators(_formula: string): (string | OperatorTerm)[];

  /**
   * Temporarily remove flavor text from a string formula allowing it to be accurately parsed.
   * @param formula - The formula to extract
   * @returns The cleaned formula and extracted flavor mapping
   */
  protected static _extractFlavors(formula: string): { formula: string; flavors: Roll.Flavor };

  /**
   * Restore flavor text to a string term
   * @param term - The string term possibly containing flavor symbols
   * @param flavors - The extracted flavors object
   */
  protected static _restoreFlavor(term: string, flavors: Roll.Flavor): string;

  /**
   * Classify a remaining string term into a recognized RollTerm class
   * @param term - A remaining un-classified string
   * @param options - Options which customize classification
   *                  (default: `{}`)
   * @param intermediate - Allow intermediate terms
   *                      (default: `false`)
   * @param prior - The prior classified term
   * @param next - The next term to classify
   * @returns A classified RollTerm instance
   */
  protected static _classifyStringTerm(
    term: string,
    { intermediate, prior, next }?: { intermediate?: boolean; prior?: RollTerm | string; next?: RollTerm | string }
  ): RollTerm;

  /**
   * Execute the Roll, replacing dice and evaluating the total result
   * @param options - Options which inform how the Roll is evaluated
   *                  (default: all properties `false`)
   * @returns The evaluated Roll instance
   *
   * @example
   * ```typescript
   * let r = new Roll("2d6 + 4 + 1d4");
   * r.evaluate();
   * console.log(r.result); // 5 + 4 + 2
   * console.log(r.total);  // 11
   * ```
   */
  evaluate(options?: Partial<Roll.Options>): this | Promise<this>;

  /**
   * Evaluate the roll asynchronously.
   * A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
   */
  protected _evaluate(options?: Partial<Exclude<Roll.Options, 'async'>>): Promise<this>;

  /**
   * Evaluate the roll synchronously.
   * A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
   */
  protected _evaluateSync(options?: Partial<Exclude<Roll.Options, 'async'>>): this;

  /**
   * Safely evaluate the final total result for the Roll using its component terms.
   */
  protected _evaluateTotal(): number;

  /**
   * Clone the Roll instance, returning a new Roll instance that has not yet been evaluated.
   */
  clone(): this;

  /**
   * Alias for evaluate.
   * @see Roll#evaluate
   */
  roll(): this;

  /**
   * Create a new Roll object using the original provided formula and data.
   * Each roll is immutable, so this method returns a new Roll instance using the same data.
   * @param options - Evaluation options passed to Roll#evaluate
   * @returns A new Roll object, rolled using the same formula and data
   */
  reroll(options?: Partial<Roll.Options>): ReturnType<Roll['evaluate']>;

  /**
   * Simulate a roll and evaluate the distribution of returned results
   * @param formula - The Roll expression to simulate
   * @param n       - The number of simulations
   *                  (default: `10000`)
   * @returns The rolled totals
   */
  static simulate(formula: string, n?: number): number[];

  /**
   * Validate that a provided roll formula can represent a valid
   * @param formula - A candidate formula to validate
   * @returns Is the provided input a valid dice formula?
   */
  static validate(formula: string): boolean;

  /**
   * Render the tooltip HTML for a Roll instance
   * @returns The rendered HTML tooltip as a string
   */
  getTooltip(): Promise<string>;

  /* -------------------------------------------- */

  /**
   * Render a Roll instance to HTML
   * @param chatOptions - An object configuring the behavior of the resulting chat message.
   *                      (default: `{}`)
   * @returns The rendered HTML template as a string
   */
  render(chatOptions?: Roll.ChatOptions): Promise<string>;

  /* -------------------------------------------- */

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
  toMessage<T extends DeepPartial<ChatMessage.CreateData> = {}>(
    messageData?: T,
    { rollMode, create }?: { rollMode?: foundry.CONST.DiceRollMode; create?: true }
  ): Promise<ChatMessage>;
  toMessage<T extends DeepPartial<ChatMessage.CreateData> = {}>(
    messageData: T,
    { rollMode, create }: { rollMode?: foundry.CONST.DiceRollMode; create: false }
  ): Roll.MessageData<T>;
  toMessage<T extends DeepPartial<ChatMessage.CreateData> = {}>(
    messageData: T,
    { rollMode, create }: { rollMode?: foundry.CONST.DiceRollMode; create: boolean }
  ): Promise<ChatMessage> | Roll.MessageData<T>;

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
    total: number | null;
    evaluated: boolean;
  };

  /**
   * Recreate a Roll instance using a provided data object
   * @param data - Unpacked data representing the Roll
   * @returns A reconstructed Roll instance
   */
  static fromData<T extends Roll>(this: ConstructorOf<T>, data: Roll.Data): T;

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
   * @example
   * ```typescript
   * const t1 = new Die({number: 4, faces: 8};
   * const plus = new OperatorTerm({operator: "+"});
   * const t2 = new NumericTerm({number: 8});
   * const roll = Roll.fromTerms([t1, plus, t2]);
   * roll.formula; // 4d8 + 8
   * ```
   */
  static fromTerms<D extends Record<string, unknown>>(terms: RollTerm[], options: Roll.Options): Roll<D>;

  /**
   * Expand an inline roll element to display it's contained dice result as a tooltip
   * @param a - The inline-roll button
   */
  static expandInlineResult(a: HTMLAnchorElement): Promise<void>;

  /**
   * Collapse an expanded inline roll to conceal it's tooltip
   * @param a - The inline-roll button
   */
  static collapseInlineResult(a: HTMLAnchorElement): void;
}

declare namespace Roll {
  // TODO: maybe move this to chat
  interface ChatOptions {
    /**
     * @defaultValue `false`
     */
    blind?: boolean;

    /**
     * @defaultValue `null`
     */
    flavor?: any;

    isPrivate?: boolean;

    template?: string;

    user?: string;
  }

  interface Options {
    /** Produce the minimum possible result from the Roll instead of a random result. */
    maximize: boolean;
    /** Minimize the result, obtaining the smallest possible value */
    minimize: boolean;
    /**
     * Evaluate the roll asynchronously, receiving a Promise as the returned value.
     * This will become the default behavior in version 10.x
     */
    async: boolean;
  }

  interface SplitGroupOptions {
    openRegexp: RegExp | string;
    closeRegexp: RegExp | string;
    openSymbol: string;
    closeSymbol: string;
    onClose: (group: { open: string; terms: string[]; close: string }) => string[];
  }

  interface Data {
    formula: string;
    results: Array<number | string>;
    terms: Array<(PoolTerm.TermData & { class: 'DicePool' }) | DiceTerm.Data>;
    total: number | null;
  }

  type Flavor = Record<`%F${number}%`, string>;

  /**
   * @deprecated since 0.8.1
   */
  interface MathProxy extends Math {
    safeEval: (arg: Parameters<typeof Roll['safeEval']>) => ReturnType<typeof Roll['safeEval']>;
  }

  type MessageData<T extends DeepPartial<ChatMessage.CreateData>> = {
    user: string;
    type: typeof foundry.CONST.CHAT_MESSAGE_TYPES['ROLL'];
    content: number;
    sound: typeof CONFIG.sounds.dice;
  } & T;
}
