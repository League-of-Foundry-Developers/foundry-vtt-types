import type { Schema, Slice } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type ProseMirrorPlugin from "./plugin.d.mts";
import type Document from "#common/abstract/document.mjs";

/**
 * A class responsible for handling the dropping of Documents onto the editor and creating content links for them.
 */
declare class ProseMirrorContentLinkPlugin extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema.
   * @param options - Additional options to configure the plugin's behaviour.
   */
  constructor(schema: Schema, options?: ProseMirrorContentLinkPlugin.ConstructionOptions);

  /**
   * The parent document housing this editor.
   * @remarks `defineProperty`'d in construction, explicitly `writable: false`
   */
  readonly document: Document.Any | undefined;

  /**
   * Whether to generate links relative to the parent document.
   * @remarks `defineProperty`'d in construction, explicitly `writable: false`
   */
  readonly relativeLinks: boolean;

  static override build(schema: Schema, options?: ProseMirrorContentLinkPlugin.ConstructionOptions): Plugin;

  /**
   * Handle a drop onto the editor.
   * @param view  - The ProseMirror editor view.
   * @param event - The drop event.
   * @param slice - A slice of editor content.
   * @param moved - Whether the slice has been moved from a different part of the editor.
   */
  protected _onDrop(view: EditorView, event: DragEvent, slice: Slice, moved: boolean): boolean | void;
}

declare namespace ProseMirrorContentLinkPlugin {
  interface ConstructionOptionsNoRelative {
    /** The parent document housing this editor. */
    document?: Document.Any | undefined;

    /**
     * @defaultValue `false`
     * @remarks If `relativeLinks` is `true`, a valid `document` must be passed or construction will throw
     */
    relativeLinks?: false | undefined;
  }

  interface ConstructionOptionsRelative {
    /** The parent document housing this editor. */
    document: Document.Any;

    /**
     * @defaultValue `false`
     * @remarks If `relativeLinks` is `true`, a valid `document` must be passed or construction will throw
     */
    relativeLinks: true;
  }

  type ConstructionOptions = ConstructionOptionsRelative | ConstructionOptionsNoRelative;
}

export default ProseMirrorContentLinkPlugin;
