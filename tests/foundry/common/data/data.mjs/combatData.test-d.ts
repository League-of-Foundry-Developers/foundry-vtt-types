import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.data.CombatData()).toEqualTypeOf<foundry.data.CombatData>();
expectTypeOf(new foundry.data.CombatData({})).toEqualTypeOf<foundry.data.CombatData>();
expectTypeOf(new foundry.data.CombatData({ scene: "foo", active: true })).toEqualTypeOf<foundry.data.CombatData>();
