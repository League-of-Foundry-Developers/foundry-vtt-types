/**
 * Define a two-sided coin term that can be used as part of a Roll formula
 */
declare class Coin extends DiceTerm {
  /** @defaultValue `c` */
  static DENOMINATION: string;

  static MODIFIERS: typeof DiceTerm.MODIFIERS & {
    c: 'call';
  };

  static fromResults(options: Partial<Coin.TermData>, results: DiceTerm.Result[]): Coin;

  constructor(termData?: Partial<Coin.TermData>);

  faces: 2;

  /**
   * Call the result of the coin flip, marking any coins that matched the called target as a success
   *
   * 3dcc1      Flip 3 coins and treat "heads" as successes
   * 2dcc0      Flip 2 coins and treat "tails" as successes
   *
   * @param modifier - The matched modifier query
   */
  call(modifier: string): string;

  /**
   * @override
   */
  roll(options?: { maximize: boolean; minimize: boolean }): DiceTerm.Result;
}

declare namespace Coin {
  interface Data extends Partial<TermData> {
    class: 'Coin';
    results: DiceTerm.Result[];
  }

  interface TermData extends DiceTerm.TermData {
    modifiers: Array<keyof typeof Coin['MODIFIERS']>;
  }
}
