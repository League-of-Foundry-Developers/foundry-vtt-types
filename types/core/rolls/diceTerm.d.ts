/**
 * An abstract base class for any term which appears in a dice roll formula
 * @param termData - Data used to create the Dice Term, including the following:
 * @param number - The number of dice of this term to roll, before modifiers are applied
 * @param faces - The number of faces on each die of this type
 * @param modifiers - An array of modifiers applied to the results
 * @param options - Additional options that modify the term
 */
declare abstract class DiceTerm {
  /**
   * Define the denomination string used to register this Dice type in CONFIG.Dice.terms
   */
  static DENOMINATION: string

  /**
   * The number of faces on the die
   */
  faces: number

  /**
   * An Array of dice term modifiers which are applied
   */
  modifiers: string[]

  /**
   * The number of dice of this term to roll, before modifiers are applied
   */
  number: number

  /**
   * An object of additional options which modify the dice term
   */
  options: object

  /**
   * The array of dice term results which have been rolled
   */
  results: object[]

  constructor (termData?: {
    faces?: number
    modifiers?: string[]
    number?: number
    options?: object
  });

  /**
   * Return a standardized representation for the displayed formula associated with this DiceTerm
   */
  get formula (): string;

  /**
   * Return the total result of the DiceTerm if it has been evaluated
   */
  get total (): number;

  /**
   * Return an array of rolled values which are still active within this term
   */
  get values (): number[];

  /**
   * Reconstruct a DiceTerm instance from a provided JSON string
   * @param json - A serialized JSON representation of a DiceTerm
   * @returns A reconstructed DiceTerm from the provided JSON
   */
  static fromJSON (json: string): DiceTerm;

  /**
   * Return a string used as the label for each rolled result
   */
  static getResultLabel (result: string): string;

  /**
   * Alter the DiceTerm by adding or multiplying the number of dice which are rolled
   * @param multiply - A factor to multiply. Dice are multiplied before any additions.
   * @param add - A number of dice to add. Dice are added after multiplication.
   * @returns The altered term
   */
  alter (multiply: number, add: number): DiceTerm;

  /**
   * Roll the DiceTerm by mapping a random uniform draw against the faces of the dice term.
   * @param minimize - Apply the minimum possible result instead of a random result.
   * @param maximize - Apply the maximum possible result instead of a random result.
   */
  roll (options?: {
    maximize: boolean
    minimize: boolean
  }): object;

  /**
   * Serialize the DiceTerm to a JSON string which allows it to be saved in the database or embedded in text.
   * This method should return an object suitable for passing to the JSON.stringify function.
   */
  toJSON (): object;
}
