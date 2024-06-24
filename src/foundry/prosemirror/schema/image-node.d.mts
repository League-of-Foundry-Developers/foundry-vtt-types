import { MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";

export default ImageNode;

/**
 * A class responsible for encapsulating logic around image nodes in the ProseMirror schema.
 */
declare class ImageNode extends SchemaDefinition {
  static override tag: "img[src]";

  static override get attrs(): Record<string, any>;

  static override getAttrs(el: HTMLElement): boolean | Record<string, any>;

  static override toDOM(node: Node): [string, any];

  static override make(): NodeSpec | MarkSpec;
}
