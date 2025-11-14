import { describe, expectTypeOf, test } from "vitest";

import RollTables = foundry.documents.collections.RollTables;

declare const tableCreateData: RollTable.CreateData;
declare const tableSource: RollTable.Source;
declare const stack: RollTable.Stored;
declare const tableImpl: RollTable.Implementation;
declare const actor: Actor.Stored;
declare const wallCreateData: WallDocument.CreateData;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("RollTables Tests", () => {
  test("Construction", () => {
    new RollTables();
    new RollTables([tableCreateData]);
    new RollTables([tableSource]);

    // @ts-expect-error `WallDocument` data not assignable to `RollTable` data
    new RollTables([wallCreateData]);
  });

  const tables = new RollTables([tableCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(RollTables.documentName).toEqualTypeOf<"RollTable">();
    expectTypeOf(RollTables.instance).toEqualTypeOf<RollTables.Implementation>();
    expectTypeOf(tables.folders).toEqualTypeOf<Collection<Folder.Stored<"RollTable">>>();
    expectTypeOf(tables.directory).toEqualTypeOf<typeof ui.tables>();

    expectTypeOf(RollTables.registerSettings()).toBeVoid();
  });

  test("Getting", () => {
    expectTypeOf(tables.get("ID")).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.get("ID", {})).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.get("ID", { invalid: false, strict: false })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      RollTable.Invalid | RollTable.Stored
    >();
    expectTypeOf(tables.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      RollTable.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(tables.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      RollTable.Invalid | RollTable.Stored
    >();
    expectTypeOf(tables.get("ID", { invalid: false, strict: true })).toEqualTypeOf<RollTable.Stored>();
    expectTypeOf(tables.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<RollTable.Stored>();
    expectTypeOf(tables.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<RollTable.Stored>();
    expectTypeOf(tables.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      RollTable.Invalid | RollTable.Stored
    >();
    expectTypeOf(tables.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      RollTable.Invalid | RollTable.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(tables.get("ID", { invalid: false, strict: true })).toEqualTypeOf<RollTable.Stored>();
    expectTypeOf(tables.get("ID", { invalid: false, strict: false })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      RollTable.Stored | undefined
    >();
    expectTypeOf(tables.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      RollTable.Stored | undefined
    >();
    expectTypeOf(tables.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      RollTable.Stored | undefined
    >();

    expectTypeOf(tables.getInvalid("ID")).toEqualTypeOf<RollTable.Invalid>();
    expectTypeOf(tables.getInvalid("ID", {})).toEqualTypeOf<RollTable.Invalid>();
    expectTypeOf(tables.getInvalid("ID", { strict: false })).toEqualTypeOf<RollTable.Invalid | undefined>();
    expectTypeOf(tables.getInvalid("ID", { strict: undefined })).toEqualTypeOf<RollTable.Invalid>();
    expectTypeOf(tables.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<RollTable.Invalid>();
    expectTypeOf(tables.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<RollTable.Invalid | undefined>();
    expectTypeOf(tables.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<RollTable.Invalid | undefined>();

    expectTypeOf(tables.getName("name")).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.getName("name", {})).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.getName("name", { strict: true })).toEqualTypeOf<RollTable.Stored>();
    expectTypeOf(tables.getName("name", { strict: undefined })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<RollTable.Stored | undefined>();
    expectTypeOf(tables.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<RollTable.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    tables.set("ID", tableImpl);
    // @ts-expect-error `Actor`s are not `RollTable`s
    tables.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(tables.set("ID", stack)).toBeVoid();

    expectTypeOf(tables.delete("ID")).toBeBoolean();
  });
});
