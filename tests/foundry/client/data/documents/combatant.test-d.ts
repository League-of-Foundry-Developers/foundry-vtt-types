import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const combatant = new Combatant({}, {});

// static properties of `BaseCombatant`
expectTypeOf(Combatant.schema).toEqualTypeOf<typeof foundry.data.CombatantData>();

// properties
expectTypeOf(combatant.pack).toEqualTypeOf<string | null>();
expectTypeOf(combatant.parent).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.combat).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(combatant.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(combatant.apps).toEqualTypeOf<Record<string, Application>>();

// static properties
expectTypeOf(Combatant.create({ name: "Some Combatant" })).toEqualTypeOf<
  Promise<StoredDocument<Combatant> | undefined>
>();
expectTypeOf(Combatant.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Combatant>[]>>();
expectTypeOf(Combatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
expectTypeOf(Combatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
