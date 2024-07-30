import type { InexactPartial } from "../../../../types/utils.d.mts";

import type DiceTerm from "./dice.d.mts";
import type Die from "./die.d.mts";

/**
 * A type of DiceTerm used to represent a three-sided Fate/Fudge die.
 * Mathematically behaves like 1d3-2
 */
declare class FateDie extends DiceTerm {
  constructor(termData?: InexactPartial<FateDie.TermData>);

  _faces: 3;

  /**
   * @defaultValue `"f"`
   */
  static DENOMINATION: string;

  static override MODIFIERS: FateDie.Modifiers;

  override roll({
    minimize,
    maximize,
    ...options
  }?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<DiceTerm.Result>;

  override mapRandomFace(randomUniform: number): number;

  override getResultLabel(result: DiceTerm.Result): string;
}

declare namespace FateDie {
  interface TermData extends DiceTerm.TermData {
    modifiers: Array<keyof (typeof FateDie)["MODIFIERS"]>;
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

export default FateDie;
