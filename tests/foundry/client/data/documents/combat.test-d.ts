import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

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

// @LukeAbby The actual implementation here is nonsense for the available document types,
// but it shows narrowing BUT it also shows that the CreateData is odd.
class MyCombatDocumentSubclass extends Combat {
  protected override _preCreateDescendantDocuments<
    DescendantDocumentType extends Combat.DescendantClasses,
    Parent extends Combat.Stored,
    CreateData extends Document.CreateDataFor<DescendantDocumentType>,
    Operation extends foundry.abstract.types.DatabaseCreateOperation<CreateData, Parent, false>,
  >(
    parent: Parent,
    collection: DescendantDocumentType["metadata"]["collection"],
    data: CreateData[],
    options: Document.Database.CreateOptions<Operation>,
    userId: string,
  ): void {
    super._preCreateDescendantDocuments(parent, collection, data, options, userId);

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
