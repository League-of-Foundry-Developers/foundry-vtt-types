import { expectTypeOf } from "vitest";

declare const scene: Scene;
declare const user: User;

new foundry.data.FogExplorationData({});
new foundry.data.FogExplorationData({
  explored: "data:image/png;base64,[…]",
  positions: {
    1350_1050: { radius: 0, limit: false },
  },
  scene: "Wr9wnTV5otwMKAil",
  timestamp: 1626341030569,
  user: "NlBhrPq62QrMErNh",
});
new foundry.data.FogExplorationData({
  scene: scene,
});

// @ts-expect-error - `new` must be used.
foundry.data.FogExplorationData({ user: user });

new foundry.data.FogExplorationData({
  explored: null,
  positions: null,
  scene: null,
  timestamp: null,
  user: null,
  _id: null,
});
new foundry.data.FogExplorationData({
  explored: undefined,
  positions: undefined,
  scene: undefined,
  timestamp: undefined,
  user: undefined,
  _id: undefined,
});
new foundry.data.FogExplorationData({});
const data = new foundry.data.FogExplorationData();

expectTypeOf(data.explored).toEqualTypeOf<string | null>();
expectTypeOf(data.positions).toEqualTypeOf<Record<string, { radius: number; limit: boolean }>>();
expectTypeOf(data.scene).toEqualTypeOf<string | null>();
expectTypeOf(data.timestamp).toEqualTypeOf<number>();
expectTypeOf(data.user).toEqualTypeOf<string | null>();
expectTypeOf(data._id).toEqualTypeOf<string | null>();
