import { assertType, expectTypeOf } from "vitest";

import ProseMirrorEditor = foundry.applications.ux.ProseMirrorEditor;

assertType<typeof ProseMirrorEditor>(ProseMirrorEditor);
declare const document: Actor.Implementation;

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, document }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

// @ts-expect-error both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, fieldName: "error" }).toEqualTypeOf<ProseMirrorEditor.CreateOptions>();

assertType<ProseMirrorEditor.CreateOptions>({ collaborate: true, document: document, fieldName: "valid" });
assertType<ProseMirrorEditor.CreateOptions>({});
assertType<ProseMirrorEditor.CreateOptions>({ collaborate: false });
