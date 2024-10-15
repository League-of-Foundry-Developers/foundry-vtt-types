import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const combatant = new Combatant({}, {});

// properties
expectTypeOf(combatant.pack).toEqualTypeOf<string | null>();
expectTypeOf(combatant.parent).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.combat).toEqualTypeOf<Combat | null>();
expectTypeOf(combatant.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(combatant.token).toEqualTypeOf<TokenDocument | null>();
expectTypeOf(combatant.apps).toEqualTypeOf<Record<string, Application>>();

// static properties
expectTypeOf(Combatant.create({ name: "Some Combatant" })).toEqualTypeOf<
  Promise<Document.Stored<Combatant> | undefined>
>();
expectTypeOf(Combatant.createDocuments([])).toEqualTypeOf<Promise<Document.Stored<Combatant>[]>>();
expectTypeOf(Combatant.updateDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
expectTypeOf(Combatant.deleteDocuments([])).toEqualTypeOf<Promise<Combatant[]>>();
