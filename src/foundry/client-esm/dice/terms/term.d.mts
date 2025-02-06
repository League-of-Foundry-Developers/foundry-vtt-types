import type { InexactPartial, FixedInstanceType } from "fvtt-types/utils";
import type { RollParseNode } from "../_types.mts";

import type RollResolver from "../../applications/dice/roll-resolver.d.mts";

declare abstract class RollTerm {
  constructor({ options }?: InexactPartial<{ options: RollTerm.Options }>);

  /** An object of additional options which describes and modifies the term. */
  options: RollTerm.Options;

  /** An internal flag for whether the term has been evaluated. */
  protected _evaluated: boolean;

  /** A reference to the Roll at the root of the evaluation tree. */
  protected _root: Roll;

  /**
   * Is this term intermediate, and should be evaluated first as part of the simplification process?
   * @defaultValue `false`
   */
  isIntermediate: boolean;

  /**
   * A regular expression pattern which identifies optional term-level flavor text
   * @defaultValue `(?:\\[([^\\]]+)\\])`
   */
  static FLAVOR_REGEXP_STRING: string;

  /**
   * A regular expression which identifies term-level flavor text
   * @defaultValue `new RegExp(RollTerm.FLAVOR_REGEXP_STRING, "G")`
   */
  static FLAVOR_REGEXP: RegExp;

  /**
   * A regular expression used to match a term of this type
   * @defaultValue `undefined`
   */
  static REGEXP: RegExp;

  /* -------------------------------------------- */
  /*  RollTerm Attributes                         */
  /* -------------------------------------------- */

  /** An array of additional attributes which should be retained when the term is serialized */
  static SERIALIZE_ATTRIBUTES: string[];

  /** A string representation of the formula expression for this RollTerm, prior to evaluation */
  get expression(): string;

  /** A string representation of the formula, including optional flavor text. */
  get formula(): string;

  /** A string or numeric representation of the final output for this term, after evaluation. */
  get total(): number | string | null | undefined;

  /** Optional flavor text which modifies and describes this term. */
  get flavor(): string;

  /** Whether this term is entirely deterministic or contains some randomness. */
  get isDeterministic(): boolean;

  /** A reference to the RollResolver app being used to externally resolve this term. */
  get resolver(): RollResolver; // TODO: Implement this

  /* -------------------------------------------- */
  /*  RollTerm Methods                            */
  /* -------------------------------------------- */

  /**
   * Evaluate the term, processing its inputs and finalizing its total.
   * @param options - (default: `{}`)
   * @returns A Promise if the term is non-deterministic.
   */
  evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): this | Promise<this>;

  /**
   * Evaluate the term.
   * @param options - (default: `{}`)
   * @returns A Promise if the term is non-deterministic.
   */
  protected _evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): this | Promise<this>;

  /**
   * Determine if evaluating a given RollTerm with certain evaluation options can be done so deterministically.
   */
  static isDeterministic(
    term: RollTerm,
    { minimize, maximize }?: InexactPartial<{ minimize: boolean; maximize: boolean }>,
  ): boolean;

  /* -------------------------------------------- */
  /*  Serialization and Loading                   */
  /* -------------------------------------------- */

  /**
   * Construct a RollTerm from a provided data object
   * @param data - Provided data from an un-serialized term
   * @returns The constructed RollTerm
   */
  static fromData(data: Record<string, unknown>): RollTerm;

  /** Construct a RollTerm from parser information. */
  static fromParseNode(node: RollParseNode): RollTerm;

  /**
   * * Define term-specific logic for how a de-serialized data object is restored as a functional RollTerm
   * @param data - The de-serialized term data
   * @returns The re-constructed RollTerm object
   */
  protected static _fromData<T extends RollTerm.AnyConstructor>(
    this: T,
    data: Record<string, unknown>,
  ): FixedInstanceType<T>;

  /**
   * Reconstruct a RollTerm instance from a provided JSON string
   * @param json - A serialized JSON representation of a DiceTerm
   * @returns A reconstructed RollTerm from the provided JSON
   */
  static fromJSON(json: string): RollTerm;

  /**
   * Serialize the RollTerm to a JSON string which allows it to be saved in the database or embedded in text.
   * This method should return an object suitable for passing to the JSON.stringify function.
   */
  toJSON(): Record<string, unknown>;
}

declare namespace RollTerm {
  type AnyConstructor = typeof AnyRollTerm;

  interface Options {
    flavor?: string;
  }

  interface EvaluationOptions {
    /**
     * Maximize the result, obtaining the largest possible value.
     * @defaultValue `false`
     * */
    maximize: boolean;

    /**
     * Minimize the result, obtaining the smallest possible value
     * @defaultValue `false`
     */
    minimize: boolean;

    /**
     * If true, string terms will not throw an error when evaluated.
     * @defaultValue `false`
     */
    allowStrings: boolean;
  }

  interface Data {
    class: string;
    evaluated: boolean;
    options: Options;
  }
}

declare abstract class AnyRollTerm extends RollTerm {
  constructor(arg0: never, ...args: never[]);
}

export default RollTerm;
