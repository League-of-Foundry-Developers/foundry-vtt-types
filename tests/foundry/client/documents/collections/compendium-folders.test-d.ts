import { afterAll, describe, expectTypeOf, test } from "vitest";

import CompendiumFolderCollection = foundry.documents.collections.CompendiumFolderCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare const folderCreateDataArray: Folder.CreateData[];
declare const actorFolderStored: Folder.Stored<"Actor">;
declare const onFolderCreateOperation: Folder.Database.OnCreateOperation;
declare const onFolderUpdateOperation: Folder.Database.OnUpdateOperation;
declare const onFolderDeleteOperation: Folder.Database.OnDeleteOperation;
declare const onSceneUpdateOperation: Scene.Database.OnUpdateOperation;
declare const user: User.Stored;

describe("CompendiumFolderCollection Tests", async () => {
  const compendiaToCleanUp = new Set<CompendiumCollection.Any>();
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const folder = await Folder.implementation.create({ name: "CompendiumFolderCollection Test Folder", type: "Item" });
  if (!folder) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(folder);

  const folderImpl = new Folder.implementation({ name: "CompendiumFolderCollection Test Folder", type: "Item" });
  const folderSource = folder.toObject();

  const actorPack = await CompendiumCollection.createCompendium({
    label: "CompendiumFolderCollection Test Actor Pack",
    type: "Actor",
  });
  compendiaToCleanUp.add(actorPack);

  const itemPack = await CompendiumCollection.createCompendium({
    label: "CompendiumFolderCollection Test Item Pack",
    type: "Item",
  });
  compendiaToCleanUp.add(itemPack);

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    expectTypeOf(new CompendiumFolderCollection(actorPack)).toEqualTypeOf<CompendiumFolderCollection<"Actor">>();
    expectTypeOf(new CompendiumFolderCollection(actorPack, [folderSource])).toEqualTypeOf<
      CompendiumFolderCollection<"Actor">
    >();
    expectTypeOf(new CompendiumFolderCollection(itemPack)).toEqualTypeOf<CompendiumFolderCollection<"Item">>();
    expectTypeOf(new CompendiumFolderCollection(itemPack, [folderSource])).toEqualTypeOf<
      CompendiumFolderCollection<"Item">
    >();
  });

  // actorPackFolders
  const apf = new CompendiumFolderCollection(actorPack, [folderSource]);

  test("Miscellaneous", () => {
    expectTypeOf(apf.pack).toEqualTypeOf<CompendiumCollection<"Actor">>();

    // `CompendiumFolderCollection` doesn't set its `static documentName`, so it'll always be `undefined` at runtime
    expectTypeOf(CompendiumFolderCollection.documentName).toEqualTypeOf<CONST.ALL_DOCUMENT_TYPES | undefined>();
    // It does have an override for the instance getter though
    expectTypeOf(apf.documentName).toEqualTypeOf<"Folder">();

    // No type changes from `DocumentCollection`, thorough tests can be found there.
    expectTypeOf(apf.render(true, { classes: ["foo"], left: 7 }));
  });

  test("Getting", () => {
    expectTypeOf(apf.get("ID")).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", {})).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(apf.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();
    expectTypeOf(apf.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(apf.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();
    expectTypeOf(apf.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();

    expectTypeOf(apf.getInvalid("ID")).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(apf.getInvalid("ID", {})).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(apf.getInvalid("ID", { strict: false })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(apf.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(apf.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(apf.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(apf.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();

    expectTypeOf(apf.getName("name")).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.getName("name", {})).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.getName("name", { strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(apf.getName("name", { strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(apf.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    apf.set("ID", folderImpl);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(apf.set("ID", folder)).toBeVoid();

    expectTypeOf(apf.delete("ID")).toBeBoolean();
  });

  test("updateAll", () => {
    expectTypeOf(apf.updateAll({ sorting: "m" })).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(apf.updateAll((folder) => ({ name: folder.name + " 2" }))).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(apf.updateAll({ sorting: "a" }, (folder) => folder.visible)).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(apf.updateAll((folder) => ({ name: folder.name + " 2" }), null)).toEqualTypeOf<
      Promise<Folder.Stored[]>
    >();
    expectTypeOf(apf.updateAll((folder) => ({ name: folder.name + " 2" }), null, {})).toEqualTypeOf<
      Promise<Folder.Stored[]>
    >();
    expectTypeOf(
      apf.updateAll((folder) => ({ name: folder.name + " 2" }), null, {
        diff: false,
        recursive: false,
      }),
    ).toEqualTypeOf<Promise<Folder.Stored[]>>();
  });

  // There is an override, but we don't type it because it doesn't change anything, so this should be identical to `DocumentCollection`
  test("_onModifyContents", () => {
    // @ts-expect-error wrong document's operation type
    apf._onModifyContents("update", [actorFolderStored], folderCreateDataArray, onSceneUpdateOperation);
    expectTypeOf(
      apf._onModifyContents("create", [actorFolderStored], folderCreateDataArray, onFolderCreateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      apf._onModifyContents("update", [actorFolderStored], folderCreateDataArray, onFolderUpdateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      apf._onModifyContents("delete", [actorFolderStored], ["ID"], onFolderDeleteOperation, user),
    ).toBeVoid();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
    for (const pack of compendiaToCleanUp) await pack.deleteCompendium();
  });
});
