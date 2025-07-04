import { expectTypeOf } from "vitest";

const combat = new Combat.implementation();

// properties
expectTypeOf(combat.turns).toEqualTypeOf<Combatant.Implementation[]>();
expectTypeOf(combat.current).toEqualTypeOf<Combat.HistoryData>();
expectTypeOf(combat.previous).toEqualTypeOf<Combat.HistoryData | undefined>();

expectTypeOf(Combat.CONFIG_SETTING).toEqualTypeOf<"combatTrackerConfig">();

expectTypeOf(combat.combatant).toEqualTypeOf<Combat.Implementation["turns"][number] | null | undefined>();
expectTypeOf(combat.started).toEqualTypeOf<boolean>();
expectTypeOf(combat.visible).toEqualTypeOf<boolean>();
expectTypeOf(combat.isActive).toEqualTypeOf<boolean>();

expectTypeOf(combat.activate()).toEqualTypeOf<Promise<Combat.Implementation[]>>();
expectTypeOf(combat.prepareDerivedData()).toEqualTypeOf<void>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(combat.getCombatantByActor("")).toEqualTypeOf<Combatant.Implementation | null>();

expectTypeOf(combat.startCombat()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.nextRound()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.previousRound()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.nextTurn()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.previousTurn()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.endCombat()).toEqualTypeOf<Promise<Combat.Implementation>>();

expectTypeOf(combat.toggleSceneLink()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.resetAll()).toEqualTypeOf<Promise<Combat.Implementation | undefined>>();

expectTypeOf(combat.rollInitiative("")).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.rollAll()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.rollNPC()).toEqualTypeOf<Promise<Combat.Implementation>>();
expectTypeOf(combat.setInitiative("", 1)).toEqualTypeOf<Promise<void>>();
expectTypeOf(combat.setupTurns()).toEqualTypeOf<Combat.Implementation["turns"]>();
expectTypeOf(combat.debounceSetup()).toEqualTypeOf<() => void>();
expectTypeOf(combat.updateCombatantActors()).toEqualTypeOf<void>();

// @LukeAbby The actual implementation here is nonsense for the available document types,
// but it shows narrowing BUT it also shows that the CreateData is odd.
class MyCombatDocumentSubclass extends Combat {
  protected override _preCreateDescendantDocuments(...args: Combat.PreCreateDescendantDocumentsArgs): void {
    super._preCreateDescendantDocuments(...args);

    const [_parent, collection, data, options, _userId] = args;

    expectTypeOf(options.keepId).toEqualTypeOf<boolean | undefined>();

    switch (collection) {
      case "combatants":
        expectTypeOf(options.combatTurn).toEqualTypeOf<number | undefined>();
        for (const d of data) {
          expectTypeOf(d.initiative).toEqualTypeOf<number | null | undefined>();
        }
        break;
      // @ts-expect-error "foobar" is not a valid collection
      case "foobar":
        break;
    }
  }
}

declare const _myCombat: MyCombatDocumentSubclass;
