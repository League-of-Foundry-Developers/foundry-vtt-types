import { MarkSpec, Node, NodeSpec } from "prosemirror-model";

export default SchemaDefinition;

/**
 * An abstract interface for a ProseMirror schema definition
 */
declare abstract class SchemaDefinition {
  /**
   * The HTML tag selector this node is associated with
   */
  static tag: string;

  /**
   * Schema attributes
   * @remarks SchemaDefinition subclasses must implement the attrs getter.
   */
  static get attrs(): Record<string, unknown>;

  /**
   * Check if an HTML element is appropriate to represent as this node, and if so, extract its schema attributes.
   * @param el - The HTML element
   * @returns Returns false if the HTML element is not appropriate for this schema node, otherwise returns its attributes.
   * @remarks SchemaDefinition subclasses must implement the getAttrs method.
   */
  static getAttrs(el: HTMLElement): Record<string, unknown> | boolean;

  /**
   * Convert a ProseMirror Node back into an HTML element.
   * @param node - The ProseMirror node.
   * @remarks SchemaDefinition subclasses must implement the toDOM method.
   */
  static toDOM(node: Node): unknown[];

  /**
   * Create the ProseMirror schema specification.
   */
  static make(): NodeSpec | MarkSpec;
}
