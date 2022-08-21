import type { Step } from "prosemirror-transform";
import type { EditorView } from "prosemirror-view";
import type { EditorState, Plugin } from "prosemirror-state";
import type { ClientDocumentMixin } from "../data/abstract/client-document";
import type { Socket } from "socket.io-client";

declare global {
  interface ProseMirrorHistory {
    /** The ID of the user who submitted the step. */
    userId: string;
    /** The step that was submitted. */
    step: Step;
  }
  namespace ProseMirrorEditor {
    interface Options {
      document?: ClientDocumentMixin<foundry.abstract.Document<any, any>>;
    }
    interface CreateOptions {
      /** A string to uniquely identify this ProseMirror instance. Ignored for a collaborative editor. */
      uuid: string;
      /** A Document whose content is being edited. Required for collaborative editing. */
      document: ClientDocumentMixin<foundry.abstract.Document<any, any>>;
      /** The field within the Document that is being edited. Required for collaborative editing. */
      fieldName: string;
      /** Plugins to include with the editor. */
      plugins: Record<string, Plugin>;
      /** Whether to enable collaborative editing for this editor. */
      collaborate: boolean;
    }
  }
  /**
   * A class responsible for managing state and collaborative editing of a single ProseMirror instance.
   */
  class ProseMirrorEditor {
    /**
     * A string that uniquely identifies this ProseMirror instance.
     */
    readonly uuid: string;

    /**
     * The ProseMirror EditorView.
     */
    readonly view: EditorView;

    /**
     * Whether this is a collaborative editor.
     */
    readonly collaborate: boolean;

    options: ProseMirrorEditor.Options;

    /**
     * @param uuid          - A string that uniquely identifies this ProseMirror instance.
     * @param view          - The ProseMirror EditorView.
     * @param isDirtyPlugin - The plugin to track the dirty state of the editor.
     * @param collaborate   - Whether this is a collaborative editor.
     * @param options       - Additional options.
     */
    constructor(
      uuid: string,
      view: EditorView,
      isDirtyPlugin: Plugin,
      collaborate: boolean,
      options?: ProseMirrorEditor.Options
    );

    /**
     * Retire this editor instance and clean up.
     */
    destroy(): void;

    /**
     * Reset and destroy the editor so that it can be activated again.
     * @param fieldName - The field name that this editor is responsible for.
     */
    reset(fieldName?: string): void;

    /**
     * Have the contents of the editor been edited by the user?
     */
    isDirty(): boolean;

    /**
     * Handle new editing steps supplied by the server.
     * @param offset  - The offset into the history, representing the point at which it was last truncated.
     * @param history - The entire edit history.
     */
    protected _onNewSteps(offset: string, history: ProseMirrorHistory[]): void;

    /**
     * Disable source code editing if the user was editing it when new steps arrived.
     */
    protected _disableSourceCodeEditing(): void;

    /**
     * The state of this ProseMirror editor has fallen too far behind the central authority's and must be re-synced.
     */
    protected _resync(): void;

    /**
     * Handle users joining or leaving collaborative editing.
     * @param users - The IDs of users currently editing (including ourselves).
     */
    protected _updateUserDisplay(users: string[]): void;

    /**
     * Create a ProseMirror editor instance.
     * @param target                  - An HTML element to mount the editor to.
     * @param content                 - Content to populate the editor with. (default: `""`)
     * @param options                    - Additional options to configure the ProseMirror instance.
     */
    static create(
      target: HTMLElement,
      content?: string,
      options?: Partial<ProseMirrorEditor.CreateOptions> &
        (
          | { collaborate?: false }
          | ({ collaborate: true } & Pick<ProseMirrorEditor.CreateOptions, "document" | "fieldName">)
        )
    ): Promise<ProseMirrorEditor>;

    /**
     * Create an EditorView with collaborative editing enabled.
     * @param uuid    - The ProseMirror instance UUID.
     * @param target  - An HTML element to mount the editor view to.
     * @param state   - The ProseMirror editor state.
     * @param plugins - The editor plugins to load.
     */
    protected static _createCollaborativeEditorView(
      uuid: string,
      target: HTMLElement,
      state: EditorState,
      plugins: Plugin[]
    ): Promise<EditorView>;

    /**
     * Create a plain EditorView without collaborative editing.
     * @param target  - An HTML element to mount the editor view to.
     * @param state   - The ProseMirror editor state.
     * @param plugins - The editor plugins to load.
     */
    protected static _createLocalEditorView(target: HTMLElement, state: EditorState, plugins: Plugin[]): EditorView;

    /**
     * Handle new editing steps supplied by the server.
     * @param uuid    - The UUID that uniquely identifies the ProseMirror instance.
     * @param offset  - The offset into the history, representing the point at which it was last truncated.
     * @param history - The entire edit history.
     */
    protected static _onNewSteps(uuid: string, offset: number, history: ProseMirrorEditor[]): void;

    /**
     * Our client is too far behind the central authority's state and must be re-synced.
     * @param uuid - The UUID that uniquely identifies the ProseMirror instance.
     */
    protected static _onResync(uuid: string): void;

    /**
     * Handle users joining or leaving collaborative editing.
     * @param uuid  - The UUID that uniquely identifies the ProseMirror instance.
     * @param users - The IDs of the users currently editing (including ourselves).
     */
    protected static _onUsersEditing(uuid: string, users: string[]): void;

    /**
     * Listen for ProseMirror collaboration events.
     * @param socket - The open websocket.
     * @internal
     */
    static _activateSocketListeners(socket: Socket): void;
  }
}
