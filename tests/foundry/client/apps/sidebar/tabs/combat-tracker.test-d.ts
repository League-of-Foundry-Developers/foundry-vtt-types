import { expectTypeOf } from "vitest";

const combatTracker = new CombatTracker();
expectTypeOf(CombatTracker.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(combatTracker.options).toEqualTypeOf<Application.Options>();
expectTypeOf(combatTracker.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(combatTracker.render(true)).toEqualTypeOf<CombatTracker>();

expectTypeOf(combatTracker.viewed).toEqualTypeOf<Combat.Stored | null>();
expectTypeOf(combatTracker.combats).toEqualTypeOf<Combat.Stored[]>();
expectTypeOf(combatTracker.createPopout()).toEqualTypeOf<CombatTracker>();
