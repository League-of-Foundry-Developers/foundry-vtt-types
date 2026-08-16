import { expectTypeOf, test } from "vitest";
import type { AnyObject, DiscriminatedUnion } from "fvtt-types/utils";
import type { ArmorData, WeaponData } from "./item.test-d";

import Token = foundry.canvas.placeables.Token;
import ForcedReplacement = foundry.data.operators.ForcedReplacement;
import ForcedDeletion = foundry.data.operators.ForcedDeletion;

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
expectTypeOf(actor.appliedEffects).toEqualTypeOf<ActiveEffect.Stored[]>();
expectTypeOf(actor.temporaryEffects).toEqualTypeOf<ActiveEffect.Stored[]>();
expectTypeOf(actor.token).toEqualTypeOf<TokenDocument.Implementation | null>();
expectTypeOf(actor.inCombat).toEqualTypeOf<boolean>();

expectTypeOf(actor.applyActiveEffects("initial")).toEqualTypeOf<void>();
expectTypeOf(actor.applyActiveEffects("final")).toEqualTypeOf<void>();
// deprecated since v14, until v16: omitting `phase` infers it
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(actor.applyActiveEffects()).toEqualTypeOf<void>();

declare const someEffects: ActiveEffect.Implementation[];
expectTypeOf(actor.onUpdateEffectDurations(someEffects, "turnEnd")).toEqualTypeOf<Promise<void>>();
expectTypeOf(actor.onUpdateEffectDurations(someEffects, "turnEnd", {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(actor.getActiveTokens(false)).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(actor.getActiveTokens(false, Math.random() > 0.5)).toEqualTypeOf<
  Token.Implementation[] | TokenDocument.Stored[]
>();
expectTypeOf(actor.getActiveTokens(true, true)).toEqualTypeOf<TokenDocument.Stored[]>();
expectTypeOf(actor.getActiveTokens(true, false)).toEqualTypeOf<Token.Implementation[]>();

expectTypeOf(actor.itemTypes.weapon![0]!.type).toEqualTypeOf<"weapon">();
expectTypeOf(actor.itemTypes.weapon![0]!.system).toEqualTypeOf<WeaponData>();
expectTypeOf(actor.itemTypes.armor[0]!.type).toEqualTypeOf<"armor">();
expectTypeOf(actor.itemTypes.armor[0]!.system).toEqualTypeOf<ArmorData>();

for (const effect of actor.allApplicableEffects()) {
  expectTypeOf(effect).toEqualTypeOf<ActiveEffect.Stored>();
}

expectTypeOf(actor.getRollData()).toEqualTypeOf<AnyObject>();
expectTypeOf(actor.getTokenImages()).toEqualTypeOf<Promise<string[]>>();
expectTypeOf(actor.modifyTokenAttribute("", 2, true, true)).toEqualTypeOf<Promise<Actor.OfType<"base"> | undefined>>();

expectTypeOf(actor.prepareEmbeddedDocuments()).toEqualTypeOf<void>();

expectTypeOf(actor.rollInitiative()).toEqualTypeOf<Promise<Combat.Stored | null>>();
expectTypeOf(actor.getDependentTokens()).toEqualTypeOf<TokenDocument.Stored[]>();

test("actor system update", () => {
  // Note(LukeAbby): This test _should_ fail at some point. Specifically it should require `==type`
  // as well.
  actor.update({
    "==system": {},
  });
});

actor.update({
  // replacing a simple type isn't terribly useful but supported.
  type: _replace("character"),
});

actor.update({
  type: "character",
  system: _replace({}),
});

Hooks.on("updateActor", (_doc, update) => {
  type System = NonNullable<Actor.CreateData["system"]>;

  expectTypeOf(update.system).toEqualTypeOf<
    | System
    | ForcedReplacement.CreateReturn<System | null | undefined>
    | (ForcedDeletion & { [K in keyof System]?: never })
    | null
    | undefined
  >();

  expectTypeOf<ForcedReplacement.CreateReturn<System | null | undefined>>().toEqualTypeOf<
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    ForcedReplacement<System | null | undefined> & DiscriminatedUnion<System | {}>
  >();
});
