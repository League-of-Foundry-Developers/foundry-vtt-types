/**
 * A type of DiceTerm used to represent a three-sided Fate/Fudge die.
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  constructor(termData?: Partial<DiceTerm.TermData>);

  faces: 3;

  /**
   * @defaultValue `'f'`
   */
  static DENOMINATION: string;

  /**
   * @override
   */
  roll({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): DiceTerm.Result;

  /**
   * @override
   */
  getResultLabel(result: DiceTerm.Result): string;
}
