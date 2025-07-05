import { expectTypeOf } from "vitest";
import type { Roll } from "#client/dice/_module.d.mts";

const combatant = new Combatant.implementation({}, { parent: new Combat.implementation() });

// properties
expectTypeOf(combatant.pack).toEqualTypeOf<string | null>();
expectTypeOf(combatant.parent).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(combatant.combat).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(combatant.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(combatant.token).toEqualTypeOf<TokenDocument.Implementation | null>();
expectTypeOf(combatant.players).toEqualTypeOf<User.Implementation[]>();
expectTypeOf(combatant.isDefeated).toEqualTypeOf<boolean>();

declare const user: User.Implementation;
expectTypeOf(
  combatant.testUserPermission(user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT),
).toEqualTypeOf<boolean>();

expectTypeOf(combatant.getInitiativeRoll()).toEqualTypeOf<Roll.Implementation>();
expectTypeOf(combatant.rollInitiative("")).toEqualTypeOf<Promise<Combatant.Implementation | undefined>>();

expectTypeOf(combatant.prepareDerivedData()).toEqualTypeOf<void>();

// static properties
expectTypeOf(Combatant.create({ name: "Some Combatant" })).toEqualTypeOf<Promise<Combatant.Stored | undefined>>();
expectTypeOf(Combatant.createDocuments([])).toEqualTypeOf<Promise<Combatant.Stored[]>>();
expectTypeOf(Combatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
expectTypeOf(Combatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant.Implementation[]>>();
