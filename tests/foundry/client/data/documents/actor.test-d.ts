import { expectTypeOf } from "vitest";
// import type { ArmorData, WeaponData } from "./item.test-d";

// @ts-expect-error - Actor requires name.
new Actor();

// @ts-expect-error - Actor requires name.
new Actor({});

const actor = new Actor({ name: "Beren", type: "base" });
expectTypeOf(actor).toEqualTypeOf<Actor>();

expectTypeOf(actor.overrides).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(actor.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(actor.thumbnail).toEqualTypeOf<typeof actor.img>();
expectTypeOf(actor.itemTypes).toEqualTypeOf<{
  [K in foundry.documents.BaseItem["type"]]: Array<Item.ConfiguredInstance & { type: K }>;
}>();

expectTypeOf(actor.isToken).toEqualTypeOf<boolean>();
expectTypeOf(actor.appliedEffects).toEqualTypeOf<ActiveEffect[]>();
expectTypeOf(actor.temporaryEffects).toEqualTypeOf<ReturnType<(typeof actor)["effects"]["filter"]>>();
expectTypeOf(actor.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(actor.inCombat).toEqualTypeOf<boolean>();

expectTypeOf(actor.applyActiveEffects()).toEqualTypeOf<void>();
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

expectTypeOf(actor.getRollData()).toEqualTypeOf<object>();
expectTypeOf(actor.getTokenImages()).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(actor.modifyTokenAttribute("", 2, true, true)).toEqualTypeOf<Promise<Actor | undefined>>();

expectTypeOf(actor.prepareEmbeddedDocuments()).toEqualTypeOf<void>();

expectTypeOf(actor.rollInitiative()).toEqualTypeOf<Promise<void>>();
expectTypeOf(actor.getDependentTokens()).toEqualTypeOf<TokenDocument[]>();
