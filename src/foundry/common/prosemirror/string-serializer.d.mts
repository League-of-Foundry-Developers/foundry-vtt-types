import type { Coalesce } from "#utils";
import type { DOMOutputSpec, Fragment, Mark, Node, Schema } from "prosemirror-model";
import type StringNode from "../utils/string-node.d.mts";

/**
 * A class responsible for serializing a ProseMirror document into a string of HTML.
 */
declare class StringSerializer {
  /**
   * @param nodes - The node output specs.
   * @param marks - The mark output specs.
   */
  constructor(nodes: Record<string, StringSerializer.NodeOutput>, marks: Record<string, StringSerializer.MarkOutput>);

  /**
   * Build a serializer for the given schema.
   * @param schema - The ProseMirror schema.
   */
  static fromSchema(schema: Schema): StringSerializer;

  /**
   * Create a StringNode from a ProseMirror DOMOutputSpec.
   * @param spec   - The specification.
   * @param inline - Whether this is a block or inline node.
   * @returns An object describing the outer node, and a reference to the child node where content should be appended, if applicable.
   * @remarks `inline` gets passed to `new StringNode`, where it has a default of `true`
   */
  protected _specToStringNode(spec: DOMOutputSpec, inline?: boolean): StringSerializer.SpecToStringNodeReturn;

  /**
   * Serialize a ProseMirror fragment into an HTML string.
   * @param fragment - The ProseMirror fragment, a collection of ProseMirror nodes.
   * @param target   - The target to append to. Not required for the top-level invocation. (default: `new StringNode()`)
   * @returns A DOM tree representation as a StringNode.
   */
  serializeFragment<Target extends StringNode.Any | undefined = undefined>(
    fragment: Fragment,
    target?: Target,
  ): Coalesce<Target, StringNode>;

  /**
   * Convert a ProseMirror node representation to a StringNode.
   * @param node - The ProseMirror node.
   */
  protected _toStringNode(node: Node): StringNode.Any;

  /**
   * Convert a ProseMirror mark representation to a StringNode.
   * @param mark   - The ProseMirror mark.
   * @param inline - Does the mark appear in an inline context?
   * @remarks `inline` gets passed to {@linkcode _specToStringNode}, which forwards to `new StringNode`, where it has a default of `true`
   */
  protected _serializeMark(mark: Mark, inline?: boolean): StringSerializer.SpecToStringNodeReturn;

  #StringSerializer: true;
}

declare namespace StringSerializer {
  /**
   * @param node - The ProseMirror node.
   * @returns The specification to build a DOM node for this ProseMirror node.
   */
  type NodeOutput = (node: Node) => DOMOutputSpec;

  /**
   * @param mark   - The ProseMirror mark.
   * @param inline - Is the mark appearing in an inline context?
   * @returns The specification to build a DOM node for this ProseMirror mark.
   */

  type MarkOutput = (mark: Mark, inline: boolean) => DOMOutputSpec;

  interface SpecToStringNodeReturn {
    outer: StringNode.Any;
    content?: StringNode.Any | undefined;
  }
}

export default StringSerializer;
