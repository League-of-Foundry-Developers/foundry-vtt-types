export interface RollParseNode {
  /** The class name for this node. */
  class: string;

  /** The original matched text for this node. */
  formula: string;
}

export interface RollParseTreeNode {
  /** The binary operator. */
  operator: string;

  /** The two operands. */
  operands: [RollParseNode, RollParseNode];
}

export interface FlavorRollParseNode extends RollParseNode {
  options: {
    /** Flavor text associated with the node. */
    flavour: string;
  };
}

export interface ModifiersRollParseNode extends FlavorRollParseNode {
  /** The matched modifiers string. */
  modifiers: string;
}

export interface NumericRollParseNode extends FlavorRollParseNode {
  /** The number. */
  number: number;
}

export interface FunctionRollParseNode extends FlavorRollParseNode {
  /** The function name. */
  fn: string;

  /** The arguments to the function. */
  terms: RollParseNode[];
}

export interface PoolRollParseNode extends ModifiersRollParseNode {
  /** The pool terms. */
  terms: RollParseNode[];
}

export interface ParentheticalRollParseNode extends FlavorRollParseNode {
  /** The inner parenthetical term. */
  term: string;
}

export interface StringParseNode extends FlavorRollParseNode {
  /** The unclassified string term. */
  term: string;
}

export interface DiceRollParseNode extends ModifiersRollParseNode {
  /** The number of dice. */
  number: number | ParentheticalRollParseNode;

  /** The number of faces or a string denomination like "c" or "f" */
  faces: string | number | ParentheticalRollParseNode;
}

export type RollParseArg = null | number | string | RollParseNode | RollParseArg[];
