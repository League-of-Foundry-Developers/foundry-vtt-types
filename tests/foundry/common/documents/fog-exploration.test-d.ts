import { expectTypeOf } from "vitest";
import type { AnyObject } from "../../../../src/utils/index.d.mts";

class TestBaseFogExploration extends foundry.documents.BaseFogExploration {}

expectTypeOf(new TestBaseFogExploration()).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(new TestBaseFogExploration({})).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(TestBaseFogExploration.create({})).toEqualTypeOf<Promise<FogExploration.Stored | undefined>>();
expectTypeOf(TestBaseFogExploration.createDocuments(undefined)).toEqualTypeOf<Promise<FogExploration.Stored[]>>();
expectTypeOf(TestBaseFogExploration.updateDocuments(undefined)).toEqualTypeOf<
  Promise<FogExploration.Implementation[]>
>();
expectTypeOf(TestBaseFogExploration.deleteDocuments(undefined)).toEqualTypeOf<
  Promise<FogExploration.Implementation[]>
>();

const fog = new TestBaseFogExploration();
expectTypeOf(fog.explored).toEqualTypeOf<string | null>();

declare const scene: Scene.Stored;
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
expectTypeOf(data.positions).toEqualTypeOf<AnyObject>();
expectTypeOf(data.scene).toEqualTypeOf<Scene.Stored | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>();
expectTypeOf(data.user).toEqualTypeOf<User.Stored | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
