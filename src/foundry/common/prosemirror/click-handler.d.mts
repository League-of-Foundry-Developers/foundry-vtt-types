import type { EditorView } from "prosemirror-view";
import type { Plugin } from "prosemirror-state";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type { Node, Schema } from "prosemirror-model";
import type { AnyObject } from "#utils";

export default ProseMirrorClickHandler;

/**
 * A class responsible for managing click events inside a ProseMirror editor.
 */
declare class ProseMirrorClickHandler extends ProseMirrorPlugin {
  /** @remarks `options` is unused */
  static override build(schema: Schema, options?: AnyObject): Plugin;

  /* -------------------------------------------- */

  /**
   * Handle a click on the editor.
   * @param view    - The ProseMirror editor view.
   * @param pos     - The position in the ProseMirror document that the click occurred at.
   * @param node    - The current ProseMirror Node that the click has bubbled to.
   * @param nodePos - The position of the click within this Node.
   * @param event   - The click event.
   * @param direct  - Whether this Node is the one that was directly clicked on.
   * @returns A return value of true indicates the event has been handled, it will not propagate to
   *          other plugins, and ProseMirror will call preventDefault on it.
   */
  protected _onClick(
    view: EditorView,
    pos: number,
    node: Node,
    nodePos: number,
    event: JQuery.ClickEvent,
    direct: boolean,
  ): boolean | void;
}
