import type { MarkSpec, NodeSpec } from "prosemirror-model";
import type { InexactPartial } from "#utils";

/**
 * A class responsible for injecting attribute capture logic into the ProseMirror schema.
 */
declare class AttributeCapture {
  constructor();

  /**
   * Augments the schema definition to allow each node or mark to capture all the attributes
   * on an element and preserve them when re-serialized back into the DOM.
   * @param spec - The schema specification
   */
  attributeCapture(spec: NodeSpec | MarkSpec): void;

  /**
   * Capture all allowable attributes present on an HTML element and store them in an object for preservation in the
   * schema.
   * @param el      - The element.
   * @param managed - An object containing the attributes, styles, and classes that are managed by the ProseMirror node
   * and should not be preserved.
   * @internal
   */
  _captureAttributes(el: HTMLElement, managed?: AttributeCapture.ManagedAttributes): Record<string, string>;

  /**
   * Capture all classes present on an HTML element.
   * @param el      - The element.
   * @param managed - An object containing the classes that are managed by the ProseMirror node and should not be preserved.
   * @internal
   */
  _captureClasses(el: HTMLElement, managed?: AttributeCapture.ManagedAttributes): string;

  #AttributeCapture: true;
}

declare namespace AttributeCapture {
  interface AllowedAttributeConfiguration {
    /** The set of exactly-matching attribute names. */
    attrs: Set<string>;

    /** A list of wildcard allowed prefixes for attributes. */
    wildcards: string[];
  }

  interface ManagedAttributesSpec {
    /** A list of managed attributes. */
    attributes: string[];

    /** A list of CSS property names that are managed as inline styles. */
    styles: string[];

    /** A list of managed class names. */
    classes: string[];
  }

  interface ManagedAttributes extends InexactPartial<ManagedAttributesSpec> {}
}

export default AttributeCapture;
