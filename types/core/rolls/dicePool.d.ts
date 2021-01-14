/**
 * A dice pool represents a set of Roll expressions which are collectively modified to compute an effective total
 * across all Rolls in the pool. The final total for the pool is defined as the sum over kept rolls, relative to any
 * success count or margin.
 * @example
 * ```javascript
 * // Consider 3 rolls
 * let r1 = new Roll("4d6");
 * let r2 = new Roll("3d8");
 * let r3 = new Roll("2d10");
 * // Keep the highest of the 3 roll expressions
 * let pool = new DicePool([r1,r2,r3], "kh");
 * ```
 * @example
 * ```javascript
 * // Construct a DicePool from a string formula
 * let pool = DicePool.fromFormula("{4d6,3d8,2d10}kh");
 * ```
 */
declare class DicePool {
  /**
   * The string modifiers applied to resolve the pool
   */
  modifiers: string[]

  /**
   * An object of additional options which modify the pool
   */
  options: object

  results: object[]

  /**
   * The elements of a Dice Pool must be Roll objects
   */
  rolls: Roll[]

  constructor (options: {
    modifiers?: string[]
    options?: object
    rolls: Roll[]
  })

  /**
   * Return a standardized representation for the displayed formula associated with this DicePool.
   */
  get formula (): string

  /**
   * Return an array of rolled values which are still active within the DicePool
   */
  get values (): number[]

  /**
   * Reconstruct a DicePool instance from a provided data Object
   * @param data - The provided data
   * @returns The constructed Dice Pool
   */
  static fromData (data: any): DicePool

  /**
   * Given a string formula, create and return an evaluated DicePool object
   * @param formula - The string formula to parse
   * @param options - Additional options applied to the DicePool
   * @param data - A data object which defines data substitutions for Rolls in the DicePool
   *
   * @returns The evaluated DicePool object or null if the formula is invalid
   */
  static fromExpression (
    formula: string,
    options?: object,
    data?: object
  ): DicePool | null

  /**
   * Reconstruct a DicePool instance from a provided data Object
   * @param json - The serialized JSON string
   * @returns The constructed Dice Pool
   */
  static fromJSON (json: string): DicePool

  /**
   * For now, for testing purposes, choose the maximum result always
   */
  roll (): DicePool

  /**
   * Convert the DicePool instance into an Object which can be serialized to JSON
   * @returns The converted data
   */
  toJSON (): {
    class: string
    modifiers: string
    rolls: Roll[]
    total: number
  }

  /**
   * Iterate over the results Array and count successes or compute margin of success
   * @param results -
   * @param mod -
   */
  protected _countSuccess (results: any[], mod: string): void

  /**
   * Iterate over the results Array and apply a keep-or-drop modifier
   * @param results -
   * @param mod -
   */
  protected _keepOrDrop (results: any[], mod: string): void

  /**
   * Parse a modifier query string into an ordered Array of modifiers to apply.
   * @param modifiers -
   */
  protected _parseModifiers (modifiers: string): string[]
}
