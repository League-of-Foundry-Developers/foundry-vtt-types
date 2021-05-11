/**
 * Define a three-sided Fate/Fudge dice term that can be used as part of a Roll formula
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  constructor(termData?: Partial<DiceTerm.TermData>);

  faces: 3;

  /* -------------------------------------------- */

  static DENOMINATION: 'f';
}

declare namespace FateDie {
  interface Data extends DiceTerm.Data {
    class: 'FateDie';
  }
}
