import { MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";
import { EditorView } from "prosemirror-view";

export default ImageLinkNode;

/**
 * A class responsible for encapsulating logic around image-link nodes in the ProseMirror schema.
 */
declare class ImageLinkNode extends SchemaDefinition {
  static override tag: "a";

  static override get attrs(): Record<string, unknown>;

  static override getAttrs(el: HTMLLinkElement): boolean | Record<string, unknown>;

  static override toDOM(node: Node): [string, unknown];

  static override make(): NodeSpec | MarkSpec;

  /**
   * Handle clicking on image links while editing.
   * @param view  - The ProseMirror editor view.
   * @param pos   - The position in the ProseMirror document that the click occurred at.
   * @param event - The click event.
   * @param node  - The Node instance.
   */
  static onClick(view: EditorView, pos: number, event: JQuery.ClickEvent, node: Node): boolean;
}
