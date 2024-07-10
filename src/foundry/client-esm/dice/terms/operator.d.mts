import type RollTerm from "./term.mts";

/**
 * A type of RollTerm used to denote and perform an arithmetic operation.
 */
declare class OperatorTerm extends RollTerm {
  constructor({ operator, options }?: Partial<OperatorTerm.TermData>);

  /** The term's operator value. */
  operator: OperatorTerm.TermData["operator"];

  /** An object of operators with their precedence values. */
  static PRECEDENCE: {
    "+": 10;
    "-": 10;
    "*": 20;
    "/": 20;
    "%": 20;
  };

  /** An array of operators which represent arithmetic operations. */
  static OPERATORS: ["+", "-", "*", "/", "%"]; // TODO: Rely on PRECEDENCE

  static override REGEXP: RegExp;

  /**
   * An array of additional attributes which should be retained when the term is serialized.
   * @defaultValue `["operator"]`
   */
  static override SERIALIZE_ATTRIBUTES: string[];

  /**
   * Optional flavor text which modifies and describes this term.
   * @remarks Operator terms cannot have flavor text
   */
  override get flavor(): "";

  override get expression(): string;

  override get total(): string;
}

declare namespace OperatorTerm {
  interface TermData {
    operator: string;
    options?: RollTerm.Options;
  }
}

export default OperatorTerm;
