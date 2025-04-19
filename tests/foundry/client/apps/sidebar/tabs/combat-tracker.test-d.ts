import { expectTypeOf } from "vitest";

const combatTracker = new CombatTracker();
expectTypeOf(CombatTracker.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(combatTracker.options).toEqualTypeOf<Application.Options>();
expectTypeOf(combatTracker.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(combatTracker.render(true)).toEqualTypeOf<CombatTracker>();

expectTypeOf(combatTracker.viewed).toEqualTypeOf<Document.Stored<Combat.Implementation> | null>();
expectTypeOf(combatTracker.combats).toEqualTypeOf<Document.Stored<Combat.Implementation>[]>();
expectTypeOf(combatTracker.createPopout()).toEqualTypeOf<CombatTracker>();
