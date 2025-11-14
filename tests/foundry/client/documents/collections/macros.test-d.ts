import { describe, expectTypeOf, test } from "vitest";

import Macros = foundry.documents.collections.Macros;

declare const macroCreateData: Macro.CreateData;
declare const macroSource: Macro.Source;
declare const macro: Macro.Stored;
declare const macroImpl: Macro.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Macros Tests", () => {
  test("Construction", () => {
    new Macros();
    new Macros([macroCreateData]);
    new Macros([macroSource]);

    // @ts-expect-error `Actor` data not assignable to `Macro` data
    new Macros([actorCreateData]);
  });

  const macros = new Macros([macroCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Macros.documentName).toEqualTypeOf<"Macro">();
    expectTypeOf(Macros.instance).toEqualTypeOf<Macros.Implementation>();
    expectTypeOf(macros.folders).toEqualTypeOf<Collection<Folder.Stored<"Macro">>>();
    expectTypeOf(macros.directory).toEqualTypeOf<typeof ui.macros>();
    expectTypeOf(macros.name).toEqualTypeOf<"Macros">();
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
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(macros.set("ID", macro)).toBeVoid();

    expectTypeOf(macros.delete("ID")).toBeBoolean();
  });

  test("fromCompendium", () => {
    // no deletions with these options
    expectTypeOf(
      macros.fromCompendium(macro, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Macro.Source>();

    // more thorough options testing is in the `WorldCollection` tests

    // default case - all deletions enabled except `folder`
    expectTypeOf(macros.fromCompendium(macro)).toEqualTypeOf<Omit<Macro.Source, "_id" | "sort" | "ownership">>();
    expectTypeOf(macros.fromCompendium(macro, {})).toEqualTypeOf<Omit<Macro.Source, "_id" | "sort" | "ownership">>();
    expectTypeOf(
      macros.fromCompendium(macro, {
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
});
