import { expectAssignable, expectError } from "tsd";

expectAssignable<typeof ProseMirrorEditor>(ProseMirrorEditor);
type ProseMirrorEditorCreateFuncOptions = Parameters<typeof ProseMirrorEditor["create"]>[2];
declare const document: Actor;

// if collaborate is true, both document and fieldName are expected to be present.
expectError<ProseMirrorEditorCreateFuncOptions>({ collaborate: true });
expectError<ProseMirrorEditorCreateFuncOptions>({ collaborate: true, document });
expectError<ProseMirrorEditorCreateFuncOptions>({ collaborate: true, fieldName: "error" });
expectAssignable<ProseMirrorEditorCreateFuncOptions>({ collaborate: true, document: document, fieldName: "valid" });
expectAssignable<ProseMirrorEditorCreateFuncOptions>({});
expectAssignable<ProseMirrorEditorCreateFuncOptions>({ collaborate: false });
