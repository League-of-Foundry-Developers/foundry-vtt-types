import { afterAll, describe, expectTypeOf, test } from "vitest";

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
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(settings.set("ID", setting)).toBeVoid();

    expectTypeOf(settings.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
