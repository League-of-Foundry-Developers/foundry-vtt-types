import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

expectTypeOf(new foundry.documents.BaseFogExploration()).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(new foundry.documents.BaseFogExploration({})).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(foundry.documents.BaseFogExploration.create({})).toEqualTypeOf<
  Promise<Document.Stored<FogExploration> | undefined>
>();
expectTypeOf(foundry.documents.BaseFogExploration.createDocuments()).toEqualTypeOf<
  Promise<Document.Stored<FogExploration>[]>
>();
expectTypeOf(foundry.documents.BaseFogExploration.updateDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();
expectTypeOf(foundry.documents.BaseFogExploration.deleteDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();

const fog = new foundry.documents.BaseFogExploration();
expectTypeOf(fog.explored).toEqualTypeOf<string | null>();

declare const scene: Scene;
declare const user: User.Implementation;

new foundry.documents.BaseFogExploration({});
new foundry.documents.BaseFogExploration({
  explored: "data:image/png;base64,[…]",
  positions: {
    1350_1050: { radius: 0, limit: false },
  },
  scene: "Wr9wnTV5otwMKAil",
  timestamp: 1626341030569,
  user: "NlBhrPq62QrMErNh",
});
new foundry.documents.BaseFogExploration({
  scene: scene,
});

// @ts-expect-error - `new` must be used.
foundry.documents.BaseFogExploration({ user: user });

new foundry.documents.BaseFogExploration({
  explored: null,
  positions: null,
  scene: null,
  timestamp: null,
  user: null,
  _id: null,
});
new foundry.documents.BaseFogExploration({
  explored: undefined,
  positions: undefined,
  scene: undefined,
  timestamp: undefined,
  user: undefined,
  _id: undefined,
});
new foundry.documents.BaseFogExploration({});
const data = new foundry.documents.BaseFogExploration();

expectTypeOf(data.explored).toEqualTypeOf<string | null>();
expectTypeOf(data.positions).toEqualTypeOf<object>();
expectTypeOf(data.scene).toEqualTypeOf<Scene | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>(); // FIXME: Initial prevents undefined results
expectTypeOf(data.user).toEqualTypeOf<User.Implementation | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
