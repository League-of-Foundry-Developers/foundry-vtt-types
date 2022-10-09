/**
 * A type of RollTerm used to denote and perform an arithmetic operation.
 */
declare class OperatorTerm extends RollTerm {
  constructor({ operator, options }?: Partial<OperatorTerm.TermData>);

  operator: OperatorTerm.TermData["operator"];

  /** An array of operators which represent arithmetic operations */
  static OPERATORS: ["+", "-", "*", "/", "%"];
}

declare namespace OperatorTerm {
  interface TermData {
    operator: string;
    options?: RollTerm.Options;
  }
}
