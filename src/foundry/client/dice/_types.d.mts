import type { parser as PeggyParser } from "peggy";
import type RollParser from "./parser.d.mts";
import type RollTerm from "./terms/term.d.mts";

export interface RollParseOffset {
  /** The start position of the matched term in the formula string. */
  start: number;

  /** The end position of the matched term in the formula string. */
  end: number;
}

export interface RollParseNode {
  /** The class name for this node. */
  class: string;

  /**
   * The original matched text for this node.
   *
   * @remarks Absent from string terms and from the nodes `RollParser.toAST` synthesizes.
   * @privateRemarks Redeclared as required on the concrete nodes that always carry it.
   */
  formula?: string | undefined;

  /**
   * The position of the matched term in the formula string.
   *
   * @remarks Absent from expression tree and synthesized operator nodes.
   */
  offset?: RollParseOffset | undefined;
}

export interface RollParseTreeNode extends RollParseNode {
  /** The binary operator. */
  operator: string;

  /** The two operands. */
  operands: [RollParseNode, RollParseNode];
}

export interface FlavorRollParseNode extends RollParseNode {
  /** The position of the matched term in the formula string. */
  offset: RollParseOffset;

  options: {
    /** Flavor text associated with the node. */
    flavor: string | null;
  };
}

export interface ModifiersRollParseNode extends FlavorRollParseNode {
  /** The matched modifiers string. */
  modifiers: string;
}

export interface NumericRollParseNode extends FlavorRollParseNode {
  /** The original matched text for this node. */
  formula: string;

  /** The number. */
  number: number;
}

export interface FunctionRollParseNode extends FlavorRollParseNode {
  /** The original matched text for this node. */
  formula: string;

  /** The function name. */
  fn: string;

  /** The arguments to the function. */
  terms: RollParseNode[];
}

export interface PoolRollParseNode extends ModifiersRollParseNode {
  /** The original matched text for this node. */
  formula: string;

  /** The pool terms. */
  terms: RollParseNode[];
}

export interface ParentheticalRollParseNode extends FlavorRollParseNode {
  /** The original matched text for this node. */
  formula: string;

  /** The inner parenthetical term. */
  term: RollParseNode;
}

export interface StringParseNode extends FlavorRollParseNode {
  /** The unclassified string term. */
  term: string;
}

export interface DiceRollParseNode extends ModifiersRollParseNode {
  /** The original matched text for this node. */
  formula: string;

  /**
   * The number of dice.
   *
   * @remarks `null` when the number of dice is omitted.
   * @privateRemarks Foundry's typedef omits `null`.
   */
  number: number | ParentheticalRollParseNode | null;

  /** The number of faces or a string denomination like "c" or "f" */
  faces: string | number | ParentheticalRollParseNode;
}

export type RollParseArg = null | number | string | RollParseNode | RollParseArg[];

/**
 * The compiled Peggy grammar used to parse roll formulae.
 * @remarks Foundry compiles `grammar.pegjs` into its bundle and exposes it as {@linkcode foundry.dice.RollGrammar}.
 */
export interface RollGrammar {
  StartRules: "Expression"[];
  SyntaxError: typeof PeggyParser.SyntaxError;
  parse(formula: string, options?: RollGrammarParseOptions): RollParseNode | RollTerm.Data;
}

export interface RollGrammarParseOptions {
  /** @remarks Identifies the formula in parser error locations. */
  grammarSource?: string | { toString(): string } | undefined;

  startRule?: "Expression" | undefined;

  /**
   * @defaultValue `CONFIG.Dice.parser`
   * @remarks The parser class whose callbacks the grammar's actions delegate to.
   */
  parser?: RollParser.AnyConstructor | undefined;
}
