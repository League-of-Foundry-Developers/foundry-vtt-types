import { ConfiguredDocumentClass } from "../../../types/helperTypes";

declare global {
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
  class Roll<D extends object = {}> {
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
    options: InexactPartial<Options>;

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
     * Prepare the data structure used for the Roll.
     * This is factored out to allow for custom Roll classes to do special data preparation using provided input.
     * @param data - Provided roll data
     * @returns The prepared data object
     */
    protected _prepareData(data: D): D;

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

    /** Whether this Roll contains entirely deterministic terms or whether there is some randomness. */
    get isDeterministic(): boolean;

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
    evaluate(options?: InexactPartial<Options> & { async: true }): Promise<Evaluated<this>>;
    evaluate(options: InexactPartial<Options & { async: false }>): Evaluated<this>;
    evaluate(options?: InexactPartial<Options>): Evaluated<this> | Promise<Evaluated<this>>;

    /**
     * Evaluate the roll asynchronously.
     * A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
     * @param options - Options which inform how evaluation is performed
     * @internal
     */
    protected _evaluate(options?: InexactPartial<Omit<Options, "async">>): Promise<Evaluated<this>>;

    /**
     * Evaluate the roll synchronously.
     * A temporary helper method used to migrate behavior from 0.7.x (sync by default) to 0.9.x (async by default).
     * @param options - Options which inform how evaluation is performed
     */
    protected _evaluateSync(options?: InexactPartial<Omit<Options, "async">>): Evaluated<this>;

    /**
     * Safely evaluate the final total result for the Roll using its component terms.
     * @returns The evaluated total
     */
    protected _evaluateTotal(): number;

    /**
     * Alias for evaluate.
     * @see Roll#evaluate
     */
    roll(options?: InexactPartial<Options> & { async: true }): Promise<Evaluated<this>>;
    roll(options: InexactPartial<Options & { async: false }>): Evaluated<this>;
    roll(options?: InexactPartial<Options>): Evaluated<this> | Promise<Evaluated<this>>;

    /**
     * Create a new Roll object using the original provided formula and data.
     * Each roll is immutable, so this method returns a new Roll instance using the same data.
     * @param options - Evaluation options passed to Roll#evaluate
     * @returns A new Roll object, rolled using the same formula and data
     */
    reroll(options?: InexactPartial<Options> & { async: true }): Promise<Evaluated<this>>;
    reroll(options: InexactPartial<Options & { async: false }>): Evaluated<this>;
    reroll(options?: InexactPartial<Options>): Evaluated<this> | Promise<Evaluated<this>>;

    /**
     * A factory method which constructs a Roll instance using the default configured Roll class.
     * @typeParam D - the type of data object against which to parse attributes within the formula
     * @param formula - The formula used to create the Roll instance
     * @param data    - The data object which provides component data for the formula
     * @param options - Additional options which modify or describe this Roll
     * @returns The constructed Roll instance
     */
    static create<D extends Record<string, unknown> = {}>(
      formula: string,
      data?: D,
      options?: InexactPartial<Options>
    ): typeof CONFIG.Dice.rolls extends [infer T] ? T : Roll<D>;

    /**
     * Get the default configured Roll class.
     */
    static get defaultImplementation(): typeof Roll;

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
     * Parse a formula by following an order of operations:
     *
     * Step 1: Replace formula data
     * Step 2: Split outer-most parenthetical groups
     * Step 3: Further split outer-most dice pool groups
     * Step 4: Further split string terms on arithmetic operators
     * Step 5: Classify all remaining strings
     *
     * @param formula - The original string expression to parse
     * @param data    - A data object used to substitute for attributes in the formula
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
     * Validate that a provided roll formula can represent a valid
     * @param formula - A candidate formula to validate
     * @returns Is the provided input a valid dice formula?
     */
    static validate(formula: string): boolean;

    /**
     * Split a formula by identifying its outer-most parenthetical and math terms
     * @param _formula - The raw formula to split
     * @returns An array of terms, split on parenthetical terms
     */
    protected static _splitParentheses(_formula: string): string[];

    /**
     * Handle closing of a parenthetical term to create a MathTerm expression with a function and arguments
     */
    protected static _splitMathArgs(expression: string): MathTerm[];

    /**
     * Split a formula by identifying its outer-most dice pool terms
     * @param _formula - The raw formula to split
     * @returns An array of terms, split on parenthetical terms
     */
    protected _splitPools(_formula: string): string[];

    /**
     * Split a formula by identifying its outer-most groups using a certain group symbol like parentheses or brackets.
     * @param _formula - The raw formula to split
     * @param options  - Options that configure how groups are split
     *                   (default: `{}`)
     * @returns An array of terms, split on dice pool terms
     */
    protected _splitGroup(_formula: string, options?: InexactPartial<SplitGroupOptions>): string[];

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
    protected static _extractFlavors(formula: string): { formula: string; flavors: Flavor };

    /**
     * Restore flavor text to a string term
     * @param term    - The string term possibly containing flavor symbols
     * @param flavors - The extracted flavors object
     * @returns The restored term containing flavor text
     */
    protected static _restoreFlavor(term: string, flavors: Flavor): string;

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
      { intermediate, prior, next }?: { intermediate?: boolean; prior?: RollTerm | string; next?: RollTerm | string }
    ): RollTerm;

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
    render(options?: {
      /**
       * Flavor text to include
       * @defaultValue `undefined`
       */
      flavor?: string;

      /**
       * A custom HTML template path
       * @defaultValue `this.constructor.CHAT_TEMPLATE`
       */
      template?: string;

      /**
       * Is the Roll displayed privately?
       * @defaultValue `false`
       */
      isPrivate?: boolean;
    }): Promise<string>;

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
    toMessage<T extends DeepPartial<ConstructorParameters<ConfiguredDocumentClass<typeof ChatMessage>>[0]> = {}>(
      messageData?: T,
      { rollMode, create }?: { rollMode?: keyof CONFIG.Dice.RollModes | "roll"; create?: true }
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof ChatMessage>> | undefined>;
    toMessage<T extends DeepPartial<ConstructorParameters<ConfiguredDocumentClass<typeof ChatMessage>>[0]> = {}>(
      messageData: T,
      { rollMode, create }: { rollMode?: keyof CONFIG.Dice.RollModes | "roll"; create: false }
    ): MessageData<T>;
    toMessage<T extends DeepPartial<ConstructorParameters<ConfiguredDocumentClass<typeof ChatMessage>>[0]> = {}>(
      messageData: T,
      { rollMode, create }: { rollMode?: keyof CONFIG.Dice.RollModes | "roll"; create: boolean }
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof ChatMessage>> | undefined> | MessageData<T>;

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

    /**
     * Construct an inline roll link for this Roll.
     * @param object - Additional options to configure how the link is constructed.

     */
    toAnchor(options?: InexactPartial<ToAnchorOptions>): HTMLAnchorElement;

    /**
     * Represent the data of the Roll as an object suitable for JSON serialization.
     * @returns Structured data which can be serialized into JSON
     */
    toJSON(): {
      class: string;
      options: Options;
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
    static fromData<T extends Roll>(this: ConstructorOf<T>, data: Data): T;

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
    static fromTerms<T extends ConstructorOf<Roll<any>>>(
      this: T,
      terms: RollTerm[],
      options?: InexactPartial<Options>
    ): InstanceType<T>;
  }
}

type Options = RollTerm.EvaluationOptions;

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

  /** Custom data- attributes to set on the link. (default: `{}`) */
  dataset: Record<string, string | undefined>;

  /** Classes to add to the link. (default: `[]`) */
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

type Flavor = Record<`%F${number}%`, string>;

type MessageData<T extends DeepPartial<ConstructorParameters<typeof ChatMessage>[0]>> = {
  user: string;
  type: typeof foundry.CONST.CHAT_MESSAGE_TYPES["ROLL"];
  content: number;
  sound: typeof CONFIG.sounds.dice;
} & T;

type Evaluated<T extends Roll> = T & { _evaluated: true; _total: number; get total(): number };
