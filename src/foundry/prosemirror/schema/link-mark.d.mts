import { Mark, MarkSpec, Node, NodeSpec } from "prosemirror-model";
import type SchemaDefinition from "./schema-definition.d.mts";
import { EditorView } from "prosemirror-view";

export default LinkMark;

/**
 * A class responsible for encapsulating logic around link marks in the ProseMirror schema.
 */
declare class LinkMark extends SchemaDefinition {
  static override tag: "a";

  static override get attrs(): Record<string, unknown>;

  static override getAttrs(el: HTMLLinkElement): boolean | Record<string, unknown>;

  static override toDOM(node: Node): [string, unknown];

  static override make(): NodeSpec | MarkSpec;

  /**
   * Handle clicks on link marks while editing.
   * @param view  - The ProseMirror editor view.
   * @param pos   - The position in the ProseMirror document that the click occurred at.
   * @param event - The click event
   * @param mark  - The Mark instance.
   * @returns Returns true to indicate the click was handled here and should not be propogated to other plugins.
   */
  static onClick(view: EditorView, pos: number, event: JQuery.ClickEvent, mark: Mark): boolean | void;
}
