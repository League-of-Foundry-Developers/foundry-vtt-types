import { assertType } from "vitest";

assertType<typeof ProseMirrorEditor>(ProseMirrorEditor);
type ProseMirrorEditorCreateFuncOptions = Parameters<(typeof ProseMirrorEditor)["create"]>[2];
declare const document: Actor;

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, document }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

// @ts-expect-error - both `document` and `fieldName` are required.
expectTypeOf({ collaborate: true, fieldName: "error" }).toEqualTypeOf<ProseMirrorEditorCreateFuncOptions>();

assertType<ProseMirrorEditorCreateFuncOptions>({ collaborate: true, document: document, fieldName: "valid" });
assertType<ProseMirrorEditorCreateFuncOptions>({});
assertType<ProseMirrorEditorCreateFuncOptions>({ collaborate: false });
