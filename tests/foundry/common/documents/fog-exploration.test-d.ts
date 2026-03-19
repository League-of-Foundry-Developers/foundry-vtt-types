import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

class TestBaseFogExploration extends foundry.documents.BaseFogExploration {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(
          this.pack!,
        ) as foundry.documents.collections.CompendiumCollection.ForDocument<"FogExploration">)
      : null;
  }
}

expectTypeOf(new TestBaseFogExploration()).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(new TestBaseFogExploration({})).toEqualTypeOf<TestBaseFogExploration>();
expectTypeOf(TestBaseFogExploration.create({})).toEqualTypeOf<Promise<FogExploration.Stored | undefined>>();
expectTypeOf(TestBaseFogExploration.createDocuments([])).toEqualTypeOf<Promise<FogExploration.Stored[]>>();
expectTypeOf(TestBaseFogExploration.updateDocuments([])).toEqualTypeOf<Promise<FogExploration.Stored[]>>();
expectTypeOf(TestBaseFogExploration.deleteDocuments([])).toEqualTypeOf<Promise<FogExploration.Stored[]>>();

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

// @ts-expect-error `new` must be used.
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
expectTypeOf(data.positions).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(data.scene).toEqualTypeOf<Scene.Stored | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>();
expectTypeOf(data.user).toEqualTypeOf<User.Stored | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
