import { test, describe, expectTypeOf } from "vitest";

import WorldCollection = foundry.documents.abstract.WorldCollection;
// Collection is a blessed global so doesn't need to be imported
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import Application = foundry.appv1.api.Application;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const actorCreateDataArray: Actor.CreateData[];
declare const itemCreateDataArray: Item.CreateData[];
declare const userCreateDataArray: User.CreateData[];
declare const templateCreateDataArray: MeasuredTemplateDocument.CreateData[];
declare const actorPack: CompendiumCollection<"Actor">;
declare const scene: Scene.Implementation;
declare const actor: Actor.Implementation;
declare const anyV1Sheet: Application.AnyConstructor;
declare const anyV2Sheet: ApplicationV2.AnyConstructor;

class TestActorsWorldCollection extends WorldCollection<"Actor", "Actors"> {}
class TestItemsWorldCollection extends WorldCollection<"Item", "Items"> {}
class TestUsersWorldCollection extends WorldCollection<"User", "Users"> {}
class TestScenesWorldCollection extends WorldCollection<"Scene", "Scenes"> {}

describe("WorldCollection Tests", () => {
  test("Construction", () => {
    // no data need be passed
    new TestActorsWorldCollection();

    new TestActorsWorldCollection(actorCreateDataArray);
    new TestItemsWorldCollection(itemCreateDataArray);
    new TestUsersWorldCollection(userCreateDataArray);

    // @ts-expect-error wrong document create data
    new TestActorsWorldCollection(itemCreateDataArray);
    // @ts-expect-error wrong document create data
    new TestItemsWorldCollection(templateCreateDataArray);

    // This passes because users only require a `name`, which `Item.CreateData` provides
    new TestUsersWorldCollection(itemCreateDataArray);
  });

  const wac = new TestActorsWorldCollection(actorCreateDataArray);
  const wic = new TestItemsWorldCollection(itemCreateDataArray);
  const wuc = new TestUsersWorldCollection(itemCreateDataArray);

  test("Miscellaneous", () => {
    expectTypeOf(wac.name).toEqualTypeOf<"Actors">();
    expectTypeOf(wic.name).toEqualTypeOf<"Items">();
    expectTypeOf(wuc.name).toEqualTypeOf<"Users">();

    expectTypeOf(wac.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();
    expectTypeOf(wic.folders).toEqualTypeOf<Collection<Folder.Stored<"Item">>>();
    // User is not a valid Folder type, so we get never here
    expectTypeOf(wuc.folders).toEqualTypeOf<Collection<never>>();

    // @ts-expect-error Folder.Stored<"Actor"> id not assignable to Folder.Stored<"Item">
    expectTypeOf(wic.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();

    expectTypeOf(wac.directory).toEqualTypeOf<foundry.applications.sidebar.tabs.ActorDirectory.Any | undefined>();
    expectTypeOf(wic.directory).toEqualTypeOf<foundry.applications.sidebar.tabs.ItemDirectory.Any | undefined>();
    expectTypeOf(wuc.directory).toEqualTypeOf<foundry.applications.sidebar.AbstractSidebarTab.Any | null | undefined>();

    // testing `.instance` is pointless because we have to fake override it per subclass

    expectTypeOf(wac["_getVisibleTreeContents"]()).toEqualTypeOf<Actor.Stored[]>();
  });

  test("importFromCompendium", () => {
    // TODO: update tests on db-ops branch, include temporary
    expectTypeOf(wac.importFromCompendium(actorPack, "id")).toEqualTypeOf<Promise<Actor.Stored>>();
  });

  test("fromCompendium", () => {
    // Scenes are the only document whose Source contains all properties operated on
    const wsc = new TestScenesWorldCollection();

    // no deletions with these options
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Scene.Source>();

    // clearFolder only
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: true,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "folder">>();

    // clearOwnership only
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: true,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "ownership">>();

    // clearSort only
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: true,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "sort" | "navOrder">>();

    // clearSort only - Actors don't have `navOrder`, so its irrelevant that it's omitted
    expectTypeOf(
      wac.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: true,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "sort">>();

    // clearState only
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: true,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "active">>();

    // clearState only - Actors don't have 'active', so its irrelevant that it's omitted
    expectTypeOf(
      wac.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: true,
        keepId: true,
      }),
    ).toEqualTypeOf<Actor.Source>();

    // keepId only
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id">>();

    // everything
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: true,
        clearOwnership: true,
        clearSort: true,
        clearState: true,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership" | "folder">>();

    // default case - all deletions enabled except `folder`
    expectTypeOf(wsc.fromCompendium(scene)).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(wsc.fromCompendium(scene, {})).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(
      wsc.fromCompendium(scene, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">>();
  });

  test("Sheets", () => {
    // Thorough tests of the options for these methods are in the DocumentSheetConfig tests
    // TODO: make the above true by doing a proper pass on DocumentSheetConfig
    expectTypeOf(TestActorsWorldCollection.registerSheet("scope", anyV1Sheet));
    expectTypeOf(TestActorsWorldCollection.registerSheet("scope", anyV2Sheet));
    expectTypeOf(TestActorsWorldCollection.unregisterSheet("scope", anyV1Sheet));
    expectTypeOf(TestActorsWorldCollection.unregisterSheet("scope", anyV2Sheet));
    expectTypeOf(TestActorsWorldCollection.registeredSheets).toEqualTypeOf<
      Array<typeof anyV1Sheet | typeof anyV2Sheet>
    >();
  });
});
