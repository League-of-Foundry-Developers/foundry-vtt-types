import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const scene: Scene.Implementation;
const documentSheetConfig = new DocumentSheetConfig(scene);

expectTypeOf(documentSheetConfig.object).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(DocumentSheetConfig.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(documentSheetConfig.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(documentSheetConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentSheetConfig.DocumentSheetConfigData>>
>();
expectTypeOf(documentSheetConfig.render(true)).toEqualTypeOf<DocumentSheetConfig>();

expectTypeOf(documentSheetConfig.title).toEqualTypeOf<string>();

// test a second type of document
declare const actor: Actor.Implementation;
const actorDocumentSheetConfig = new DocumentSheetConfig(actor);

expectTypeOf(actorDocumentSheetConfig.object).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(actorDocumentSheetConfig.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(actorDocumentSheetConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentSheetConfig.DocumentSheetConfigData>>
>();
expectTypeOf(actorDocumentSheetConfig.render(true)).toEqualTypeOf<DocumentSheetConfig>();

expectTypeOf(documentSheetConfig.title).toEqualTypeOf<string>();

// test functions
expectTypeOf(
  DocumentSheetConfig.getSheetClassesForSubType("Actor", "Subtype"),
).toEqualTypeOf<DocumentSheetConfig.SheetClassesForSubType>();
