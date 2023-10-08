import { expectError, expectType } from "tsd";

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
expectError(foundry.data.FogExplorationData({ user: user }));
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

expectType<string | null>(data.explored);
expectType<Record<string, { radius: number; limit: boolean }>>(data.positions);
expectType<string | null>(data.scene);
expectType<number>(data.timestamp);
expectType<string | null>(data.user);
expectType<string | null>(data._id);
