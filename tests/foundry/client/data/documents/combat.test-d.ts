import { expectTypeOf } from "vitest";

const combat = new Combat();

// properties
expectTypeOf(combat.turns).toEqualTypeOf<Combatant[]>();
expectTypeOf(combat.current).toEqualTypeOf<CombatHistoryData>();
expectTypeOf(combat.previous).toEqualTypeOf<CombatHistoryData>();

expectTypeOf(Combat.CONFIG_SETTING).toEqualTypeOf<"combatTrackerConfig">();

expectTypeOf(combat.combatant).toEqualTypeOf<Combat["turns"][number] | undefined>();
expectTypeOf(combat.started).toEqualTypeOf<boolean>();
expectTypeOf(combat.visible).toEqualTypeOf<true>();
expectTypeOf(combat.isActive).toEqualTypeOf<boolean>();

expectTypeOf(combat.activate()).toEqualTypeOf<Promise<Combat[]>>();
expectTypeOf(combat.prepareDerivedData()).toEqualTypeOf<void>();

expectTypeOf(combat.getCombatantByActor("")).toEqualTypeOf<Combatant | undefined>();

expectTypeOf(combat.startCombat()).toEqualTypeOf<Promise<Combat>>();
expectTypeOf(combat.nextRound()).toEqualTypeOf<Promise<Combat | undefined>>();
expectTypeOf(combat.previousRound()).toEqualTypeOf<Promise<Combat | undefined>>();
expectTypeOf(combat.nextTurn()).toEqualTypeOf<Promise<Combat | undefined>>();
expectTypeOf(combat.previousTurn()).toEqualTypeOf<Promise<Combat | undefined>>();
expectTypeOf(combat.endCombat()).toEqualTypeOf<Promise<Combat | undefined>>();

expectTypeOf(combat.toggleSceneLink()).toEqualTypeOf<Promise<Combat | undefined>>();
expectTypeOf(combat.resetAll()).toEqualTypeOf<Promise<Combat | undefined>>();

expectTypeOf(combat.rollInitiative("")).toEqualTypeOf<Promise<Combat>>();
expectTypeOf(combat.rollAll()).toEqualTypeOf<Promise<Combat>>();
expectTypeOf(combat.rollNPC()).toEqualTypeOf<Promise<Combat>>();
expectTypeOf(combat.setInitiative("", 1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(combat.setupTurns()).toEqualTypeOf<Combat["turns"]>();
expectTypeOf(combat.debounceSetup()).toEqualTypeOf<ReturnType<typeof foundry.utils.debounce>>();
expectTypeOf(combat.updateCombatantActors()).toEqualTypeOf<void>();
