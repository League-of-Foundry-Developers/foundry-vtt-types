import type { MarkSpec, Node, NodeSpec, AttributeSpec, DOMOutputSpec, TagParseRule } from "prosemirror-model";

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
   * @remarks Foundry marked `@abstract`; Throws if not overridden
   */
  static get attrs(): Record<string, AttributeSpec>;

  /**
   * Check if an HTML element is appropriate to represent as this node, and if so, extract its schema attributes.
   * @param el - The HTML element
   * @returns Returns false if the HTML element is not appropriate for this schema node, otherwise returns its attributes.
   * @remarks Foundry marked `@abstract`; Throws if not overridden
   */
  static getAttrs(el: HTMLElement): SchemaDefinition.GetAttrsReturn;

  /**
   * Convert a ProseMirror Node back into an HTML element.
   * @param node - The ProseMirror node.
   * @remarks Foundry marked `@abstract`; Throws if not overridden
   */
  static toDOM(node: Node): SchemaDefinition.DOMOutputSpecTuple;

  /**
   * Create the ProseMirror schema specification.
   * @remarks Foundry marked `@abstract` but does *not* throw if not overridden, subclasses all `return mergeObject(super.make(), ...)`
   */
  static make(): NodeSpec | MarkSpec;
}

declare namespace SchemaDefinition {
  /** @privateRemarks just to show provenance */
  type DOMOutputSpecTuple = Extract<DOMOutputSpec, readonly [string, ...any[]]>;

  /**
   * @privateRemarks `Record<string, any> | false | null`, from Foundry's `object|boolean`
   */
  type GetAttrsReturn = ReturnType<NonNullable<TagParseRule["getAttrs"]>>;
}

export default SchemaDefinition;
