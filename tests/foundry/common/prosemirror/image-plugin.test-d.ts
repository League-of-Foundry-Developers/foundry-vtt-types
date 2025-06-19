import { expectTypeOf } from "vitest";

import ProseMirrorImagePlugin = foundry.prosemirror.ProseMirrorImagePlugin;
import Plugin = foundry.prosemirror.Plugin;
import type { EditorView } from "prosemirror-view";
import type { Slice } from "prosemirror-model";

declare const schema: foundry.prosemirror.Schema;
declare const document: Macro.Implementation;

// @ts-expect-error Must pass a `document` in options
expectTypeOf(ProseMirrorImagePlugin.build(schema, {})).toEqualTypeOf<Plugin>();
expectTypeOf(ProseMirrorImagePlugin.build(schema, { document })).toEqualTypeOf<Plugin>();

expectTypeOf(ProseMirrorImagePlugin.base64ToFile("data", "path/to/image.jpeg", "image/jpeg")).toEqualTypeOf<File>();

// @ts-expect-error Must pass a `document` in options
new ProseMirrorImagePlugin(schema);
const pmip = new ProseMirrorImagePlugin(schema, { document });

expectTypeOf(pmip.document).toEqualTypeOf<typeof document>();

declare const view: EditorView;
declare const dragEvent: DragEvent;
declare const slice: Slice;
declare const cbEvent: ClipboardEvent;
declare const files: FileList;

expectTypeOf(pmip["_onDrop"](view, dragEvent, slice, true)).toEqualTypeOf<boolean | void>();
expectTypeOf(pmip["_onPaste"](view, cbEvent)).toEqualTypeOf<boolean | void>();

expectTypeOf(pmip["_uploadImages"](view, files)).toEqualTypeOf<Promise<void>>();
expectTypeOf(pmip["_uploadImages"](view, files, 2)).toEqualTypeOf<Promise<void>>();

expectTypeOf(pmip["_replaceBase64Images"](view, "<p> some html </p>", [["full", "image/png", "data"]]));

expectTypeOf(
  pmip["_extractBase64Images"]("<div> some html that contains links? to base64 images </div>"),
).toEqualTypeOf<ProseMirrorImagePlugin.ImageData[]>();
