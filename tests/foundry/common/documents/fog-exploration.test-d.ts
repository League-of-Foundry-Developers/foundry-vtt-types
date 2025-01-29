import { expectTypeOf } from "vitest";

class TestBaseFogExploration extends foundry.documents.BaseFogExploration {}

expectTypeOf(new TestBaseFogExploration()).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(new TestBaseFogExploration({})).toEqualTypeOf<foundry.documents.BaseFogExploration>();
expectTypeOf(foundry.documents.BaseFogExploration.create({})).toEqualTypeOf<
  Promise<FogExploration.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseFogExploration.createDocuments()).toEqualTypeOf<Promise<FogExploration.Stored[]>>();
expectTypeOf(foundry.documents.BaseFogExploration.updateDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();
expectTypeOf(foundry.documents.BaseFogExploration.deleteDocuments()).toEqualTypeOf<Promise<FogExploration[]>>();

const fog = new TestBaseFogExploration();
expectTypeOf(fog.explored).toEqualTypeOf<string | null>();

declare const scene: Scene;
declare const user: User.Implementation;

new TestBaseFogExploration({});
new TestBaseFogExploration({
  explored: "data:image/png;base64,[…]",
  positions: {
    1350_1050: { radius: 0, limit: false },
  },
  scene: "Wr9wnTV5otwMKAil",
  timestamp: 1626341030569,
  user: "NlBhrPq62QrMErNh",
});
new TestBaseFogExploration({
  scene: scene,
});

// @ts-expect-error - `new` must be used.
TestBaseFogExploration({ user: user });

new TestBaseFogExploration({
  explored: null,
  positions: null,
  scene: null,
  timestamp: null,
  user: null,
  _id: null,
});
new TestBaseFogExploration({
  explored: undefined,
  positions: undefined,
  scene: undefined,
  timestamp: undefined,
  user: undefined,
  _id: undefined,
});
new TestBaseFogExploration({});
declare const data: foundry.documents.BaseFogExploration;

expectTypeOf(data.explored).toEqualTypeOf<string | null>();
expectTypeOf(data.positions).toEqualTypeOf<object>();
expectTypeOf(data.scene).toEqualTypeOf<Scene | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>(); // FIXME: Initial prevents undefined results
expectTypeOf(data.user).toEqualTypeOf<User.Implementation | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
