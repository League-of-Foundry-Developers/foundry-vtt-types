import type { Schema, Slice } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "./plugin.d.mts";

interface ProseMirrorContentLinkOptions {
  /** The parent document housing this editor. */
  document?: foundry.abstract.Document<any, any, any>;
  /** @defaultValue `false` */
  relativeLinks?: boolean;
}

export default ProseMirrorContentLinkPlugin;
/**
 * A class responsible for handling the dropping of Documents onto the editor and creating content links for them.
 */
declare class ProseMirrorContentLinkPlugin extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options?: ProseMirrorContentLinkOptions);

  /**
   * The parent document housing this editor.
   */
  readonly document: foundry.abstract.Document<any, any, any>;

  /**
   * Whether to generate links relative to the parent document.
   */
  readonly relativeLinks: boolean;

  static override build(schema: Schema, options?: ProseMirrorContentLinkOptions): Plugin;

  /**
   * Handle a drop onto the editor.
   * @param view  - The ProseMirror editor view.
   * @param event - The drop event.
   * @param slice - A slice of editor content.
   * @param moved - Whether the slice has been moved from a different part of the editor.
   */
  protected _onDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean): void | true;
}
