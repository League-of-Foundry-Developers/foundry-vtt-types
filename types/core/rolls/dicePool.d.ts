/**
 * A dice pool represents a set of Roll expressions which are collectively modified to compute an effective total
 * across all Rolls in the pool. The final total for the pool is defined as the sum over kept rolls, relative to any
 * success count or margin.
 *
 * @example
 * ```typescript
 * // Consider 3 rolls
 * let r1 = new Roll("4d6");
 * let r2 = new Roll("3d8");
 * let r3 = new Roll("2d10");
 *
 * // Keep the highest of the 3 roll expressions
 * let pool = new DicePool({
 *   rolls: [r1,r2,r3],
 *   modifiers: ["kh"]
 * });
 * pool.evaluate();
 *
 * ```
 * @example
 * ```typescript
 * // Construct a DicePool from a string formula
 * let pool = DicePool.fromExpression("{4d6,3d8,2d10}kh");
 * ```
 */
declare class DicePool {
  /**
   * @param modifiers - (default: `[]`)
   * @param options   - (default: `{}`)
   * @param rolls     - (default: `[]`)
   */
  constructor({ rolls, modifiers, options }?: { rolls?: Array<Roll | number>; modifiers?: string[]; options?: object });

  /**
   * The elements of a Dice Pool must be Roll objects or numbers
   */
  rolls: Array<Roll | number>;

  /**
   * The string modifiers applied to resolve the pool
   */
  modifiers: string[];

  /**
   * An object of additional options which modify the pool
   */
  options: object;

  /**
   * The array of dice pool results which have been rolled
   * @defaultValue `[]`
   */
  results: DiceTerm.Result;

  /**
   * An internal flag for whether the dice term has been evaluated
   * @defaultValue `false`
   */
  protected _evaluated: boolean;

  /**
   * Cache the evaluated total to avoid re-evaluating it
   * @defaultValue `null`
   */
  protected _total: number | null;

  /* -------------------------------------------- */

  /**
   * Define the modifiers that can be used for this particular DiceTerm type.
   */
  static MODIFIERS: {
    cf: 'countFailures';
    cs: 'countSuccess';
    d: 'drop';
    dh: 'drop';
    dl: 'drop';
    k: 'keep';
    kh: 'keep';
    kl: 'keep';
  };

  /* -------------------------------------------- */

  /**
   * A regular expression pattern which identifies a potential DicePool modifier
   * @defaultValue `/([A-z]+)([^A-z\s()+\-*\/]+)?/g`
   */
  static MODIFIER_REGEX: RegExp;

  /* -------------------------------------------- */

  /**
   * A regular expression used to identify a valid Dice Pool
   * @defaultValue `/^{([^}]+)}([A-z][A-z0-9<=>]+)?$/`
   */
  static POOL_REGEX: RegExp;

  /* -------------------------------------------- */

  /**
   * Return an Array of each individual DiceTerm instances contained within the DicePool.
   */
  get dice(): DiceTerm[];

  /* -------------------------------------------- */

  /**
   * Return a standardized representation for the displayed formula associated with this DicePool.
   */
  get formula(): string;

  /* -------------------------------------------- */

  /**
   * Return the total result of the DicePool if it has been evaluated
   */
  get total(): number | null;

  /* -------------------------------------------- */

  /**
   * Return an array of rolled values which are still active within the DicePool
   */
  get values(): number[];

  /* -------------------------------------------- */

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param args - Arguments passed to each contained Roll#alter method.
   * @returns The altered pool
   */
  alter(multiply: number, add: number, { multiplyNumeric }?: { multiplyNumeric?: boolean }): this;

  /* -------------------------------------------- */

  /**
   * Evaluate the DicePool, populating the results Array.
   * @param minimize - Apply the minimum possible result for each roll.
   *                   (default: `false`)
   * @param maximize - Apply the maximum possible result for each roll.
   *                   (default: `false`)
   * @returns The evaluated dice term
   */
  evaluate({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): this;

  /* -------------------------------------------- */

  /**
   * Sequentially evaluate each dice roll modifier by passing the term to its evaluation function
   * Augment or modify the results array.
   */
  protected _evaluateModifiers(): void;

  /* -------------------------------------------- */
  /*  Saving and Loading                          */
  /* -------------------------------------------- */

  /**
   * Reconstruct a DicePool instance from a provided data Object
   * @param data - The provided data
   * @returns The constructed Dice Pool
   */
  static fromData(data: object): DicePool;

  /* -------------------------------------------- */

  /**
   * Given a string formula, create and return an evaluated DicePool object
   * @param formula - The string formula to parse
   * @param options - Additional options applied to the DicePool
   *                  (default: `{}`)
   * @param data    - A data object which defines data substitutions for Rolls in the DicePool
   *                  (default: `{}`)
   * @returns The evaluated DicePool object or null if the formula is invalid
   */
  static fromExpression(formula: string, options: object, data: object): DicePool | null;

  /* -------------------------------------------- */

  /**
   * Reconstruct a DicePool instance from a provided data Object
   * @param json - The serialized JSON string
   * @returns The constructed Dice Pool
   */
  static fromJSON(json: string): DicePool;

  /* -------------------------------------------- */

  /**
   * Convert the DicePool instance into an Object which can be serialized to JSON
   * @returns The converted data
   */
  toJSON(): object;

  /* -------------------------------------------- */
  /*  Modifiers                                   */
  /* -------------------------------------------- */

  /**
   * Keep a certain number of highest or lowest dice rolls from the result set.
   *
   * \{1d6,1d8,1d10,1d12\}kh2       Keep the 2 best rolls from the pool
   * \{1d12,6\}kl                   Keep the lowest result in the pool
   *
   * @param modifier - The matched modifier query
   */
  keep(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Keep a certain number of highest or lowest dice rolls from the result set.
   *
   * \{1d6,1d8,1d10,1d12\}dl3       Drop the 3 worst results in the pool
   * \{1d12,6\}dh                   Drop the highest result in the pool
   *
   * @param modifier - The matched modifier query
   */
  drop(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Count the number of successful results which occurred in the pool.
   * Successes are counted relative to some target, or relative to the maximum possible value if no target is given.
   * Applying a count-success modifier to the results re-casts all results to 1 (success) or 0 (failure)
   *
   * 20d20cs      Count the number of dice which rolled a 20
   * 20d20cs\>10   Count the number of dice which rolled higher than 10
   * 20d20cs\<10   Count the number of dice which rolled less than 10
   *
   * @param modifier - The matched modifier query
   */
  countSuccess(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Count the number of failed results which occurred in a given result set.
   * Failures are counted relative to some target, or relative to the lowest possible value if no target is given.
   * Applying a count-failures modifier to the results re-casts all results to 1 (failure) or 0 (non-failure)
   *
   * 6d6cf      Count the number of dice which rolled a 1 as failures
   * 6d6cf\<=3   Count the number of dice which rolled less than 3 as failures
   * 6d6cf\>4    Count the number of dice which rolled greater than 4 as failures
   *
   * @param modifier - The matched modifier query
   */
  countFailures(modifier: string): this | null;
}
