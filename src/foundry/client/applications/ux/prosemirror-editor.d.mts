import type { Plugin } from "prosemirror-state";
import type { AnyObject } from "../../../../utils/index.d.mts";
// import type { Step } from "prosemirror-transform";
// import type { EditorView } from "prosemirror-view";
// import type { Socket } from "socket.io-client";

/**
 * A class responsible for managing state and collaborative editing of a single ProseMirror instance.
 * @remarks TODO: Stub, copy from v12 implementation & update
 */
declare class ProseMirrorEditor {}

declare namespace ProseMirrorEditor {
  // TODO: Improve typing here
  type Props = AnyObject;

  interface CreateOptions {
    /** A string to uniquely identify this ProseMirror instance. Ignored for a collaborative editor. */
    uuid?: string | null | undefined;

    /** A Document whose content is being edited. Required for collaborative editing and relative UUID generation. */
    document?: foundry.abstract.Document.Any | null | undefined;

    /** The field within the Document that is being edited. Required for collaborative editing. */
    fieldName?: string | null | undefined;

    /** Plugins to include with the editor. */
    plugins?: Record<string, Plugin> | undefined;

    /**
     * Whether to enable collaborative editing for this editor.
     * @defaultValue `false`
     */
    collaborate?: boolean | undefined;

    /**
     * Whether to generate relative UUID links to Documents that are dropped on the editor.
     * @defaultValue `false`
     */
    relativeLinks?: boolean | undefined;

    /** Additional ProseMirror editor properties. */
    props?: Props | undefined;
  }
}

export default ProseMirrorEditor;
