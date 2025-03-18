import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const noteDocument: NoteDocument;
const noteConfig = new NoteConfig(noteDocument);

expectTypeOf(noteConfig.object).toEqualTypeOf<NoteDocument>();
expectTypeOf(noteConfig.document).toEqualTypeOf<NoteDocument>();
expectTypeOf(NoteConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<NoteDocument.Implementation>>();
expectTypeOf(noteConfig.options).toEqualTypeOf<DocumentSheet.Options<NoteDocument.Implementation>>();
expectTypeOf(noteConfig.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(noteConfig.render(true)).toEqualTypeOf<NoteConfig>();
