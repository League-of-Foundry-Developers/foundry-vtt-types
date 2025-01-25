import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const actor: Actor.ConfiguredInstance;
const actorDocumentOwnershipConfig = new DocumentOwnershipConfig(actor);

expectTypeOf(actorDocumentOwnershipConfig.object).toEqualTypeOf<Actor>();
expectTypeOf(actorDocumentOwnershipConfig.document).toEqualTypeOf<Actor>();
expectTypeOf(DocumentOwnershipConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions>();
expectTypeOf(actorDocumentOwnershipConfig.options).toEqualTypeOf<DocumentSheetOptions<Actor>>();
expectTypeOf(actorDocumentOwnershipConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentOwnershipConfig.DocumentOwnershipConfigData>>
>();
expectTypeOf(actorDocumentOwnershipConfig.render(true)).toEqualTypeOf<DocumentOwnershipConfig>();

expectTypeOf(actorDocumentOwnershipConfig.title).toEqualTypeOf<string>();

// test a second type of document
declare const item: Item.ConfiguredInstance;
const itemDocumentOwnershipConfig = new DocumentOwnershipConfig(item);

expectTypeOf(itemDocumentOwnershipConfig.object).toEqualTypeOf<Item>();
expectTypeOf(itemDocumentOwnershipConfig.document).toEqualTypeOf<Item>();
expectTypeOf(itemDocumentOwnershipConfig.options).toEqualTypeOf<DocumentSheetOptions<Item>>();
expectTypeOf(itemDocumentOwnershipConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentOwnershipConfig.DocumentOwnershipConfigData>>
>();
expectTypeOf(itemDocumentOwnershipConfig.render(true)).toEqualTypeOf<DocumentOwnershipConfig>();
