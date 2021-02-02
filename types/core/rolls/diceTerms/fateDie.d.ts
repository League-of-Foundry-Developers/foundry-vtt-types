/**
 * Define a three-sided Fate/Fudge dice term that can be used as part of a Roll formula
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  constructor(termData?: DiceTerm.TermData);

  faces: 3;

  /* -------------------------------------------- */

  /**
   * @override
   */
  roll(options?: { maximize: boolean; minimize: boolean }): DiceTerm.Result;

  /* -------------------------------------------- */

  /**
   * @override
   */
  static getResultLabel(result: string): string;

  /* -------------------------------------------- */

  static DENOMINATION: 'f';

  static fromResults(options: Partial<DiceTerm.TermData>, results: DiceTerm.Result[]): FateDie;
}

declare namespace FateDie {
  interface Data extends DiceTerm.Data {
    class: 'FateDie';
  }

  interface OldData extends DiceTerm.OldData {
    class: 'FateDie';
  }
}
