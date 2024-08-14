import type { DOMOutputSpec, MarkSpec, NodeSpec } from "prosemirror-model";

/**
 * A class responsible for injecting attribute capture logic into the ProseMirror schema.
 */
declare class AttributeCapture {
  constructor();

  // placeholder for subclassing
  #attributeCapture: true;

  /**
   * Augments the schema definition to allow each node or mark to capture all the attributes
   * on an element and preserve them when re-serialized back into the DOM.
   * @param spec - The schema specification
   */
  attributeCapture(spec: NodeSpec | MarkSpec): DOMOutputSpec;
}

declare namespace AttributeCapture {
  // only used in truly private methods
  // interface AllowedAttributeConfiguration {
  //   /**  The set of exactly-matching attribute names. **/
  //   attrs: Set<string>;
  //   /** A list of wildcard allowed prefixes for attributes. **/
  //   wildcards: string[];
  // }
  // only used in truly private methods
  // interface ManagedAttributesSpec {
  //   /**  A list of managed attributes. */
  //   attributes: string[];
  //   /**  A list of CSS property names that are managed as inline styles. */
  //   styles: string[];
  //   /**  A list of managed class names. */
  //   classes: string[];
  // }
}

export default AttributeCapture;
