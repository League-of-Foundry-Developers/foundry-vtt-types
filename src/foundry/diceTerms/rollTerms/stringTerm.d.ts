/**
 * A type of RollTerm used to capture residual strings which have not yet been matched
 */
declare class StringTerm extends RollTerm {
  constructor(termData?: StringTerm.TermData);
}

declare namespace StringTerm {
  interface TermData {
    term: string;
    options: RollTerm.Options;
  }
}
