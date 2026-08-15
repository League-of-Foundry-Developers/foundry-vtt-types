import type {
  MarkSpec,
  Node,
  NodeSpec,
  AttributeSpec,
  // DOMOutputSpec only used for link
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DOMOutputSpec,
  Attrs,
} from "prosemirror-model";

/**
 * An abstract interface for a ProseMirror schema definition.
 */
declare abstract class SchemaDefinition {
  /**
   * The HTML tag selector this node is associated with.
   */
  static tag: string;

  /**
   * Schema attributes.
   * @abstract
   * @remarks
   * @throws If not overridden.
   */
  static get attrs(): Record<string, AttributeSpec>;

  /**
   * Check if an HTML element is appropriate to represent as this node, and if so, extract its schema attributes.
   * @param el - The HTML element.
   * @returns Returns false if the HTML element is not appropriate for this schema node, otherwise returns its attributes.
   * @abstract
   * @remarks
   * @throws If not overridden.
   */
  static getAttrs(el: HTMLElement): SchemaDefinition.GetAttrsReturn;

  /**
   * Convert a ProseMirror Node back into an HTML element.
   * @param node - The ProseMirror node.
   * @abstract
   * @remarks
   * @throws If not overridden.
   */
  static toDOM(node: Node): SchemaDefinition.DOMOutputSpecUnion;

  /**
   * Create the ProseMirror schema specification.
   * @abstract
   */
  static make(): NodeSpec | MarkSpec;
}

declare namespace SchemaDefinition {
  /** @privateRemarks Mirrors ProseMirror's {@linkcode DOMOutputSpec}, replacing its tuple tail's `any` with `unknown`. */
  type DOMOutputSpecUnion =
    | HTMLElement
    | { dom: HTMLElement; contentDOM?: HTMLElement }
    | readonly [string, ...unknown[]];

  type GetAttrsReturn = Attrs | false | null;
}

export default SchemaDefinition;
