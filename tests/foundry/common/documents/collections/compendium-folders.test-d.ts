import { test, describe, expectTypeOf } from "vitest";

import CompendiumFolderCollection = foundry.documents.collections.CompendiumFolderCollection;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare const actorPack: CompendiumCollection<"Actor">;
declare const itemPack: CompendiumCollection<"Item">;
declare const folderSourceArray: Folder.Source[];
declare const folderCreateDataArray: Folder.CreateData[];
declare const folderStored: Folder.Stored;
declare const onFolderCreateOperation: Folder.Database2.OnCreateOperation;
declare const onFolderUpdateOperation: Folder.Database2.OnUpdateOperation;
declare const onFolderDeleteOperation: Folder.Database2.OnDeleteOperation;
declare const onSceneUpdateOperation: Scene.Database2.OnUpdateOperation;
declare const user: User.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("CompendiumFolderCollection Tests", () => {
  test("Construction", () => {
    expectTypeOf(new CompendiumFolderCollection(actorPack)).toEqualTypeOf<CompendiumFolderCollection<"Actor">>();
    expectTypeOf(new CompendiumFolderCollection(itemPack)).toEqualTypeOf<CompendiumFolderCollection<"Item">>();

    new CompendiumFolderCollection(itemPack, folderSourceArray);
    new CompendiumFolderCollection(itemPack, folderCreateDataArray);
  });

  const cfc = new CompendiumFolderCollection(actorPack, folderCreateDataArray);

  test("Miscellaneous", () => {
    expectTypeOf(cfc.pack).toEqualTypeOf<CompendiumCollection<"Actor">>();

    expectTypeOf(cfc.documentName).toEqualTypeOf<"Folder">();
    expectTypeOf(cfc.documentClass).toEqualTypeOf<Folder.ImplementationClass>();

    expectTypeOf(cfc.render()).toBeVoid();
    expectTypeOf(cfc.render(true)).toBeVoid();
    expectTypeOf(cfc.render(true, {})).toBeVoid();
    expectTypeOf(
      cfc.render(true, {
        // random smattering of appv1 and appv2 render options
        isFirstRender: false,
        position: { top: 500, left: 500 },
        window: { icon: "fa-solid fa-user" },
        minimizable: true,
        filters: [{ contentSelector: ".foo", inputSelector: ".bar" }],
      }),
    ).toBeVoid();

    // @ts-expect-error `force` in the render options is always overwritten by the value (after applying param default) of the first arg
    cfc.render(undefined, { force: true });
  });

  // no override, should be identical to `DocumentCollection`
  test("Getting", () => {
    expectTypeOf(cfc.get("ID")).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", {})).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(cfc.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Folder.Invalid | Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();
    expectTypeOf(cfc.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Folder.Invalid | Folder.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(cfc.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Folder.Stored>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Folder.Stored | undefined
    >();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();
    expectTypeOf(cfc.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<Folder.Stored | undefined>();

    expectTypeOf(cfc.getInvalid("ID")).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(cfc.getInvalid("ID", {})).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(cfc.getInvalid("ID", { strict: false })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(cfc.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(cfc.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Folder.Invalid>();
    expectTypeOf(cfc.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();
    expectTypeOf(cfc.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Folder.Invalid | undefined>();
  });

  // There is an override, but we don't type it because it doesn't change anything, so this should be identical to `DocumentCollection`
  test("updateAll", () => {
    expectTypeOf(cfc.updateAll({ sorting: "m" })).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(cfc.updateAll((folder) => ({ name: folder.name + " 2" }))).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(cfc.updateAll({ sorting: "a" }, (folder) => folder.visible)).toEqualTypeOf<Promise<Folder.Stored[]>>();
    expectTypeOf(cfc.updateAll((folder) => ({ name: folder.name + " 2" }), null)).toEqualTypeOf<
      Promise<Folder.Stored[]>
    >();
    expectTypeOf(cfc.updateAll((folder) => ({ name: folder.name + " 2" }), null, {})).toEqualTypeOf<
      Promise<Folder.Stored[]>
    >();
    expectTypeOf(
      cfc.updateAll((folder) => ({ name: folder.name + " 2" }), null, {
        diff: false,
        recursive: false,
      }),
    ).toEqualTypeOf<Promise<Folder.Stored[]>>();
  });

  // There is an override, but we don't type it because it doesn't change anything, so this should be identical to `DocumentCollection`
  test("_onModifyContents", () => {
    // @ts-expect-error wrong document's operation type
    cfc._onModifyContents("update", [folderStored], folderCreateDataArray, onSceneUpdateOperation);
    expectTypeOf(
      cfc._onModifyContents("create", [folderStored], folderCreateDataArray, onFolderCreateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      cfc._onModifyContents("update", [folderStored], folderCreateDataArray, onFolderUpdateOperation, user),
    ).toBeVoid();
    expectTypeOf(cfc._onModifyContents("delete", [folderStored], ["ID"], onFolderDeleteOperation, user)).toBeVoid();
  });
});
