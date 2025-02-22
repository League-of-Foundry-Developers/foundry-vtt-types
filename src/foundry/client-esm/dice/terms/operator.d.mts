import type { InexactPartial } from "fvtt-types/utils";

import type RollTerm from "./term.d.mts";

/**
 * A type of RollTerm used to denote and perform an arithmetic operation.
 */
declare class OperatorTerm extends RollTerm {
  constructor(termData: OperatorTerm.TermData);

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

  /**
   * An array of operators which represent arithmetic operations.
   * @defaultValue `["+", "-", "*", "/", "%"]`
   */
  static OPERATORS: string[];

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
  override get flavor(): string;

  override get expression(): string;

  override get total(): string;
}

declare namespace OperatorTerm {
  interface TermData {
    operator: string;
    options?: InexactPartial<RollTerm.Options>;
  }
}

export default OperatorTerm;
