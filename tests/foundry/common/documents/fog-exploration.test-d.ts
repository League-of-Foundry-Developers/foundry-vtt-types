import { expectTypeOf } from "vitest";

class TestBaseFogExploration extends foundry.documents.BaseFogExploration {}

expectTypeOf(new TestBaseFogExploration()).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(new TestBaseFogExploration({})).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(TestBaseFogExploration.create({})).toEqualTypeOf<Promise<FogExploration.Stored | undefined>>();
expectTypeOf(TestBaseFogExploration.createDocuments()).toEqualTypeOf<Promise<FogExploration.Stored[]>>();
expectTypeOf(TestBaseFogExploration.updateDocuments()).toEqualTypeOf<Promise<FogExploration.Implementation[]>>();
expectTypeOf(TestBaseFogExploration.deleteDocuments()).toEqualTypeOf<Promise<FogExploration.Implementation[]>>();

const fog = new TestBaseFogExploration();
expectTypeOf(fog.explored).toEqualTypeOf<string | null>();

declare const scene: Scene.Implementation;
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
declare const data: TestBaseFogExploration;

expectTypeOf(data.explored).toEqualTypeOf<string | null>();
expectTypeOf(data.positions).toEqualTypeOf<object>();
expectTypeOf(data.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>(); // FIXME: Initial prevents undefined results
expectTypeOf(data.user).toEqualTypeOf<User.Implementation | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
