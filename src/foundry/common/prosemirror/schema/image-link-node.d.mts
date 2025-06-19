import type { AttributeSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";
import type { EditorView } from "prosemirror-view";
import type LinkMark from "./link-mark.d.mts";
import type ImageNode from "./image-node.d.mts";

/**
 * A class responsible for encapsulating logic around image-link nodes in the ProseMirror schema.
 */
declare class ImageLinkNode extends SchemaDefinition {
  static override tag: "a";

  static override get attrs(): Record<string, AttributeSpec>;

  static override getAttrs(el: HTMLLinkElement): SchemaDefinition.GetAttrsReturn;

  static override toDOM(node: Node): ImageLinkNode.ToDOMReturn;

  static override make(): NodeSpec;

  /**
   * Handle clicking on image links while editing.
   * @param view  - The ProseMirror editor view.
   * @param pos   - The position in the ProseMirror document that the click occurred at.
   * @param event - The click event.
   * @param node  - The Node instance.
   */
  static onClick(view: EditorView, pos: number, event: PointerEvent, node: Node): boolean;
}

declare namespace ImageLinkNode {
  type ToDOMReturn = [...ReturnType<typeof LinkMark.toDOM>, ReturnType<typeof ImageNode.toDOM>];
}

export default ImageLinkNode;
