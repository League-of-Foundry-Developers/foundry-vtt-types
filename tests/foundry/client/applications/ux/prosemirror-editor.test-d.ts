import { assertType, expectTypeOf, test } from "vitest";
import type { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import ProseMirrorEditor = foundry.applications.ux.ProseMirrorEditor;

declare const document: Actor.Implementation;
declare const view: EditorView;
declare const plugin: Plugin;

test("foundry/client/applications/ux/prosemirror-editor", () => {
  assertType<typeof ProseMirrorEditor>(ProseMirrorEditor);

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

  // `collaborate` is copied from the options, which may omit it
  const localEditor = new ProseMirrorEditor("prosemirror.test", view);
  expectTypeOf(localEditor.collaborate).toEqualTypeOf<boolean | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- v14 runtime keeps this signature under deprecation.
  new ProseMirrorEditor("prosemirror.test", view, plugin, true, { collaborate: true });
});
