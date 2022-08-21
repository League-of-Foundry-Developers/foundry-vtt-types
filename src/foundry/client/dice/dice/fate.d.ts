/**
 * A type of DiceTerm used to represent a three-sided Fate/Fudge die.
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  constructor(termData?: Partial<FateDie.TermData>);

  faces: 3;

  /**
   * @defaultValue `"f"`
   */
  static DENOMINATION: string;

  static override MODIFIERS: FateDie.Modifiers;

  override roll({ minimize, maximize }?: { minimize: boolean; maximize: boolean }): DiceTerm.Result;

  override getResultLabel(result: DiceTerm.Result): string;
}

declare namespace FateDie {
  interface TermData extends DiceTerm.TermData {
    modifiers: Array<keyof typeof FateDie["MODIFIERS"]>;
  }

  interface Modifiers {
    r: Die["reroll"];
    rr: Die["rerollRecursive"];
    k: Die["keep"];
    kh: Die["keep"];
    kl: Die["keep"];
    d: Die["drop"];
    dh: Die["drop"];
    dl: Die["drop"];
  }
}
