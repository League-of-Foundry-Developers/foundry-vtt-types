declare class OperatorTerm extends RollTerm {
  constructor(termData?: Partial<OperatorTerm.TermData>);

  operator: OperatorTerm.TermData['operator'];
}

declare namespace OperatorTerm {
  interface TermData {
    operator: string;
    options?: RollTerm.Options;
  }
}
