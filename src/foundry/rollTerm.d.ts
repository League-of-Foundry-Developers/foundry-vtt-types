/**
 * An abstract class which represents a single token that can be used as part of a Roll formula.
 * Every portion of a Roll formula is parsed into a subclass of RollTerm in order for the Roll to be fully evaluated.
 */
declare abstract class RollTerm {
  /** A regular expression which identifies term-level flavor text */
  static FLAVOR_REGEXP: RegExp;

  /** A regular expression pattern which identifies optional term-level flavor text */
  static FLAVOR_REGEXP_STRING: string;

  /** A regular expression used to match a term of this type */
  static REGEXP: RegExp;

  /** An array of additional attributes which should be retained when the term is serialized */
  static SERIALIZE_ATTRIBUTES: string[];

  /**
   * Construct a RollTerm from a provided data object
   * @param data - Provided data from an un-serialized term
   * @returns The constructed RollTerm
   */
  static fromData(data: object): RollTerm;

  /**
   * Reconstruct a RollTerm instance from a provided JSON string
   * @param json - A serialized JSON representation of a DiceTerm
   * @returns A reconstructed RollTerm from the provided JSON
   */
  static fromJSON(json: string): RollTerm;

  /**
   * * Define term-specific logic for how a de-serialized data object is restored as a functional RollTerm
   * @param data - The de-serialized term data
   * @returns The re-constructed RollTerm object
   */
  protected static _fromData(data: object): RollTerm;

  constructor({ options }?: { options?: RollTerm.Options });

  /**
   * Is this term intermediate, and should be evaluated first as part of the simplification process?
   * @defaultValue `false`
   */
  isIntermediate: boolean;

  /** An object of additional options which describes and modifies the term. */
  options: RollTerm.Options;

  /** An internal flag for whether the term has been evaluated */
  protected _evaluated: boolean;

  /** A string representation of the formula expression for this RollTerm, prior to evaluation */
  get expression(): string;

  /** A string representation of the formula, including optional flavor text. */
  get formula(): string;

  /** A string or numeric representation of the final output for this term, after evaluation. */
  get total(): number | string | null;

  /** Optional flavor text which modifies and describes this term. */
  get flavor(): string;

  _evaluate({ minimize, maximize }?: { minimize?: boolean; maximize?: boolean }): Promise<this>;

  _evaluateSync({ minimize, maximize }?: { minimize?: boolean; maximize?: boolean }): this;

  /**
   * Evaluate the roll term, populating the results Array.
   * @param options - (default: `{}`)
   * @param minimize - Apply the minimum possible result for each roll.
   *                   (default: `false`)
   * @param maximize - Apply the maximum possible result for each roll.
   *                   (default: `false`)
   * @param async    - Evaluate the term asynchronously, receiving a Promise as the returned value. This will become the default behavior in version 10.x
   *                   (default: `false`)
   * @returns The evaluated dice term
   */
  evaluate({ minimize, maximize, async }?: Partial<RollTerm.EvaluationOptions>): this;

  /* -------------------------------------------- */
  /*  Serialization and Loading                   */
  /* -------------------------------------------- */

  /**
   * Serialize the RollTerm to a JSON string which allows it to be saved in the database or embedded in text.
   * This method should return an object suitable for passing to the JSON.stringify function.
   */
  toJSON(): object;
}

declare namespace RollTerm {
  interface Options {
    flavor?: string;
  }

  interface EvaluationOptions {
    /**
     * Evaluate the roll asynchronously, receiving a Promise as the returned value.
     * This will become the default behavior in version 10.x
     */
    async: boolean;
    /** Produce the minimum possible result from the Roll instead of a random result. */
    maximize: boolean;
    /** Minimize the result, obtaining the smallest possible value */
    minimize: boolean;
  }

  interface Data {
    class: string;
    evaluated: boolean;
    options: Options;
  }
}
