import type { InexactPartial } from "fvtt-types/utils";
import type DiceTerm from "./dice.d.mts";

/**
 * A type of DiceTerm used to represent flipping a two-sided coin.
 */
declare class Coin extends DiceTerm {
  constructor(termData?: InexactPartial<Coin.TermData>);

  _faces: 2;

  /**
   * @defaultValue `c`
   */
  static DENOMINATION: string;

  /**
   * @defaultValue
   * ```typescript
   *  {
   *    c: "call"
   *  }
   * ```
   */
  static MODIFIERS: Coin.Modifiers;

  override roll({
    minimize,
    maximize,
    ...options
  }?: InexactPartial<DiceTerm.EvaluationOptions>): Promise<DiceTerm.Result>;

  override getResultLabel(result: DiceTerm.Result): string;

  override getResultCSS(result: DiceTerm.Result): (string | null)[];

  override mapRandomFace(randomUniform: number): number;

  /* -------------------------------------------- */
  /*  Term Modifiers                              */
  /* -------------------------------------------- */

  /**
   * Call the result of the coin flip, marking any coins that matched the called target as a success
   *
   * 3dcc1      Flip 3 coins and treat "heads" as successes
   * 2dcc0      Flip 2 coins and treat "tails" as successes
   *
   * @param modifier - The matched modifier query
   */
  call(modifier: string): void;
}

declare namespace Coin {
  type Any = AnyCoin;
  type AnyConstructor = typeof AnyCoin;

  interface TermData extends DiceTerm.TermData {
    modifiers: Array<keyof Modifiers>;
  }

  interface Modifiers {
    c: "call";
  }
}

declare abstract class AnyCoin extends Coin {
  constructor(arg0: never, ...args: never[]);
}

export default Coin;
