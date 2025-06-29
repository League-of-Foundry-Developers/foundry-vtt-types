import type { Mark, MarkSpec, Node, AttributeSpec, Attrs } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";
import type SchemaDefinition from "./schema-definition.d.mts";

/**
 * A class responsible for encapsulating logic around link marks in the ProseMirror schema.
 */
declare class LinkMark extends SchemaDefinition {
  static override tag: "a";

  static override get attrs(): Record<string, AttributeSpec>;

  static override getAttrs(el: HTMLLinkElement): SchemaDefinition.GetAttrsReturn;

  static override toDOM(node: Node): LinkMark.ToDOMReturn;

  static override make(): MarkSpec;

  /**
   * Handle clicks on link marks while editing.
   * @param view  - The ProseMirror editor view.
   * @param pos   - The position in the ProseMirror document that the click occurred at.
   * @param event - The click event.
   * @param mark  - The Mark instance.
   * @returns Returns true to indicate the click was handled here and should not be propagated to other plugins.
   * @remarks Really does unconditionally return `true`, return type is per Foundry
   */
  static onClick(view: EditorView, pos: number, event: PointerEvent, mark: Mark): boolean | void;
}

declare namespace LinkMark {
  type ToDOMReturn = [string, Attrs];
}

export default LinkMark;
