import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const scene: Scene.ConfiguredInstance;
const documentSheetConfig = new DocumentSheetConfig(scene);

expectTypeOf(documentSheetConfig.object).toEqualTypeOf<Scene>();
expectTypeOf(DocumentSheetConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(documentSheetConfig.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(documentSheetConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentSheetConfig.DocumentSheetConfigData>>
>();
expectTypeOf(documentSheetConfig.render(true)).toEqualTypeOf<DocumentSheetConfig>();

expectTypeOf(documentSheetConfig.title).toEqualTypeOf<string>();

// test a second type of document
declare const actor: Actor.ConfiguredInstance;
const actorDocumentSheetConfig = new DocumentSheetConfig(actor);

expectTypeOf(actorDocumentSheetConfig.object).toEqualTypeOf<Actor>();
expectTypeOf(actorDocumentSheetConfig.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(actorDocumentSheetConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentSheetConfig.DocumentSheetConfigData>>
>();
expectTypeOf(actorDocumentSheetConfig.render(true)).toEqualTypeOf<DocumentSheetConfig>();

expectTypeOf(documentSheetConfig.title).toEqualTypeOf<string>();

// test functions
expectTypeOf(
  DocumentSheetConfig.getSheetClassesForSubType("Actor", "Subtype"),
).toEqualTypeOf<DocumentSheetConfig.SheetClassesForSubType>();
