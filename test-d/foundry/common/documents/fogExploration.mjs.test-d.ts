import { expectError, expectType } from 'tsd';

expectType<foundry.documents.BaseFogExploration>(new foundry.documents.BaseFogExploration());
expectType<foundry.documents.BaseFogExploration>(new foundry.documents.BaseFogExploration({}));
expectType<Promise<StoredDocument<FogExploration> | undefined>>(foundry.documents.BaseFogExploration.create({}));
expectType<Promise<StoredDocument<FogExploration>[]>>(foundry.documents.BaseFogExploration.createDocuments());
expectType<Promise<FogExploration[]>>(foundry.documents.BaseFogExploration.updateDocuments());
expectType<Promise<FogExploration[]>>(foundry.documents.BaseFogExploration.deleteDocuments());

const folder = new foundry.documents.BaseFogExploration();
expectType<foundry.documents.BaseFogExploration['data']>(folder.data);

declare const scene: Scene;
declare const user: User;

new foundry.documents.BaseFogExploration({});
new foundry.documents.BaseFogExploration({
  explored: 'data:image/png;base64,[…]',
  positions: {
    1350_1050: { radius: 0, limit: false }
  },
  scene: 'Wr9wnTV5otwMKAil',
  timestamp: 1626341030569,
  user: 'NlBhrPq62QrMErNh'
});
new foundry.documents.BaseFogExploration({
  scene: scene
});
expectError(foundry.documents.BaseFogExploration({ user: user }));
new foundry.documents.BaseFogExploration({
  explored: null,
  positions: null,
  scene: null,
  timestamp: null,
  user: null,
  _id: null
});
new foundry.documents.BaseFogExploration({
  explored: undefined,
  positions: undefined,
  scene: undefined,
  timestamp: undefined,
  user: undefined,
  _id: undefined
});
new foundry.documents.BaseFogExploration({});
const data = new foundry.documents.BaseFogExploration();

expectType<string | null>(data.explored);
expectType<Record<string, { radius: number; limit: boolean }>>(data.positions);
expectType<string | null>(data.scene);
expectType<number>(data.timestamp);
expectType<string | null>(data.user);
expectType<string | null>(data._id);
