import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(new foundry.documents.BaseFogExploration()).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(new foundry.documents.BaseFogExploration({})).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(foundry.documents.BaseFogExploration.create({})).toEqualTypeOf<
  Promise<StoredDocument<FogExploration> | undefined>
>();
expectTypeOf(foundry.documents.BaseFogExploration.createDocuments()).toEqualTypeOf<
  Promise<StoredDocument<FogExploration>[]>
>();
expectTypeOf(foundry.documents.BaseFogExploration.updateDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();
expectTypeOf(foundry.documents.BaseFogExploration.deleteDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();

const fog = new foundry.documents.BaseFogExploration();
expectTypeOf(fog.explored).toEqualTypeOf<string | null>();
