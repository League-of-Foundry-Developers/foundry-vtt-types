import { expectTypeOf } from "vitest";
// import type { ArmorData, WeaponData } from "./item.test-d";

const actor = new Actor({ name: "Beren", type: "base" });

expectTypeOf(actor.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(actor.getActiveTokens(true, true)).toEqualTypeOf<TokenDocument[]>();
expectTypeOf(actor.getActiveTokens(true, false)).toEqualTypeOf<Token[]>();

// TODO: Implement #1551 so the `system` properties resolve correctly.
expectTypeOf(actor.itemTypes.weapon[0]!.type).toEqualTypeOf<"weapon">();
// expectTypeOf(actor.itemTypes.weapon[0]!.system).toEqualTypeOf<WeaponData>();
expectTypeOf(actor.itemTypes.armor[0]!.type).toEqualTypeOf<"armor">();
// expectTypeOf(actor.itemTypes.armor[0]!.system).toEqualTypeOf<ArmorData>();
for (const effect of actor.allApplicableEffects()) {
  expectTypeOf(effect).toEqualTypeOf<ActiveEffect>();
}
