declare global {
  /**
   * A type of RollTerm used to apply a function from the Math library.
   */
  class MathTerm extends RollTerm {
    constructor({ fn, terms, options }: MathTermData);

    /**
     * The named function in the Math environment which should be applied to the term
     */
    fn: MathTermData["fn"];

    /** An array of string argument terms for the function */
    terms: NonNullable<MathTermData["terms"]>;

    /**
     * The cached Roll instances for each function argument
     * @defaultValue `[]`
     */
    rolls: Roll[];

    /**
     * The cached result of evaluating the method arguments
     * @defaultValue `undefined`
     */
    result?: number;

    /**
     * @defaultValue `true`
     */
    isIntermediate: boolean;

    /**
     * @defaultValue `["fn", "terms"]`
     */
    static SERIALIZE_ATTRIBUTES: string[];

    /**
     * An array of evaluated DiceTerm instances that should be bubbled up to the parent Roll
     */
    get dice(): DiceTerm[] | undefined;

    get total(): number | undefined;

    get expression(): string;

    override get isDeterministic(): boolean;

    protected _evaluateSync({ minimize, maximize }?: { minimize?: boolean; maximize?: boolean }): this;

    protected _evaluate({ minimize, maximize }?: { minimize?: boolean; maximize?: boolean }): Promise<this>;
  }
}

interface MathTermData {
  fn: string;

  /**
   * @defaultValue `[]`
   */
  terms?: string[];

  /**
   * @defaultValue `{}`
   */
  options?: RollTerm.Options;
}

export {};
