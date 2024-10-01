import type { InexactPartial } from "../../../../types/utils.d.mts";
import type RollTerm from "./term.d.mts";

/**
 * A type of RollTerm used to represent strings which have not yet been matched.
 */
declare class StringTerm extends RollTerm {
  constructor({ term, options }: StringTerm.ConstructorData);

  term: StringTerm.ConstructorData["term"];

  /**
   * @defaultValue `["term"]`
   */
  static SERIALIZE_ATTRIBUTES: string[];

  override get expression(): string;

  override get total(): string;

  override get isDeterministic(): boolean;

  evaluate(options?: InexactPartial<RollTerm.EvaluationOptions>): never;
}

declare namespace StringTerm {
  interface ConstructorData {
    term: string;

    options?: RollTerm.Options | undefined;
  }
}

export default StringTerm;
