import { expectTypeOf } from "vitest";
import type { AnyObject } from "../../../../../src/utils/index.d.mts";
// import type { ArmorData, WeaponData } from "./item.test-d";

// @ts-expect-error - Actor requires name.
new Actor();

// @ts-expect-error - Actor requires name.
new Actor({});

const actor = new Actor.implementation({ name: "Beren", type: "base" });
expectTypeOf(actor).toEqualTypeOf<Actor.Implementation>();

expectTypeOf(actor.overrides).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(actor.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(actor.thumbnail).toEqualTypeOf<typeof actor.img>();
expectTypeOf(actor.itemTypes).toEqualTypeOf<Actor.ItemTypes>();

expectTypeOf(actor.isToken).toEqualTypeOf<boolean>();
expectTypeOf(actor.appliedEffects).toEqualTypeOf<ActiveEffect[]>();
expectTypeOf(actor.temporaryEffects).toEqualTypeOf<ReturnType<(typeof actor)["effects"]["filter"]>>();
expectTypeOf(actor.token).toEqualTypeOf<TokenDocument.Implementation | null>();
expectTypeOf(actor.inCombat).toEqualTypeOf<boolean>();

expectTypeOf(actor.applyActiveEffects()).toEqualTypeOf<void>();
expectTypeOf(actor.getActiveTokens(false)).toEqualTypeOf<Token.Object[]>();
expectTypeOf(actor.getActiveTokens(false, Math.random() > 0.5)).toEqualTypeOf<
  Token.Object[] | TokenDocument.Implementation[]
>();
expectTypeOf(actor.getActiveTokens(true, true)).toEqualTypeOf<TokenDocument.Implementation[]>();
expectTypeOf(actor.getActiveTokens(true, false)).toEqualTypeOf<Token.Object[]>();

// TODO: Implement #1551 so the `system` properties resolve correctly.
expectTypeOf(actor.itemTypes.weapon[0]!.type).toEqualTypeOf<"weapon">();
// expectTypeOf(actor.itemTypes.weapon[0]!.system).toEqualTypeOf<WeaponData>();
expectTypeOf(actor.itemTypes.armor[0]!.type).toEqualTypeOf<"armor">();
// expectTypeOf(actor.itemTypes.armor[0]!.system).toEqualTypeOf<ArmorData>();
for (const effect of actor.allApplicableEffects()) {
  expectTypeOf(effect).toEqualTypeOf<ActiveEffect>();
}

expectTypeOf(actor.getRollData()).toEqualTypeOf<AnyObject>();
expectTypeOf(actor.getTokenImages()).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(actor.modifyTokenAttribute("", 2, true, true)).toEqualTypeOf<Promise<Actor.Implementation | undefined>>();

expectTypeOf(actor.prepareEmbeddedDocuments()).toEqualTypeOf<void>();

expectTypeOf(actor.rollInitiative()).toEqualTypeOf<Promise<void>>();
expectTypeOf(actor.getDependentTokens()).toEqualTypeOf<TokenDocument.Implementation[]>();
