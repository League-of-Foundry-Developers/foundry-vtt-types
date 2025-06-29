import type { AttributeSpec, Attrs, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";

/**
 * A class responsible for encapsulating logic around image nodes in the ProseMirror schema.
 */
declare class ImageNode extends SchemaDefinition {
  static override tag: "img[src]";

  static override get attrs(): Record<string, AttributeSpec>;

  static override getAttrs(el: HTMLImageElement): SchemaDefinition.GetAttrsReturn;

  static override toDOM(node: Node): ImageNode.ToDOMReturn;

  static override make(): NodeSpec;
}

declare namespace ImageNode {
  type ToDOMReturn = [string, Attrs];
}

export default ImageNode;
