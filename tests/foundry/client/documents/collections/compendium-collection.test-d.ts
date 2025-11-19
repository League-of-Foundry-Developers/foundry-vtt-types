import { describe, expectTypeOf, test } from "vitest";
import type { EmptyObject, AnyMutableObject, IntentionalPartial } from "fvtt-types/utils";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import CompendiumFolderCollection = foundry.documents.collections.CompendiumFolderCollection;
import DocumentCollection = foundry.documents.abstract.DocumentCollection;
import BasePackage = foundry.packages.BasePackage;
import Application = foundry.appv1.api.Application;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const folder: Folder.Stored;
declare const folderCompendium: Folder.Stored<"Compendium">;
declare const folderActor: Folder.Stored<"Actor">;
declare const tempFolderActor: Folder.OfType<"Actor">;
declare const folderSource: Folder.Source;
declare const user: User.Stored;
declare const actor: Actor.Stored;
declare const tempActor: Actor.Implementation;
declare const folderOrActor: Folder.Stored<"Actor"> | Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

const minimalActorPackCreateMetadata = {
  type: "Actor",
  label: "An Actor Pack",
} satisfies CompendiumCollection.CreateCompendiumMetadata<"Actor">;

const fullActorPackCreateMetadata = {
  type: "Actor",
  label: "An Actor Pack",
  name: "actors",
  flags: { foo: true },
  ownership: { GAMEMASTER: "OWNER", TRUSTED: "OBSERVER", PLAYER: "NONE" },
} satisfies CompendiumCollection.CreateCompendiumMetadata<"Actor">;

const actorPackConstructorMetadata = {
  type: "Actor",
  label: "Foo",
  name: "foo",
  packageType: "module",
  packageName: "my-module",
  id: "my-module.foo",
  index: [{ _id: "actorID", type: "character", uuid: "Compendium.my-module.foo.Actor.actorID" }],
  flags: { foo: false },
  folders: [
    {
      type: "Actor",
      folder: null,
      name: "Folder",
      color: null,
      sorting: "a",
      _id: "ySLvdimClYtnhfil",
      description: "",
      sort: 0,
      flags: {},
      _stats: {
        compendiumSource: null,
        duplicateSource: null,
        exportSource: null,
        coreVersion: "13.348",
        systemId: "pf2e",
        systemVersion: "7.7.1",
        createdTime: 1763334028012,
        modifiedTime: 1763334028012,
        lastModifiedBy: "reSyyNKHdj4q9hqB",
      },
    },
    folderSource,
  ],
  ownership: { GAMEMASTER: "OWNER" },
  path: "modules/my-module/packs/foo",
} satisfies CompendiumCollection.ConstructorMetadata<"Actor">;

const configSettingData = {
  "package-id.pack-name": {
    folder: null,
    locked: true,
    ownership: undefined,
    sort: 3,
  },
} satisfies CompendiumCollection.SettingData;

describe("CompendiumCollection Tests", async () => {
  test("Construction/Creation", () => {
    // @ts-expect-error passing metadata is required
    new CompendiumCollection();

    // data guaranteed to be served up in `game.data`
    expectTypeOf(new CompendiumCollection(actorPackConstructorMetadata)).toEqualTypeOf<CompendiumCollection<"Actor">>();

    // optional props: not all packs require specifying a system, and `banner`'s default of `undefined` doesn't survive the socket
    expectTypeOf(
      new CompendiumCollection({
        ...actorPackConstructorMetadata,
        system: "dnd5e",
        banner: "modules/my-module/assets/banner.webp",
      }),
    ).toEqualTypeOf<CompendiumCollection<"Actor">>();

    expectTypeOf(CompendiumCollection.createCompendium(minimalActorPackCreateMetadata)).toEqualTypeOf<
      Promise<CompendiumCollection<"Actor">>
    >();
    expectTypeOf(CompendiumCollection.createCompendium(fullActorPackCreateMetadata)).toEqualTypeOf<
      Promise<CompendiumCollection<"Actor">>
    >();
  });

  const actorPack = await CompendiumCollection.createCompendium(fullActorPackCreateMetadata);

  test("Other Compendium management", () => {
    expectTypeOf(actorPack.deleteCompendium()).toEqualTypeOf<Promise<typeof actorPack>>();

    expectTypeOf(actorPack.duplicateCompendium()).toEqualTypeOf<Promise<typeof actorPack>>();
    expectTypeOf(actorPack.duplicateCompendium({ label: "new name" })).toEqualTypeOf<Promise<typeof actorPack>>();
    expectTypeOf(actorPack.duplicateCompendium({ label: undefined })).toEqualTypeOf<Promise<typeof actorPack>>();

    expectTypeOf(actorPack.migrate()).toEqualTypeOf<Promise<typeof actorPack>>();
    expectTypeOf(actorPack.migrate({ notify: false })).toEqualTypeOf<Promise<typeof actorPack>>();
    expectTypeOf(actorPack.migrate({ notify: undefined })).toEqualTypeOf<Promise<typeof actorPack>>();
  });

  test("Regression tests", () => {
    // @ts-expect-error "_initialize" is a protected method.
    actorPack._initialize();

    type CompendiumCollectionType = typeof actorPack;

    if (actorPack instanceof DocumentCollection) {
      // This test makes sure the mixin doesn't destroy the inheritance chain.
      expectTypeOf(actorPack).toExtend<CompendiumCollectionType>();
    }
  });

  test("Miscellaneous", () => {
    expectTypeOf(actorPack.documentClass).toEqualTypeOf<Actor.ImplementationClass>();
    expectTypeOf(actorPack.documentName).toEqualTypeOf<"Actor">();
    expectTypeOf(actorPack._source).toEqualTypeOf<Actor.CreateData[]>();
    expectTypeOf(actorPack.collection).toBeString();
    expectTypeOf(actorPack.banner).toEqualTypeOf<string | null | undefined>();
    expectTypeOf(actorPack.applicationClass).toEqualTypeOf<Application.AnyConstructor | ApplicationV2.AnyConstructor>();
    expectTypeOf(actorPack.sort).toBeNumber();

    expectTypeOf(actorPack["_getVisibleTreeContents"]()).toEqualTypeOf<CompendiumCollection.IndexEntry<"Actor">[]>();

    expectTypeOf(actorPack.title).toBeString();

    expectTypeOf(actorPack.clear()).toBeVoid();

    expectTypeOf(CompendiumCollection._activateSocketListeners(game.socket!)).toBeVoid();

    expectTypeOf(actorPack.getUuid("id")).toBeString();

    expectTypeOf(actorPack.render()).toBeVoid();
    expectTypeOf(actorPack.render(true)).toBeVoid();
    expectTypeOf(actorPack.render(true, {})).toBeVoid();
    // render context prop tests in DocumentCollection

    // @ts-expect-error `force` in the render options is always overwritten with the first arg, so we omit it
    actorPack.render(undefined, { force: true });

    expectTypeOf(actorPack.search({})).toEqualTypeOf<CompendiumCollection.IndexEntry<"Actor">[]>();
  });

  test("Configuration", () => {
    expectTypeOf(actorPack.config).toEqualTypeOf<CompendiumCollection.StoredConfiguration | EmptyObject>();

    expectTypeOf(actorPack.locked).toBeBoolean();
    expectTypeOf(actorPack.ownership).toEqualTypeOf<BasePackage.OwnershipRecord>();
    expectTypeOf(actorPack.configureOwnershipDialog()).toEqualTypeOf<Promise<BasePackage.OwnershipRecord>>();

    expectTypeOf(actorPack.configure()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.configure({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(
      actorPack.configure({ folder: "folderID", locked: true, ownership: { ASSISTANT: "NONE" }, sort: 7 }),
    ).toEqualTypeOf<Promise<void>>();
    expectTypeOf(
      actorPack.configure({ folder: null, locked: undefined, ownership: undefined, sort: undefined }),
    ).toEqualTypeOf<Promise<void>>();

    expectTypeOf(CompendiumCollection["_onConfigure"](configSettingData));
  });

  test("Index stuff", () => {
    expectTypeOf(actorPack.index).toEqualTypeOf<Collection<CompendiumCollection.IndexEntry<"Actor">>>();
    expectTypeOf(actorPack.indexFields).toEqualTypeOf<Set<string>>();
    expectTypeOf(actorPack.indexed).toBeBoolean();

    const i = actorPack.index;
    expectTypeOf(i.get("key")).toEqualTypeOf<CompendiumCollection.IndexEntry<"Actor"> | undefined>();
    expectTypeOf(i.get("key", { strict: true })).toEqualTypeOf<CompendiumCollection.IndexEntry<"Actor">>();

    expectTypeOf(actorPack.getIndex()).toEqualTypeOf<Promise<Collection<CompendiumCollection.IndexEntry<"Actor">>>>();
    expectTypeOf(actorPack.getIndex({})).toEqualTypeOf<Promise<Collection<CompendiumCollection.IndexEntry<"Actor">>>>();
    expectTypeOf(actorPack.getIndex({ fields: ["_stats.lastModifiedBy", "system.foo.bar"] })).toEqualTypeOf<
      Promise<Collection<CompendiumCollection.IndexEntry<"Actor">>>
    >();

    expectTypeOf(actorPack.indexDocument(actor)).toBeVoid();
  });

  test("Folders both in and of", () => {
    expectTypeOf(actorPack.folders).toEqualTypeOf<CompendiumFolderCollection<"Actor">>();
    expectTypeOf(actorPack.folder).toEqualTypeOf<Folder.Stored<"Compendium"> | null>();
    expectTypeOf(actorPack.maxFolderDepth).toBeNumber();

    expectTypeOf(actorPack.setFolder(null)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.setFolder("folderID")).toEqualTypeOf<Promise<void>>();

    expectTypeOf(actorPack.setFolder(folderCompendium)).toEqualTypeOf<Promise<void>>();
    // @ts-expect-error Must know that the folder is of type `Compendium`
    actorPack.setFolder(folder);
    // @ts-expect-error `"Actor" !== "Compendium"`
    actorPack.setFolder(folderActor);

    function isCompendiumFolder(folder: Folder.Implementation): folder is Folder.Stored<"Compendium"> {
      return !!folder._id /** folder.persisted */ && folder.type === "Compendium";
    }
    if (isCompendiumFolder(folder)) {
      expectTypeOf(actorPack.setFolder(folder)).toEqualTypeOf<Promise<void>>();
    }
  });

  test("Metadata", () => {
    const m = actorPack.metadata;
    expectTypeOf(m.id).toBeString();
    expectTypeOf(m.label).toBeString();
    expectTypeOf(m.name).toBeString();
    expectTypeOf(m.path).toBeString();
    expectTypeOf(m.type).toEqualTypeOf<"Actor">();
    expectTypeOf(m.packageType).toEqualTypeOf<"world" | "module" | "system">();
    expectTypeOf(m.packageName).toBeString();
    expectTypeOf(m.system).toEqualTypeOf<foundry.packages.System.Id | undefined>();
    if ("system" in m) expectTypeOf(m.system).toEqualTypeOf<foundry.packages.System.Id>();
    expectTypeOf(m.banner).toEqualTypeOf<string | undefined | null>();
    if ("banner" in m) expectTypeOf(m.banner).toEqualTypeOf<string | null>();

    expectTypeOf(m.ownership).toEqualTypeOf<
      IntentionalPartial<Record<keyof typeof CONST.USER_ROLES, keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>>
    >();
    expectTypeOf(m.flags).toEqualTypeOf<AnyMutableObject>();
  });

  test("Permissions", () => {
    expectTypeOf(actorPack.visible).toBeBoolean();

    expectTypeOf(actorPack.getUserLevel(user)).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>();

    expectTypeOf(actorPack.testUserPermission(user, "OBSERVER")).toBeBoolean();
    expectTypeOf(actorPack.testUserPermission(user, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)).toBeBoolean();
    expectTypeOf(actorPack.testUserPermission(user, "OWNER", {})).toBeBoolean();
    expectTypeOf(actorPack.testUserPermission(user, "OBSERVER", { exact: true })).toBeBoolean();
    expectTypeOf(actorPack.testUserPermission(user, "LIMITED", { exact: undefined })).toBeBoolean();
  });

  test("Importing from world/Exporting to compendium", async () => {
    // @ts-expect-error `User`s are not `Actor`s nor `Folder`s of `Actor`s
    actorPack.importDocument(user);
    // @ts-expect-error Wrong folder type
    actorPack.importDocument(folderCompendium);

    expectTypeOf(actorPack.importDocument(actor)).toEqualTypeOf<Promise<Actor.Stored | undefined>>();
    expectTypeOf(actorPack.importDocument(tempActor)).toEqualTypeOf<Promise<Actor.Stored | undefined>>();
    expectTypeOf(actorPack.importDocument(folderActor)).toEqualTypeOf<Promise<Folder.Stored<"Actor"> | undefined>>();
    expectTypeOf(actorPack.importDocument(tempFolderActor)).toEqualTypeOf<
      Promise<Folder.Stored<"Actor"> | undefined>
    >();
    expectTypeOf(actorPack.importDocument(folderOrActor)).toEqualTypeOf<
      Promise<Folder.Stored<"Actor"> | Actor.Stored | undefined>
    >();
    expectTypeOf(actorPack.importDocument(actor, {})).toEqualTypeOf<Promise<Actor.Stored | undefined>>();
    expectTypeOf(
      actorPack.importDocument(actor, {
        clearFlags: true,
        clearFolder: true,
        clearOwnership: true,
        clearSort: true,
        clearSource: true,
        clearState: true,
        keepId: false,
      }),
    ).toEqualTypeOf<Promise<Actor.Stored | undefined>>();
    expectTypeOf(
      actorPack.importDocument(actor, {
        clearFlags: undefined,
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearSource: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Promise<Actor.Stored | undefined>>();

    expectTypeOf(actorPack.importFolder(folderActor)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolder(folderActor, {})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolder(folderActor, { importParents: true })).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolder(folderActor, { importParents: undefined })).toEqualTypeOf<Promise<void>>();

    expectTypeOf(actorPack.importFolders([folderActor])).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolders([folderActor], {})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolders([folderActor], { importParents: true })).toEqualTypeOf<Promise<void>>();
    expectTypeOf(actorPack.importFolders([folderActor], { importParents: undefined })).toEqualTypeOf<Promise<void>>();
  });

  test("Importing to world/Exporting from compendium", async () => {
    expectTypeOf(actorPack.importAll()).toEqualTypeOf<Promise<Actor.Stored[]>>();
    expectTypeOf(actorPack.importAll({})).toEqualTypeOf<Promise<Actor.Stored[]>>();
    expectTypeOf(actorPack.importAll({ folderId: "ID", folderName: "name" })).toEqualTypeOf<Promise<Actor.Stored[]>>();
    expectTypeOf(actorPack.importAll({ folderId: null, folderName: undefined })).toEqualTypeOf<
      Promise<Actor.Stored[]>
    >();
    // importAll options also include everything from `Actor.Database.CreateDocumentsOperation` and `WorldCollection.FromCompendiumOptions`
    // Thorough tests for those interfaces are in their respective files

    expectTypeOf(actorPack.importDialog()).toEqualTypeOf<Promise<Actor.Stored[] | false | null>>();
    expectTypeOf(actorPack.importDialog({})).toEqualTypeOf<Promise<Actor.Stored[] | false | null>>();
    expectTypeOf(actorPack.importDialog({ keepId: true })).toEqualTypeOf<Promise<Actor.Stored[] | false | null>>();
    expectTypeOf(actorPack.importDialog({ yes: { label: "IMPORT!!!!!" } })).toEqualTypeOf<
      Promise<Actor.Stored[] | false | null>
    >();
    expectTypeOf(actorPack.importDialog({ no: { callback: () => "foo" } })).toEqualTypeOf<
      Promise<Actor.Stored[] | string | null>
    >();
    expectTypeOf(actorPack.importDialog({ no: { callback: () => "foo" as const } })).toEqualTypeOf<
      Promise<Actor.Stored[] | "foo" | null>
    >();
    expectTypeOf(actorPack.importDialog({ rejectClose: true })).toEqualTypeOf<Promise<Actor.Stored[] | false>>();
  });

  test("Getting", () => {
    expectTypeOf(actorPack.get("ID")).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.get("ID", {})).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(actorPack.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Actor.Invalid | Actor.Stored
    >();
    expectTypeOf(actorPack.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Actor.Invalid | Actor.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();
    expectTypeOf(actorPack.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();

    expectTypeOf(actorPack.getInvalid("ID")).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actorPack.getInvalid("ID", {})).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actorPack.getInvalid("ID", { strict: false })).toEqualTypeOf<Actor.Invalid | undefined>();
    expectTypeOf(actorPack.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actorPack.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actorPack.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Actor.Invalid | undefined>();
    expectTypeOf(actorPack.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Actor.Invalid | undefined>();

    expectTypeOf(actorPack.getName("name")).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.getName("name", {})).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.getName("name", { strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actorPack.getName("name", { strict: undefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actorPack.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();

    expectTypeOf(actorPack.getDocument("ID")).toEqualTypeOf<Promise<Actor.Stored | undefined | null>>();

    expectTypeOf(actorPack.getDocuments()).toEqualTypeOf<Promise<Actor.Stored[]>>();
    expectTypeOf(actorPack.getDocuments({})).toEqualTypeOf<Promise<Actor.Stored[]>>();
    expectTypeOf(
      actorPack.getDocuments({ _id__ne: "ID", type__in: ["character", "base"], img: "some/path.jpg" }),
    ).toEqualTypeOf<Promise<Actor.Stored[]>>();

    // @ts-expect-error "foo" is not a registered `Actor` type
    actorPack.getDocuments({ type__ne: "foo" });

    // @ts-expect-error "bar" is not a key on `Actor`
    actorPack.getDocuments({ bar: 123 });
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    actorPack.set("ID", tempActor);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(actorPack.set("ID", actor)).toBeVoid();

    expectTypeOf(actorPack.delete("ID")).toBeBoolean();
  });
});
