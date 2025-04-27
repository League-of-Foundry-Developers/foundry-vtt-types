import type { Identity } from "fvtt-types/utils";
import type {
  DiceRollParseNode,
  FunctionRollParseNode,
  NumericRollParseNode,
  ParentheticalRollParseNode,
  PoolRollParseNode,
  RollParseArg,
  RollParseNode,
  StringParseNode,
} from "./_types.d.mts";

import type RollTerm from "./terms/term.d.mts";

/**
 * A class for transforming events from the Peggy grammar lexer into various formats.
 */
declare class RollParser {
  /**
   * @param formula - The full formula
   */
  constructor(formula: string);

  /** The full formula */
  formula: string;

  /* -------------------------------------------- */
  /*  Parse Events                                */
  /* -------------------------------------------- */

  /**
   * Handle a base roll expression.
   * @param head - The first operand.
   * @param tail - Zero or more subsequent (operators, operand) tuples.
   * @param leading - A leading operator.
   * @param formula - The original matched text.
   * @param error - The peggy error callback to invoke on a parse error.
   * @internal
   */
  protected _onExpression(
    head: RollParseNode,
    tail: [string[], RollParseNode][],
    leading: string,
    formula: string,
    error: (error: string) => void,
  ): RollParseNode;

  /**
   * Handle a dice term.
   * @param number - The number of dice.
   * @param faces - The number of die faces or a string denomination like "c" or "f".
   * @param modifiers - The matched modifiers string.
   * @param flavor - Associated flavor text.
   * @param formula - The original matched text.
   * @returns
   * @internal
   */
  protected _onDiceTerm(
    number: NumericRollParseNode | ParentheticalRollParseNode | null,
    faces: string | NumericRollParseNode | ParentheticalRollParseNode | null,
    modifiers: string | null,
    flavor: string | null,
    formula: string,
  ): DiceRollParseNode;

  /**
   * Handle a numeric term.
   * @param number - The number.
   * @param flavor - Associated flavor text.
   * @internal
   */
  protected _onNumericTerm(number: number, flavor: string): NumericRollParseNode;

  /**
   * Handle a math term.
   * @param fn - The Math function.
   * @param head - The first term.
   * @param tail - Zero or more additional terms.
   * @param flavor - Associated flavor text.
   * @param formula - The original matched text.
   * @internal
   */
  protected _onFunctionTerm(
    fn: string,
    head: RollParseNode,
    tail: RollParseNode[],
    flavor: string,
    formula: string,
  ): FunctionRollParseNode;

  /**
   * Handle a pool term.
   * @param head - The first term.
   * @param tail - Zero or more additional terms.
   * @param modifiers - The matched modifiers string.
   * @param flavor - Associated flavor text.
   * @param formula - The original matched text.
   * @internal
   */
  protected _onPoolTerm(
    head: RollParseNode,
    tail: RollParseNode[],
    modifiers: string | null,
    flavor: string | null,
    formula: string,
  ): PoolRollParseNode;

  /**
   * Handle a parenthetical.
   * @param term - The inner term.
   * @param flavor - Associated flavor text.
   * @param formula - The original matched text.
   * @internal
   */
  protected _onParenthetical(term: RollParseNode, flavor: string | null, formula: string): ParentheticalRollParseNode;

  /**
   * Handle some string that failed to be classified.
   * @param term - The term.
   * @param flavor - Associated flavor text.
   */
  protected _onStringTerm(term: string, flavor: string | null): StringParseNode;

  /**
   * Collapse multiple additive operators into a single one.
   * @param operators - A sequence of additive operators.
   */
  protected _collapseOperators(operators: string[]): string;

  /**
   * Wrap a term with a leading minus.
   * @param term - The term to wrap.
   */
  protected _wrapNegativeTerm(term: RollParseNode): RollParseNode;

  /* -------------------------------------------- */
  /*  Tree Manipulation                           */
  /* -------------------------------------------- */
  /**
   * Flatten a tree structure (either a parse tree or AST) into an array with operators in infix notation.
   * @param root -The root of the tree.
   */
  static flattenTree(root: RollParseNode): RollParseNode[];

  /**
   * Use the Shunting Yard algorithm to convert a parse tree or list of terms into an AST with correct operator
   * precedence.
   * See https://en.wikipedia.org/wiki/Shunting_yard_algorithm for a description of the algorithm in detail.
   * @param root - The root of the parse tree or a list of terms.
   */
  static toAST(root: RollParseNode | RollTerm[]): RollParseNode;

  /**
   * Determine if a given node is an operator term.
   */
  static isOperatorTerm(node: RollParseNode | RollTerm): boolean;

  /* -------------------------------------------- */
  /*  Debug Formatting                            */
  /* -------------------------------------------- */

  /**
   * Format a list argument.
   * @param list - The list to format.
   */
  static formatList(list: RollParseArg[]): string;

  /**
   * Format a parser argument.
   * @param arg - The argument.
   */
  static formatArg(arg: RollParseArg): string;

  /**
   * Format arguments for debugging.
   * @param method - The method name.
   * @param args - The arguments.
   */
  static formatDebug(method: string, ...args: RollParseArg[]): string;
}

declare namespace RollParser {
  interface AnyConstructor extends Identity<typeof AnyRollParser> {}
  interface Any extends AnyRollParser {}
}

declare abstract class AnyRollParser extends RollParser {
  constructor(...args: never);
}

export default RollParser;
