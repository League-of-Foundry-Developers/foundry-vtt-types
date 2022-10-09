import { expectType } from "tsd";

expectType<foundry.documents.BaseFogExploration>(new foundry.documents.BaseFogExploration());
expectType<foundry.documents.BaseFogExploration>(new foundry.documents.BaseFogExploration({}));
expectType<Promise<StoredDocument<FogExploration> | undefined>>(foundry.documents.BaseFogExploration.create({}));
expectType<Promise<StoredDocument<FogExploration>[]>>(foundry.documents.BaseFogExploration.createDocuments());
expectType<Promise<FogExploration[]>>(foundry.documents.BaseFogExploration.updateDocuments());
expectType<Promise<FogExploration[]>>(foundry.documents.BaseFogExploration.deleteDocuments());

const folder = new foundry.documents.BaseFogExploration();
expectType<foundry.data.FogExplorationData>(folder.data);
