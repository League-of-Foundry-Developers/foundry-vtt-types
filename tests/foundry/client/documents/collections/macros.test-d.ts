import { afterAll, describe, expectTypeOf, test } from "vitest";

import Macros = foundry.documents.collections.Macros;

describe("Macros Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const macro = await Macro.implementation.create({
    name: "Macros Collection Test Macro",
    type: "script",
  });
  if (!macro) throw new Error("Failed to create test Macro.");
  docsToCleanUp.add(macro);

  const macroSource = macro.toObject();

  const macroImpl = new Macro.implementation({
    name: "Macros Collection Test Macro",
    type: "script",
  });

  const actor = await Actor.implementation.create({
    name: "Macros Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Macros();
    new Macros([macroSource]);

    // @ts-expect-error `Actor` data not assignable to `Macro` data
    new Macros([actorCreateData]);
  });

  const macros = new Macros([macroSource]);

  test("Miscellaneous", () => {
    expectTypeOf(Macros.documentName).toEqualTypeOf<"Macro">();
    expectTypeOf(Macros.instance).toEqualTypeOf<Macros.Implementation>();
    expectTypeOf(macros.folders).toEqualTypeOf<Collection<Folder.Stored<"Macro">>>();
    expectTypeOf(macros.directory).toEqualTypeOf<typeof ui.macros>();
  });

  test("Getting", () => {
    expectTypeOf(macros.get("ID")).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.get("ID", {})).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Macro.Invalid | Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Macro.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(macros.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Macro.Invalid | Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Macro.Invalid | Macro.Stored
    >();
    expectTypeOf(macros.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Macro.Invalid | Macro.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(macros.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Macro.Stored>();
    expectTypeOf(macros.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Macro.Stored | undefined
    >();
    expectTypeOf(macros.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Macro.Stored | undefined
    >();
    expectTypeOf(macros.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Macro.Stored | undefined
    >();

    expectTypeOf(macros.getInvalid("ID")).toEqualTypeOf<Macro.Invalid>();
    expectTypeOf(macros.getInvalid("ID", {})).toEqualTypeOf<Macro.Invalid>();
    expectTypeOf(macros.getInvalid("ID", { strict: false })).toEqualTypeOf<Macro.Invalid | undefined>();
    expectTypeOf(macros.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Macro.Invalid>();
    expectTypeOf(macros.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Macro.Invalid>();
    expectTypeOf(macros.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Macro.Invalid | undefined>();
    expectTypeOf(macros.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Macro.Invalid | undefined>();

    expectTypeOf(macros.getName("name")).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.getName("name", {})).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.getName("name", { strict: true })).toEqualTypeOf<Macro.Stored>();
    expectTypeOf(macros.getName("name", { strict: undefined })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Macro.Stored | undefined>();
    expectTypeOf(macros.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Macro.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    macros.set("ID", macroImpl);
    // @ts-expect-error `Actor`s are not `Macro`s
    macros.set("ID", actor);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(macros.set("ID", macro)).toBeVoid();

    expectTypeOf(macros.delete("ID")).toBeBoolean();
  });

  test("fromCompendium", () => {
    const macroOrSource: Macro.Stored | Macro.Source = macroSource;

    // no deletions with these options
    expectTypeOf(
      macros.fromCompendium(macroOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Macro.Source>();

    // more thorough options testing is in the `WorldCollection` tests

    // default case - all deletions enabled except `folder`
    expectTypeOf(macros.fromCompendium(macroOrSource)).toEqualTypeOf<
      Omit<Macro.Source, "_id" | "sort" | "ownership">
    >();
    expectTypeOf(macros.fromCompendium(macroOrSource, {})).toEqualTypeOf<
      Omit<Macro.Source, "_id" | "sort" | "ownership">
    >();
    expectTypeOf(
      macros.fromCompendium(macroOrSource, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Macro.Source, "_id" | "sort" | "ownership">>();

    // @ts-expect-error `Actor.Stored`s aren't `Macro.Stored`s
    macros.fromCompendium(actor);
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
