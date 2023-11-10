import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.data.CombatantData()).toEqualTypeOf<foundry.data.CombatantData>();
expectTypeOf(new foundry.data.CombatantData({})).toEqualTypeOf<foundry.data.CombatantData>();
expectTypeOf(
  new foundry.data.CombatantData({ tokenId: "foo", actorId: "bar" }),
).toEqualTypeOf<foundry.data.CombatantData>();
