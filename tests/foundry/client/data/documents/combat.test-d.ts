import { expectTypeOf } from "vitest";

const combat = new Combat();

// properties
expectTypeOf(combat.turns).toEqualTypeOf<Combatant.Implementation[]>();
expectTypeOf(combat.current).toEqualTypeOf<Combat.HistoryData>();
expectTypeOf(combat.previous).toEqualTypeOf<Combat.HistoryData>();

expectTypeOf(Combat.CONFIG_SETTING).toEqualTypeOf<"combatTrackerConfig">();

expectTypeOf(combat.combatant).toEqualTypeOf<Combat["turns"][number] | undefined>();
expectTypeOf(combat.started).toEqualTypeOf<boolean>();
expectTypeOf(combat.visible).toEqualTypeOf<true>();
expectTypeOf(combat.isActive).toEqualTypeOf<boolean>();

expectTypeOf(combat.activate()).toEqualTypeOf<Promise<Combat.Implementation[]>>();
expectTypeOf(combat.prepareDerivedData()).toEqualTypeOf<void>();

expectTypeOf(combat.getCombatantByActor("")).toEqualTypeOf<Combatant.Implementation | undefined>();

expectTypeOf(combat.startCombat()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.nextRound()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();
expectTypeOf(combat.previousRound()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();
expectTypeOf(combat.nextTurn()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();
expectTypeOf(combat.previousTurn()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();
expectTypeOf(combat.endCombat()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();

expectTypeOf(combat.toggleSceneLink()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();
expectTypeOf(combat.resetAll()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();

expectTypeOf(combat.rollInitiative("")).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.rollAll()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.rollNPC()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.setInitiative("", 1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(combat.setupTurns()).toEqualTypeOf<Combat["turns"]>();
expectTypeOf(combat.debounceSetup()).toEqualTypeOf<ReturnType<typeof foundry.utils.debounce>>();
expectTypeOf(combat.updateCombatantActors()).toEqualTypeOf<void>();
