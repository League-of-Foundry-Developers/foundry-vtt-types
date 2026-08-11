import { afterAll, describe, expect, expectTypeOf, test } from "vitest";

import CombatEncounters = foundry.documents.collections.CombatEncounters;

describe("CombatEncounters Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const combat = await Combat.implementation.create({});
  if (!combat) throw new Error("Failed to create test Combat.");
  docsToCleanUp.add(combat);

  const combatImpl = new Combat.implementation({ type: "base" });
  const combatSource = combat.toObject();

  const actor = await Actor.implementation.create({
    name: "CombatEncounters Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new CombatEncounters();
    new CombatEncounters([combatSource]);

    // @ts-expect-error `Actor` data not assignable to `Combat` data
    new CombatEncounters([actorSource]);
  });

  const encounters = new CombatEncounters([combatSource]);

  test("Inheritance", () => {
    expectTypeOf(encounters).toExtend<Collection.Any>();
    expectTypeOf(CombatEncounters).toExtend<Collection.AnyConstructor>();
    expect(encounters).toBeInstanceOf(Collection);
    expectTypeOf(encounters).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(CombatEncounters).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(encounters).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(encounters).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(CombatEncounters).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(encounters).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

  test("Miscellaneous", () => {
    expectTypeOf(CombatEncounters.documentName).toEqualTypeOf<"Combat">();
    expectTypeOf(CombatEncounters.instance).toEqualTypeOf<CombatEncounters.Implementation>();
    expectTypeOf(encounters.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(encounters.directory).toEqualTypeOf<typeof ui.combat>();

    expectTypeOf(CombatEncounters.settings).toEqualTypeOf<foundry.data.CombatConfiguration.SettingData>();

    expectTypeOf(encounters.combats).toEqualTypeOf<Combat.Stored[]>();
    expectTypeOf(encounters.active).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.viewed).toEqualTypeOf<Combat.Stored | null>();
  });

  test("Getting", () => {
    expectTypeOf(encounters.get("ID")).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", {})).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Combat.Invalid | Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(encounters.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Combat.Invalid | Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Combat.Invalid | Combat.Stored
    >();
    expectTypeOf(encounters.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Combat.Invalid | Combat.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(encounters.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();
    expectTypeOf(encounters.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Combat.Stored | undefined
    >();

    expectTypeOf(encounters.getInvalid("ID")).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", {})).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: false })).toEqualTypeOf<Combat.Invalid | undefined>();
    expectTypeOf(encounters.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Combat.Invalid>();
    expectTypeOf(encounters.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Combat.Invalid | undefined>();
    expectTypeOf(encounters.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Combat.Invalid | undefined>();

    expectTypeOf(encounters.getName("name")).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", {})).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: true })).toEqualTypeOf<Combat.Stored>();
    expectTypeOf(encounters.getName("name", { strict: undefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
    expectTypeOf(encounters.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Combat.Stored | undefined>();
  });

  test("importDocument fake override", async () => {
    // Passing a doc with no subtype data gets back a `Stored` without any either
    const imported1 = await encounters.importDocument(combat, {});
    if (!imported1) throw new Error("Failed to create test `Combat` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<Combat.Stored>();

    // Passing a doc with subtype info preserves it
    const imported2 = await encounters.importDocument(combatImpl, {});
    if (!imported2) throw new Error("Failed to create test `Combat` via `#importDocument`");
    docsToCleanUp.add(imported2);
    expectTypeOf(imported2).toEqualTypeOf<Combat.Stored<"base">>();
  });

  test("_prepareImportDocument", () => {
    // @ts-expect-error _prepareImportDocument will throw if not passed an object for `options`, because it lacks a signature default.
    expect(() => encounters["_prepareImportDocument"](combat)).toThrow();

    expectTypeOf(encounters["_prepareImportDocument"](combatImpl, {})).toEqualTypeOf<
      Omit<Combat.Source, "sort" | "navOrder" | "active" | "_id">
    >();

    // testing the FromCompendiumReturnType
    expectTypeOf(encounters["_prepareImportDocument"](combat, { keepId: true })).toEqualTypeOf<
      Omit<Combat.Source, "sort" | "navOrder" | "active">
    >();
    expectTypeOf(encounters["_prepareImportDocument"](combatImpl, { clearFolder: true })).toEqualTypeOf<
      Omit<Combat.Source, "sort" | "navOrder" | "active" | "_id" | "folder">
    >();

    // also testing CreateDocumentsOperation
    expectTypeOf(
      encounters["_prepareImportDocument"](combatImpl, {
        clearFolder: true,
        noHook: false,
        renderSheet: true,
        documentName: "Combat", // This should error until we update db ops, but excess properties are not being errored on here for some reason
      }),
    ).toEqualTypeOf<Omit<Combat.Source, "sort" | "navOrder" | "active" | "_id" | "folder">>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    encounters.set("ID", combatImpl);
    // @ts-expect-error `Actor`s are not `Combat`s
    encounters.set("ID", actor);

    expectTypeOf(encounters.set("ID", combat)).toEqualTypeOf<typeof encounters>();

    expectTypeOf(encounters.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
