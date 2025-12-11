import { afterAll, describe, expectTypeOf, test } from "vitest";

import Folders = foundry.documents.collections.Folders;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

describe("Folders Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const folder = await Folder.implementation.create({
    name: "Folders Collection Test Folder",
    type: "Actor",
  });
  if (!folder) throw new Error("Failed to create test Folder.");
  docsToCleanUp.add(folder);

  const folderImpl = new Folder.implementation({
    name: "Folders Collection Test Folder",
    type: "Actor",
  });
  const folderSource = folder.toObject();

  const actor = await Actor.implementation.create({
    name: "Folders Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Folders();
    new Folders([folderSource]);

    // @ts-expect-error `Actor` data not assignable to `Folder` data
    new Folders([actorSource]);
  });

  const folders = new Folders([folderSource]);

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
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(folders.set("ID", folder)).toBeVoid();

    expectTypeOf(folders.delete("ID")).toBeBoolean();
  });

  // TODO: _onModifyContents tests on the db-ops branch

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
