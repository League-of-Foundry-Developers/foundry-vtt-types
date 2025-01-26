import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const combatant = new Combatant({}, {});

// properties
expectTypeOf(combatant.pack).toEqualTypeOf<string | null>();
expectTypeOf(combatant.parent).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.combat).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(combatant.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(combatant.players).toEqualTypeOf<User.Implementation[]>();
expectTypeOf(combatant.isDefeated).toEqualTypeOf<boolean>();

declare const user: foundry.documents.BaseUser;
expectTypeOf(
  combatant.testUserPermission(user, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS.INHERIT),
).toEqualTypeOf<boolean>();

expectTypeOf(combatant.getInitiativeRoll()).toEqualTypeOf<Roll>();
expectTypeOf(combatant.rollInitiative("")).toEqualTypeOf<Promise<Combatant | undefined>>();

expectTypeOf(combatant.prepareDerivedData()).toEqualTypeOf<void>();

// static properties
expectTypeOf(Combatant.create({ name: "Some Combatant" })).toEqualTypeOf<
  Promise<Combatant.Stored | undefined>
>();
expectTypeOf(Combatant.createDocuments([])).toEqualTypeOf<Promise<Combatant.Stored[] | undefined>>();
expectTypeOf(Combatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
expectTypeOf(Combatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
