import { expectTypeOf } from "vitest";

const combatTracker = new CombatTracker();
expectTypeOf(CombatTracker.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(combatTracker.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(combatTracker.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(combatTracker.render(true)).toEqualTypeOf<CombatTracker>();

expectTypeOf(combatTracker.viewed).toEqualTypeOf<Document.Stored<Combat> | null>();
expectTypeOf(combatTracker.combats).toEqualTypeOf<Document.Stored<Combat>[]>();
expectTypeOf(combatTracker.createPopout()).toEqualTypeOf<CombatTracker>();
