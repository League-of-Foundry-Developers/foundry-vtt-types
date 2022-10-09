declare global {
  /**
   * A type of RollTerm used to represent strings which have not yet been matched.
   */
  class StringTerm extends RollTerm {
    constructor({ term, options }: StringTermConstructorData);

    term: StringTermConstructorData["term"];

    /**
     * @defaultValue `["term"]`
     */
    static SERIALIZE_ATTRIBUTES: string[];

    get expression(): string;

    get total(): string;

    override get isDeterministic(): boolean;

    evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): never;
  }
}

interface StringTermConstructorData {
  term: string;

  options?: RollTerm.Options;
}

export {};
