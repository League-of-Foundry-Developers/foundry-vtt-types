import { expectTypeOf } from "vitest";

import ProseMirrorContentLinkPlugin = foundry.prosemirror.ProseMirrorContentLinkPlugin;
import type { EditorView } from "prosemirror-view";
import type { Slice } from "prosemirror-model";

declare const schema: foundry.prosemirror.Schema;
declare const document: Macro.Implementation;

// construction options tested below
expectTypeOf(ProseMirrorContentLinkPlugin.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();

new ProseMirrorContentLinkPlugin(schema);
new ProseMirrorContentLinkPlugin(schema, { document, relativeLinks: true });
// @ts-expect-error if relativeLinks is true, you must pass a document
new ProseMirrorContentLinkPlugin(schema, { document: undefined, relativeLinks: true });
const pmclp = new ProseMirrorContentLinkPlugin(schema, {
  document: undefined,
  relativeLinks: undefined,
});

expectTypeOf(pmclp.document).toEqualTypeOf<foundry.abstract.Document.Any | undefined>();
expectTypeOf(pmclp.relativeLinks).toEqualTypeOf<boolean>();

declare const view: EditorView;
declare const dragEvent: DragEvent;
declare const slice: Slice;
expectTypeOf(pmclp["_onDrop"](view, dragEvent, slice, false)).toEqualTypeOf<boolean | void>();
