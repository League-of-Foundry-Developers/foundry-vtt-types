import { assertType } from "vitest";

const ProseMirrorEditor = foundry.applications.ux.ProseMirrorEditor;

assertType<typeof ProseMirrorEditor>(ProseMirrorEditor);
type ProseMirrorEditorCreateFuncOptions = Parameters<(typeof ProseMirrorEditor)["create"]>[2];
declare const document: Actor.Implementation;

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, document }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, fieldName: "error" }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

assertType<ProseMirrorEditorCreateFuncOptions>({ collaborate: true, document: document, fieldName: "valid" });
assertType<ProseMirrorEditorCreateFuncOptions>({});
assertType<ProseMirrorEditorCreateFuncOptions>({ collaborate: false });
