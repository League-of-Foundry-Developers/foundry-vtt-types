import { afterAll, describe, expect, expectTypeOf, test } from "vitest";

import WorldSettings = foundry.documents.collections.WorldSettings;

describe("WorldSettings Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const setting = await Setting.implementation.create({ key: "core.worldSettingsTestSetting" });
  if (!setting) throw new Error("Failed to create test Setting");
  docsToCleanUp.add(setting);

  const settingImpl = new Setting.implementation({ key: "core.worldSettingsTestSetting" });
  const settingSource = setting.toObject();

  const actor = await Actor.implementation.create({ name: "Settings Collection Test Actor", type: "base" });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource: Actor.Source = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new WorldSettings();
    new WorldSettings([settingSource]);

    // @ts-expect-error `Actor` data not assignable to `Setting` data
    new WorldSettings([actorSource]);
  });

  const settings = new WorldSettings([settingSource]);

  test("Inheritance", () => {
    expectTypeOf(settings).toExtend<Collection.Any>();
    expectTypeOf(WorldSettings).toExtend<Collection.AnyConstructor>();
    expect(settings).toBeInstanceOf(Collection);
    expectTypeOf(settings).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(WorldSettings).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(settings).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(settings).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(WorldSettings).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(settings).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

  test("Miscellaneous", () => {
    expectTypeOf(WorldSettings.documentName).toEqualTypeOf<"Setting">();
    expectTypeOf(WorldSettings.instance).toEqualTypeOf<WorldSettings.Implementation>();
    expectTypeOf(settings.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(settings.directory).toEqualTypeOf<null>();
  });

  test("Getting", () => {
    expectTypeOf(settings.get("ID")).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.get("ID", {})).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Setting.Invalid | Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Setting.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(settings.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Setting.Invalid | Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Setting.Invalid | Setting.Stored
    >();
    expectTypeOf(settings.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Setting.Invalid | Setting.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(settings.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Setting.Stored>();
    expectTypeOf(settings.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Setting.Stored | undefined
    >();
    expectTypeOf(settings.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Setting.Stored | undefined
    >();
    expectTypeOf(settings.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Setting.Stored | undefined
    >();

    expectTypeOf(settings.getInvalid("ID")).toEqualTypeOf<Setting.Invalid>();
    expectTypeOf(settings.getInvalid("ID", {})).toEqualTypeOf<Setting.Invalid>();
    expectTypeOf(settings.getInvalid("ID", { strict: false })).toEqualTypeOf<Setting.Invalid | undefined>();
    expectTypeOf(settings.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Setting.Invalid>();
    expectTypeOf(settings.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Setting.Invalid>();
    expectTypeOf(settings.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Setting.Invalid | undefined>();
    expectTypeOf(settings.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Setting.Invalid | undefined>();

    expectTypeOf(settings.getName("name")).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getName("name", {})).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getName("name", { strict: true })).toEqualTypeOf<Setting.Stored>();
    expectTypeOf(settings.getName("name", { strict: undefined })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Setting.Stored | undefined>();

    expectTypeOf(settings.getSetting("key")).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getSetting("key", null)).toEqualTypeOf<Setting.Stored | undefined>();
    expectTypeOf(settings.getSetting("key", "userID")).toEqualTypeOf<Setting.Stored | undefined>();

    expectTypeOf(settings.getItem("key")).toEqualTypeOf<string | null>();
    expectTypeOf(settings.getItem("key", null)).toEqualTypeOf<string | null>();
    expectTypeOf(settings.getItem("key")).toEqualTypeOf<string | null>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    settings.set("ID", settingImpl);
    // @ts-expect-error `Actor`s are not `Setting`s
    settings.set("ID", actor);

    expectTypeOf(settings.set("ID", setting)).toEqualTypeOf<typeof settings>();

    expectTypeOf(settings.delete("ID")).toBeBoolean();
  });

  test("importDocument fake override", async () => {
    // `Setting`s don't have subtypes
    const imported1 = await settings.importDocument(setting, {});
    if (!imported1) throw new Error("Failed to create test `Setting` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<Setting.Stored>();
  });

  test("_prepareImportDocument", () => {
    // @ts-expect-error _prepareImportDocument will throw if not passed an object for `options`, because it lacks a signature default.
    expect(() => settings["_prepareImportDocument"](setting)).toThrow();

    expectTypeOf(settings["_prepareImportDocument"](settingImpl, {})).toEqualTypeOf<
      Omit<Setting.Source, "sort" | "navOrder" | "active" | "_id">
    >();

    // testing the FromCompendiumReturnType
    expectTypeOf(settings["_prepareImportDocument"](setting, { keepId: true })).toEqualTypeOf<
      Omit<Setting.Source, "sort" | "navOrder" | "active">
    >();
    expectTypeOf(settings["_prepareImportDocument"](settingImpl, { clearFolder: true })).toEqualTypeOf<
      Omit<Setting.Source, "sort" | "navOrder" | "active" | "_id" | "folder">
    >();

    // also testing CreateDocumentsOperation
    expectTypeOf(
      settings["_prepareImportDocument"](settingImpl, {
        clearFolder: true,
        noHook: false,
        renderSheet: true,
        documentName: "Setting", // This should error until we update db ops, but excess properties are not being errored on here for some reason
      }),
    ).toEqualTypeOf<Omit<Setting.Source, "sort" | "navOrder" | "active" | "_id" | "folder">>();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
