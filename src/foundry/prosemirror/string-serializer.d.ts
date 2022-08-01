import type { DOMOutputSpec, Fragment, Mark, Schema } from 'prosemirror-model';

/**
 * @param node - The ProseMirror node.
 * @returns The specification to build a DOM node for this ProseMirror node.
 */
export type ProseMirrorNodeOutput = (node: Node) => DOMOutputSpec;

/**
 * @param mark   - The ProseMirror mark.
 * @param inline - Is the mark appearing in an inline context?
 * @returns The specification to build a DOM node for this ProseMirror mark.
 */

export type ProseMirrorMarkOutput = (mark: Mark, inline: boolean) => DOMOutputSpec;

export default class StringSerializer {
  /**
   * @param nodes - The node output specs.
   * @param marks - The mark output specs.
   */
  constructor(nodes: Record<string, ProseMirrorNodeOutput>, marks: Record<string, ProseMirrorMarkOutput>);

  /**
   * Build a serializer for the given schema.
   * @param schema - The ProseMirror schema.
   */
  static fromSchema(schema: Schema): StringSerializer;

  /**
   * Create a StringNode from a ProseMirror DOMOutputSpec.
   * @param spec - The specification.
   * @returns An object describing the outer node, and a reference to the child node where content should be appended, if applicable.
   */
  protected _specToStringNode(spec: DOMOutputSpec | string): { outer: StringNode; content?: StringNode };

  /**
   * Serialize a ProseMirror fragment into an HTML string.
   * @param fragment - The ProseMirror fragment, a collection of ProseMirror nodes.
   * @param target   - The target to append to. Not required for the top-level invocation. (default: `new StringNode()`)
   * @returns A DOM tree representation as a StringNode.
   */
  serializeFragment(fragment: Fragment, target?: StringNode): StringNode;

  /**
   * Convert a ProseMirror node representation to a StringNode.
   * @param node - The ProseMirror node.
   */
  protected _toStringNode(node: Node): StringNode;

  /**
   * Convert a ProseMirror mark representation to a StringNode.
   * @param mark   - The ProseMirror mark.
   * @param inline - Does the mark appear in an inline context?
   */
  protected _serializeMark(mark: Mark, inline: boolean): ReturnType<StringSerializer['_specToStringNode']>;
}

/**
 * A class that behaves like a lightweight DOM node, allowing children to be appended. Serializes to an HTML string.
 */
declare class StringNode {
  /**
   * @param tag - The tag name. If none is provided, this node's children will not be wrapped in an outer tag.
   * @param attrs - The tag attributes.
   */
  constructor(tag?: string, attrs?: Record<string, string>);

  /**
   * The tag name.
   */
  readonly tag: string | undefined;

  /**
   * The tag attributes.
   */
  readonly attrs: Record<string, string> | undefined;

  /**
   * Append a child to this string node.
   * @param child - The child node or string.
   * @throws If attempting to append a child to a void element.
   */
  appendChild(child: StringNode | string): void;
}

export type { StringNode };
