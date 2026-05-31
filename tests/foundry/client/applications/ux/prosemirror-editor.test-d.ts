import { assertType, expectTypeOf } from "vitest";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import ProseMirrorEditor = foundry.applications.ux.ProseMirrorEditor;

assertType<typeof ProseMirrorEditor>(ProseMirrorEditor);
declare const document: Actor.Implementation;
declare const view: EditorView;
declare const plugin: Plugin;

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, document }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, fieldName: "error" }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

assertType<ProseMirrorEditor.CreateOptions>({ collaborate: true, document: document, fieldName: "valid" });
assertType<ProseMirrorEditor.CreateOptions>({});
assertType<ProseMirrorEditor.CreateOptions>({ collaborate: false });

expectTypeOf(ProseMirrorEditor.buildDefaultPlugins()).toEqualTypeOf<Record<string, Plugin>>();

new ProseMirrorEditor("prosemirror.test", view, { collaborate: true });
// eslint-disable-next-line @typescript-eslint/no-deprecated -- v14 runtime keeps this signature under deprecation.
new ProseMirrorEditor("prosemirror.test", view, plugin, true, { collaborate: true });
