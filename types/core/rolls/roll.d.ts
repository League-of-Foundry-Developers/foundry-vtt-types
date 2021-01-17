/**
 * This class provides an interface and API for conducting dice rolls.
 * The basic structure for a dice roll is a string formula and an object of data
 * against which to parse it.
 * @typeParam D - the type of data object against which to parse attributes
 *                within the formula
 * @see {@link Die}
 * @see {@link DicePool}
 * @example
 * ```javascript
 * // Attack with advantage!
 * let r = new Roll("2d20kh + @prof + @strMod", {prof: 2, strMod: 4});
 *
 * // The parsed terms of the roll formula
 * console.log(r.terms);    // [Die, +, 2, +, 4]
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
declare class Roll<D = object> {
  /**
   * Allowed arithmetic operators which can join together terms in a Roll
   * expression
   * @defaultValue `['+', '-', '*', '/']`
   */
  static ARITHMETIC: string[]

  /**
   * @defaultValue `'templates/dice/roll.html'`
   */
  static CHAT_TEMPLATE: string

  /**
   * A Proxy environment for safely evaluating a string using only available
   * Math functions
   */
  static MATH_PROXY: Roll.MathProxy

  /**
   * A regular expression used to identify the Roll formula for parenthetical
   * terms
   * @defaultValue `/^\((.*)\)$/`
   */
  static PARENTHETICAL_RGX: RegExp

  /**
   * @defaultValue `'templates/dice/tooltip.html'`
   */
  static TOOLTIP_TEMPLATE: string

  /**
   * An array of inner terms which were rolled parenthetically
   */
  _dice: DiceTerm[]

  /**
   * The original formula before evaluation
   */
  _formula: string

  /**
   * An internal flag for whether the Roll object has been rolled
   * @defaultValue `false`
   * @internal
   */
  _rolled: boolean

  /**
   * Cache the evaluated total to avoid re-evaluating it
   * @defaultValue `null`
   * @internal
   */
  _total: number | null

  /**
   * The original provided data
   */
  data: D

  /**
   * The evaluated results of the Roll
   */
  results: Array<number | string>

  /**
   * The identified terms of the Roll
   */
  terms: Roll.Terms

  /**
   * @param formula - The string formula to parse
   * @param data - The data object against which to parse attributes within the
   *               formula
   *               (default: `{}`)
   */
  constructor (formula: string, data?: D)

  /**
   * Return an Array of the individual DiceTerm instances contained within this
   * Roll.
   */
  get dice (): DiceTerm[]

  /**
   * Return a standardized representation for the displayed formula associated
   * with this Roll.
   */
  get formula (): string

  /**
   * @deprecated since 0.7.0
   * @see {@link Roll#terms}
   */
  get parts (): Roll.Terms

  /**
   * The resulting arithmetic expression after rolls have been evaluated
   */
  get result (): string | null

  /**
   * Return the total result of the Roll expression if it has been evaluated,
   * otherwise null
   */
  get total (): number | null

  /**
   * Provide backwards compatibility for Roll data prior to 0.7.0
   * @deprecated since 0.7.0
   * @internal
   */
  static _backwardsCompatibleRoll (data: object): object

  /**
   * Collapse an expanded inline roll to conceal it's tooltip
   * @param a - The inline-roll button
   * @internal
   */
  static _collapseInlineResult (a: HTMLAnchorElement): void

  /**
   * Expand an inline roll element to display it's contained dice result as a
   * tooltip
   * @param a - The inline-roll button
   * @internal
   */
  static _expandInlineResult (a: HTMLAnchorElement): Promise<void>

  /**
   * Create a formula string from an array of Dice terms.
   */
  static cleanFormula (terms: Roll.Terms): string

  /**
   * Clean the terms of a Roll equation, removing empty space and de-duping
   * arithmetic operators
   * @param terms - The input array of terms
   * @returns The cleaned array of terms
   */
  static cleanTerms (terms: Roll.Terms): Roll.Terms

  /**
   * A factory method which constructs a Roll instance using the default
   * configured Roll class.
   * @param args - Arguments passed to the Roll instance constructor
   * @returns The constructed Roll instance
   */
  static create<D = object> (formula: string, data?: D): Roll<D>

  /**
   * Recreate a Roll instance using a provided data object
   * @param data - Unpacked data representing the Roll
   * @returns A reconstructed Roll instance
   */
  static fromData (data: object): Roll

  /**
   * Recreate a Roll instance using a provided JSON string
   * @param json - Serialized JSON data representing the Roll
   * @returns A reconstructed Roll instance
   */
  static fromJSON (json: string): Roll

  /**
   * Construct a new Roll object from a parenthetical term of an outer Roll.
   * @param term - The isolated parenthetical term, for example (4d6)
   * @param data - The Roll data object, provided by the outer Roll
   * @returns An inner Roll object constructed from the term
   */
  static fromTerm<D> (term: string, data: D): Roll<D>

  /**
   * @deprecated since 0.7.0
   * @see {@link Roll#evaluate}
   */
  static maximize (formula: string): Roll

  /**
   * @deprecated since 0.7.0
   * @see {@link Roll#evaluate}
   */
  static minimize (formula: string): Roll

  /**
   * Replace referenced data attributes in the roll formula with values from the
   * provided data.
   * Data references in the formula use the \@attr syntax and would reference
   * the corresponding attr key.
   * @param formula - The original formula within which to replace
   * @param data - The data object which provides replacements
   * @param options - (default: `{}`)
   * @param missing - The value that should be assigned to any unmatched keys.
   *                  If null, the unmatched key is left as-is.
   * @param warn - Display a warning notification when encountering an
   *               un-matched key.
   *               (default: `false`)
   */
  static replaceFormulaData<D> (
    formula: string,
    data: D,
    options?: {
      missing?: string
      warn?: boolean
    }
  ): string

  /**
   * Simulate a roll and evaluate the distribution of returned results
   * @param formula - The Roll expression to simulate
   * @param n - The number of simulations
   *            (default: `10000`)
   * @returns The rolled totals
   */
  static simulate (formula: string, n: number): number[]

  /**
   * Validate that a provided roll formula can represent a valid
   * @param formula - A candidate formula to validate
   * @returns Is the provided input a valid dice formula?
   */
  static validate (formula: string): boolean

  /**
   * Split a provided Roll formula to identify it's component terms.
   * Some terms are very granular, like a Number of an arithmetic operator
   * Other terms are very coarse like an entire inner Roll from a parenthetical
   * expression.
   * As a general rule, this function should return an Array of terms which are
   * ready to be evaluated immediately.
   * Some terms may require recursive evaluation.
   * @param formula - The formula to parse
   * @param options - (default: `{}`)
   * @param step - The numbered step in the Roll evaluation process.
   *               (default: `0`)
   * @returns An array of identified terms
   * @internal
   */
  _identifyTerms (formula: string, options?: { step: number }): Roll.Terms

  /**
   * Prepare the data structure used for the Roll.
   * This is factored out to allow for custom Roll classes to do special data
   * preparation using provided input.
   * @param data - Provided roll data
   * @internal
   */
  _prepareData (data: D): D

  /**
   * Safely evaluate a formulaic expression using a Proxy environment which is
   * allowed access to Math commands
   * @param expression - The formula expression to evaluate
   * @returns The returned numeric result, or null if the outcome is not numeric
   * @internal
   */
  _safeEval (expression: string): number | null

  /**
   * Identify and split a formula into separate terms by arithmetic terms
   * @internal
   */
  _splitDiceTerms (terms: Roll.Terms, step: number): Roll.Terms

  /**
   * Identify and split a formula into separate terms by parenthetical expressions
   * @internal
   */
  _splitParentheticalTerms (formula: string): Roll.Terms

  /**
   * Identify and split a formula into separate terms by curly braces which
   * represent pooled expressions
   * @internal
   */
  _splitPooledTerms (terms: Roll.Terms): Roll.Terms

  /**
   * Alter the Roll expression by adding or multiplying the number of dice which
   * are rolled
   * @param multiply - A factor to multiply. Dice are multiplied before any
   *                   additions.
   * @param add - A number of dice to add. Dice are added after multiplication.
   * @param options - (default: `{}`)
   * @param multiplyNumeric - Apply multiplication factor to numeric scalar
   *                          terms
   *                          (default: `false`)
   * @returns The altered Roll expression
   */
  alter (
    multiply: number,
    add: number,
    options?: {
      multiplyNumeric?: boolean
    }
  ): this

  /**
   * Clone the Roll instance, returning a new Roll instance that has not yet
   * been evaluated
   */
  clone (): Roll<D>

  /**
   * Execute the Roll, replacing dice and evaluating the total result
   * @param options - (default: `{}`)
   * @param minimize - Produce the minimum possible result from the Roll instead
   *                   of a random result.
   *                   (default: `false`)
   * @param maximize - Produce the maximum possible result from the Roll instead
   *                   of a random result.
   * @returns The rolled Roll object, able to be chained into other methods
   * @example
   * ```javascript
   * let r = new Roll("2d6 + 4 + 1d4");
   * r.evaluate();
   * console.log(r.result); // 5 + 4 + 2
   * console.log(r.total);  // 11
   * ```
   */
  evaluate (options?: { maximize?: boolean, minimize?: boolean }): this

  /**
   * Render the tooltip HTML for a Roll instance
   */
  getTooltip (): Promise<string>

  /**
   * Render a Roll instance to HTML
   * @param chatOptions - An object configuring the behavior of the resulting
   *                      chat message.
   *                      (default: `{}`)
   * @returns A Promise which resolves to the rendered HTML
   */
  render (chatOptions: Roll.ChatOptions): Promise<string>

  /**
   * Create a new Roll object using the original provided formula and data
   * Each roll is immutable, so this method returns a new Roll instance using
   * the same data.
   * @returns A new Roll object, rolled using the same formula and data
   */
  reroll (): Roll<D>

  /**
   * Evaluate and return the Roll expression.
   * This function simply calls the evaluate() method but is maintained for
   * backwards compatibility.
   * @returns The Roll instance, containing evaluated results and the rolled
   *          total.
   */
  roll (): this

  /**
   * Represent the data of the Roll as an object suitable for JSON
   * serialization.
   * @returns Structured data which can be serialized into JSON
   */
  toJSON (): object

  /**
   * Transform a Roll instance into a ChatMessage, displaying the roll result.
   * This function can either create the ChatMessage directly, or return the
   * data object that will be used to create.
   * @param messageData - The data object to use when creating the message
   *                      (default: `{}`)
   * @param options - Additional options which modify the created message.
   *                  (default: `{}`)
   * @param rollMode - The template roll mode to use for the message from
   *                   CONFIG.Dice.rollModes
   *                   (default: `null`)
   * @param create - Whether to automatically create the chat message, or only
   *                 return the prepared chatData object.
   *                 (default: `true`)
   * @returns A promise which resolves to the created ChatMessage entity, if
   *          create is true or the Object of prepared chatData otherwise.
   */
  toMessage (
    messageData?: object,
    options?: {
      create?: boolean
      rollMode?: string // TODO: update when roll modes are typed
    }
  ): Promise<ChatMessage> | object
}

declare namespace Roll {
  interface ChatOptions { // TODO: maybe move this to chat
    /**
     * @defaultValue `false`
     */
    blind?: boolean

    /**
     * @defaultValue `null`
     */
    flavor?: any

    isPrivate?: boolean

    template?: string

    user?: string
  }

  interface MathProxy extends Math {
    safeEval: (expression: string) => any
  }

  type Terms = Array<Roll | DicePool | DiceTerm | number | string>
}
