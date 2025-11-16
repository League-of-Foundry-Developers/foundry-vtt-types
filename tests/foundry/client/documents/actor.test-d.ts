import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { ArmorData, WeaponData } from "./item.test-d";

// @ts-expect-error Actor requires name.
new Actor.implementation();

// @ts-expect-error Actor requires name.
new Actor.implementation({});

const actor = new Actor.implementation({ name: "Beren", type: "base" });
expectTypeOf(actor).toEqualTypeOf<Actor.OfType<"base">>();

expectTypeOf(actor.overrides).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(actor.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(actor.thumbnail).toEqualTypeOf<typeof actor.img>();
expectTypeOf(actor.itemTypes).toEqualTypeOf<Actor.ItemTypes>();

expectTypeOf(actor.isToken).toEqualTypeOf<boolean>();
expectTypeOf(actor.appliedEffects).toEqualTypeOf<ActiveEffect.Implementation[]>();
expectTypeOf(actor.temporaryEffects).toEqualTypeOf<ReturnType<typeof actor.effects.filter>>();
expectTypeOf(actor.token).toEqualTypeOf<TokenDocument.Implementation | null>();
expectTypeOf(actor.inCombat).toEqualTypeOf<boolean>();

expectTypeOf(actor.applyActiveEffects()).toEqualTypeOf<void>();
expectTypeOf(actor.getActiveTokens(false)).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(actor.getActiveTokens(false, Math.random() > 0.5)).toEqualTypeOf<
  Token.Implementation[] | TokenDocument.Implementation[]
>();
expectTypeOf(actor.getActiveTokens(true, true)).toEqualTypeOf<TokenDocument.Implementation[]>();
expectTypeOf(actor.getActiveTokens(true, false)).toEqualTypeOf<Token.Implementation[]>();

expectTypeOf(actor.itemTypes.weapon![0]!.type).toEqualTypeOf<"weapon">();
expectTypeOf(actor.itemTypes.weapon![0]!.system).toEqualTypeOf<WeaponData>();
expectTypeOf(actor.itemTypes.armor[0]!.type).toEqualTypeOf<"armor">();
expectTypeOf(actor.itemTypes.armor[0]!.system).toEqualTypeOf<ArmorData>();

for (const effect of actor.allApplicableEffects()) {
  expectTypeOf(effect).toEqualTypeOf<ActiveEffect.Implementation>();
}

expectTypeOf(actor.getRollData()).toEqualTypeOf<AnyObject>();
expectTypeOf(actor.getTokenImages()).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(actor.modifyTokenAttribute("", 2, true, true)).toEqualTypeOf<Promise<Actor.OfType<"base"> | undefined>>();

expectTypeOf(actor.prepareEmbeddedDocuments()).toEqualTypeOf<void>();

expectTypeOf(actor.rollInitiative()).toEqualTypeOf<Promise<Combat.Implementation | null>>();
expectTypeOf(actor.getDependentTokens()).toEqualTypeOf<TokenDocument.Implementation[]>();

test("actor system update", () => {
  // Note(LukeAbby): This test _should_ fail at some point. Specifically it should require `==type`
  // as well.
  actor.update({
    "==system": {},
  });
});
