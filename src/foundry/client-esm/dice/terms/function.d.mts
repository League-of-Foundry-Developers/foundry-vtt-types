import type { InexactPartial, FixedInstanceType } from "#utils";
import type { FunctionRollParseNode } from "../_types.d.mts";

import type RollTerm from "./term.d.mts";
import type DiceTerm from "./dice.d.mts";

/**
 * A type of RollTerm used to apply a function.
 */
declare class FunctionTerm extends RollTerm {
  constructor(termData: FunctionTerm.TermData);

  /** The name of the configured function, or one in the Math environment, which should be applied to the term. */
  fn: string;

  /** An array of string argument terms for the function. */
  terms: string[];

  /** The cached Roll instances for each function argument. */
  rolls: Roll[];

  /** The cached result of evaluating the method arguments. */
  result: string | number | undefined; // note: it will be undefined if the function has not yet been evaluated

  /** Is this term intermediate, and should be evaluated first as part of the simplification process? */
  override isIntermediate: true;

  static override SERIALIZE_ATTRIBUTES: ["fn", "terms", "rolls", "result"];

  /* -------------------------------------------- */
  /*  Function Term Attributes                    */
  /* -------------------------------------------- */

  /** An array of evaluated DiceTerm instances that should be bubbled up to the parent Roll. */
  get dice(): DiceTerm[];

  override get total(): string | number;

  override get expression(): string;

  get function(): CONFIG.Dice.RollFunction; // TODO: Implement this

  override get isDeterministic(): boolean;

  /* -------------------------------------------- */
  /*  Math Term Methods                           */
  /* -------------------------------------------- */
  protected override _evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): this | Promise<this>;

  /**
   * Evaluate this function when it contains any non-deterministic sub-terms.
   * @param options - Options forwarded to inner Roll evaluation. (Default: `{}`)
   */
  protected _evaluateASync(options?: InexactPartial<RollTerm.EvaluationOptions>): Promise<this>;

  /**
   * Evaluate deterministic values of this term synchronously.
   * @param options - Options forwarded to inner Roll evaluation. (Default: `{}`)
   */
  protected _evaluateSync(options?: InexactPartial<DiceTerm.EvaluationOptions>): this;

  /**
   * Parse a function argument from its evaluated Roll instance.
   * @param roll - The evaluated Roll instance that wraps the argument.
   */
  #parseArgument(roll: Roll): string | number;

  /* -------------------------------------------- */
  /*  Saving and Loading                          */
  /* -------------------------------------------- */
  protected static override _fromData<T extends RollTerm.AnyConstructor>(
    this: T,
    data: Record<string, unknown>,
  ): FixedInstanceType<T>;

  override toJSON(): Record<string, unknown>;

  static override fromParseNode(node: FunctionRollParseNode): RollTerm;
}

declare namespace FunctionTerm {
  interface Data extends TermData {
    fn: string;
    class: string | undefined;
    evaluated: boolean;
  }

  interface TermData {
    /** The name of the configured function, or one in the Math environment, which should be applied to the term. */
    fn: string;

    /** An array of string argument terms for the function. */
    terms?: string[] | undefined;

    /** The cached Roll instances for each function argument. */
    rolls?: Roll[] | undefined;

    /** The cached result of evaluating the method arguments. */
    result?: string | number | undefined;
    options?: InexactPartial<FunctionTerm.Options>;
  }

  interface Options extends RollTerm.Options {}
}

export default FunctionTerm;
