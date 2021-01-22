/**
 * Define a three-sided Fate/Fudge dice term that can be used as part of a Roll
 * formula
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  static DENOMINATION: 'f'

  constructor (termData?: DiceTerm.TermData)

  /**
   * @override
   */
  static getResultLabel (result: string): string

  /**
   * @override
   */
  roll (options?: { maximize: boolean, minimize: boolean }): DiceTerm.Result
}
