import { describe, expectTypeOf, test } from "vitest";

import WorldSettings = foundry.documents.collections.WorldSettings;

declare const settingCreateData: Setting.CreateData;
declare const settingSource: Setting.Source;
declare const stack: Setting.Stored;
declare const settingImpl: Setting.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("WorldSettings Tests", () => {
  test("Construction", () => {
    new WorldSettings();
    new WorldSettings([settingCreateData]);
    new WorldSettings([settingSource]);

    // @ts-expect-error `Actor` data not assignable to `Setting` data
    new WorldSettings([actorCreateData]);
  });

  const settings = new WorldSettings([settingCreateData]);

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
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(settings.set("ID", stack)).toBeVoid();

    expectTypeOf(settings.delete("ID")).toBeBoolean();
  });
});
