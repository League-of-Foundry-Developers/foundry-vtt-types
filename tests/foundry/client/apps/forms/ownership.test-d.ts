import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const actor: Actor.Implementation;
const actorDocumentOwnershipConfig = new DocumentOwnershipConfig(actor);

type ActorDocumentOwnershipConfig = typeof actorDocumentOwnershipConfig;

expectTypeOf(actorDocumentOwnershipConfig.object).toEqualTypeOf<Actor>();
expectTypeOf(actorDocumentOwnershipConfig.document).toEqualTypeOf<Actor>();
expectTypeOf(DocumentOwnershipConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options>();
expectTypeOf(actorDocumentOwnershipConfig.options).toEqualTypeOf<DocumentSheet.Options<Actor>>();
expectTypeOf(actorDocumentOwnershipConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentOwnershipConfig.DocumentOwnershipConfigData>>
>();
expectTypeOf(actorDocumentOwnershipConfig.render(true)).toEqualTypeOf<ActorDocumentOwnershipConfig>();

expectTypeOf(actorDocumentOwnershipConfig.title).toEqualTypeOf<string>();

// test a second type of document
declare const item: Item.Implementation;
const itemDocumentOwnershipConfig = new DocumentOwnershipConfig(item);

expectTypeOf(itemDocumentOwnershipConfig.object).toEqualTypeOf<Item>();
expectTypeOf(itemDocumentOwnershipConfig.document).toEqualTypeOf<Item>();
expectTypeOf(itemDocumentOwnershipConfig.options).toEqualTypeOf<DocumentSheet.Options<Item>>();
expectTypeOf(itemDocumentOwnershipConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<DocumentOwnershipConfig.DocumentOwnershipConfigData>>
>();
expectTypeOf(itemDocumentOwnershipConfig.render(true)).toEqualTypeOf<ActorDocumentOwnershipConfig>();
