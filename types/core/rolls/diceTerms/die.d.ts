/**
 * Define a fair n-sided die term that can be used as part of a Roll formula
 *
 * @example
 * ```typescript
 * // Roll 4 six-sided dice
 * let die = new Die({faces: 6, number: 4}).evaluate();
 * ```
 */
declare class Die extends DiceTerm {
  constructor(termData?: DiceTerm.TermData);

  /* -------------------------------------------- */

  /**
   * @override
   */
  get total(): number | null;

  /* -------------------------------------------- */
  /*  Term Modifiers                              */
  /* -------------------------------------------- */

  /**
   * Re-roll the Die, rolling additional results for any values which fall within a target set.
   * If no target number is specified, re-roll the lowest possible result.
   *
   * 20d20r         reroll all 1s
   * 20d20r1        reroll all 1s
   * 20d20r=1       reroll all 1s
   * 20d20r1=1      reroll a single 1
   *
   * @param modifier - The matched modifier query
   */
  reroll(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Explode the Die, rolling additional results for any values which match the target set.
   * If no target number is specified, explode the highest possible result.
   * Explosion can be a "small explode" using a lower-case x or a "big explode" using an upper-case "X"
   *
   * @param modifier  - The matched modifier query
   * @param recursive - Explode recursively, such that new rolls can also explode?
   *                    (default: `true`)
   */
  explode(modifier: string, { recursive }?: { recursive: boolean }): this | null;

  /* -------------------------------------------- */

  /**
   * @see {@link Die#explode}
   */
  explodeOnce(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Keep a certain number of highest or lowest dice rolls from the result set.
   *
   * 20d20k       Keep the 1 highest die
   * 20d20kh      Keep the 1 highest die
   * 20d20kh10    Keep the 10 highest die
   * 20d20kl      Keep the 1 lowest die
   * 20d20kl10    Keep the 10 lowest die
   *
   * @param modifier - The matched modifier query
   */
  keep(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Drop a certain number of highest or lowest dice rolls from the result set.
   *
   * 20d20d       Drop the 1 lowest die
   * 20d20dh      Drop the 1 highest die
   * 20d20dl      Drop the 1 lowest die
   * 20d20dh10    Drop the 10 highest die
   * 20d20dl10    Drop the 10 lowest die
   *
   * @param modifier - The matched modifier query
   */
  drop(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Count the number of successful results which occurred in a given result set.
   * Successes are counted relative to some target, or relative to the maximum possible value if no target is given.
   * Applying a count-success modifier to the results re-casts all results to 1 (success) or 0 (failure)
   *
   * 20d20cs      Count the number of dice which rolled a 20
   * 20d20cs\>10   Count the number of dice which rolled higher than 10
   * 20d20cs\<10   Count the number of dice which rolled less than 10
   *
   * @param modifier - The matched modifier query
   */
  countSuccess(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Count the number of failed results which occurred in a given result set.
   * Failures are counted relative to some target, or relative to the lowest possible value if no target is given.
   * Applying a count-failures modifier to the results re-casts all results to 1 (failure) or 0 (non-failure)
   *
   * 6d6cf      Count the number of dice which rolled a 1 as failures
   * 6d6cf\<=3   Count the number of dice which rolled less than 3 as failures
   * 6d6cf\>4    Count the number of dice which rolled greater than 4 as failures
   *
   * @param modifier - The matched modifier query
   */
  countFailures(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Deduct the number of failures from the dice result, counting each failure as -1
   * Failures are identified relative to some target, or relative to the lowest possible value if no target is given.
   * Applying a deduct-failures modifier to the results counts all failed results as -1.
   *
   * 6d6df      Subtract the number of dice which rolled a 1 from the non-failed total.
   * 6d6cs\>3df  Subtract the number of dice which rolled a 3 or less from the non-failed count.
   * 6d6cf\<3df  Subtract the number of dice which rolled less than 3 from the non-failed count.
   *
   * @param modifier - The matched modifier query
   */
  deductFailures(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Subtract the value of failed dice from the non-failed total, where each failure counts as its negative value.
   * Failures are identified relative to some target, or relative to the lowest possible value if no target is given.
   * Applying a deduct-failures modifier to the results counts all failed results as -1.
   *
   * 6d6df\<3    Subtract the value of results which rolled less than 3 from the non-failed total.
   *
   * @param modifier - The matched modifier query
   */
  subtractFailures(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * Subtract the total value of the DiceTerm from a target value, treating the difference as the final total.
   * Example: 6d6ms\>12    Roll 6d6 and subtract 12 from the resulting total.
   * @param modifier - The matched modifier query
   */
  marginSuccess(modifier: string): this | null;

  /* -------------------------------------------- */

  /**
   * @deprecated since 0.7.0
   * TODO: Remove in 0.8.x
   * @see {@link Die#results}
   */
  get rolls(): DiceTerm.Result[];

  /* -------------------------------------------- */

  /**
   * @override
   */
  static DENOMINATION: 'd';

  /**
   * @defaultValue
   * @override
   */
  static MODIFIERS: {
    r: 'reroll';
    x: 'explode';
    xo: 'explodeOnce';
    k: 'keep';
    kh: 'keep';
    kl: 'keep';
    d: 'drop';
    dh: 'drop';
    dl: 'drop';
    cs: 'countSuccess';
    cf: 'countFailures';
    df: 'deductFailures';
    sf: 'subtractFailures';
    ms: 'marginSuccess';
  };
}
