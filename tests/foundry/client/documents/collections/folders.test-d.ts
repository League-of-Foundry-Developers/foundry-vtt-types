import { describe, expectTypeOf, test } from "vitest";

import Folders = foundry.documents.collections.Folders;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const folderCreateData: Folder.CreateData;
declare const folderSource: Folder.Source;
declare const folder: Folder.Stored;
declare const folderImpl: Folder.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Folders Tests", () => {
  test("Construction", () => {
    new Folders();
    new Folders([folderCreateData]);
    new Folders([folderSource]);

    // @ts-expect-error `Actor` data not assignable to `Folder` data
    new Folders([actorCreateData]);
  });

  const folders = new Folders([folderCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Folders.documentName).toEqualTypeOf<"Folder">();
    expectTypeOf(Folders.instance).toEqualTypeOf<Folders.Implementation>();
    expectTypeOf(folders.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(folders.directory).toEqualTypeOf<DocumentDirectory<Folder.ImplementationClass> | undefined>();

    expectTypeOf(folders._expanded).toEqualTypeOf<Record<string, boolean>>();
    expectTypeOf(folders.render()).toBeVoid(); // no-op in Folders
  });

  test("Getting", () => {
    expectTypeOf(folders.get("ID")).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.get("ID", {})).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(folders.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();
    expectTypeOf(folders.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(folders.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(folders.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();
    expectTypeOf(folders.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();
    expectTypeOf(folders.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();

    expectTypeOf(folders.getInvalid("ID")).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(folders.getInvalid("ID", {})).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(folders.getInvalid("ID", { strict: false })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(folders.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(folders.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(folders.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(folders.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();

    expectTypeOf(folders.getName("name")).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.getName("name", {})).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.getName("name", { strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(folders.getName("name", { strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(folders.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    folders.set("ID", folderImpl);
    // @ts-expect-error `Actor`s are not `Folder`s
    folders.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(folders.set("ID", folder)).toBeVoid();

    expectTypeOf(folders.delete("ID")).toBeBoolean();
  });

  // TODO: _onModifyContents tests on the db-ops branch
});
