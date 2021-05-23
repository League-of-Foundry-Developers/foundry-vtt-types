/**
 * Define a three-sided Fate/Fudge dice term that can be used as part of a Roll formula
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  static DENOMINATION: 'f';

  static fromResults(options: Partial<DiceTerm.TermData>, results: DiceTerm.Result[]): FateDie;

  /**
   * @override
   */
  static getResultLabel(result: string): string;

  constructor(termData?: Partial<DiceTerm.TermData>);

  faces: 3;

  /**
   * @override
   */
  roll(options?: { maximize: boolean; minimize: boolean }): DiceTerm.Result;
}

declare namespace FateDie {
  interface Data extends DiceTerm.Data {
    class: 'FateDie';
  }

  interface OldData extends DiceTerm.OldData {
    class: 'FateDie';
  }
}
