import { afterAll, test, describe, expectTypeOf } from "vitest";

import WorldCollection = foundry.documents.abstract.WorldCollection;
// Collection is a blessed global so doesn't need to be imported
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import Application = foundry.appv1.api.Application;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import sidebar = foundry.applications.sidebar;

describe("WorldCollection Tests", async () => {
  class TestActorsWorldCollection extends WorldCollection<"Actor"> {}
  class TestItemsWorldCollection extends WorldCollection<"Item"> {}
  class TestUsersWorldCollection extends WorldCollection<"User"> {}
  class TestScenesWorldCollection extends WorldCollection<"Scene"> {}

  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({ name: "WorldCollection Test Actor", type: "base" });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const scene = await Scene.implementation.create({ name: "WorldCollection Test Scene" });
  if (!scene) throw new Error("Failed to create test Scene");
  docsToCleanUp.add(scene);

  const actorPack = await CompendiumCollection.createCompendium({
    label: "WorldCollection Test Compendium",
    type: "Actor",
  });

  const actorSource: Actor.Source = actor.toObject();
  const userSource: User.Source = new User.implementation({ name: "WorldCollection Test User" }).toObject();
  const sceneSource: Scene.Source = new Scene.implementation({ name: "WorldCollection Test User" }).toObject();
  const templateSource: MeasuredTemplateDocument.Source = new MeasuredTemplateDocument.implementation().toObject();
  const itemSource: Item.Source = new Item.implementation({
    name: "WorldCollection Test Item",
    type: "base",
  }).toObject();

  const anyV1Sheet: Application.AnyConstructor = foundry.appv1.api.Application;
  const anyV2Sheet: ApplicationV2.AnyConstructor = foundry.applications.api.ApplicationV2;

  test("Construction", () => {
    // no data need be passed
    new TestActorsWorldCollection();

    new TestActorsWorldCollection([actorSource]);
    new TestItemsWorldCollection([itemSource]);
    new TestUsersWorldCollection([userSource]);

    // @ts-expect-error wrong document create data
    new TestActorsWorldCollection([itemSource]);
    // @ts-expect-error wrong document create data
    new TestItemsWorldCollection([templateSource]);
  });

  const wac = new TestActorsWorldCollection([actorSource]);
  const wic = new TestItemsWorldCollection([itemSource]);
  const wuc = new TestUsersWorldCollection([userSource]);

  test("Miscellaneous", () => {
    expectTypeOf(wac.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();
    expectTypeOf(wic.folders).toEqualTypeOf<Collection<Folder.Stored<"Item">>>();
    // User is not a valid Folder type, so we get never here
    expectTypeOf(wuc.folders).toEqualTypeOf<Collection<never>>();

    // @ts-expect-error Folder.Stored<"Actor"> id not assignable to Folder.Stored<"Item">
    expectTypeOf(wic.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();

    expectTypeOf(wac.directory).toEqualTypeOf<sidebar.tabs.ActorDirectory.Any | undefined>();
    expectTypeOf(wic.directory).toEqualTypeOf<sidebar.tabs.ItemDirectory.Any | undefined>();
    // `Users#directory` will be `undefined` at runtime, but we leave open the possibility of users registering one in `ui.users`
    expectTypeOf(wuc.directory).toEqualTypeOf<sidebar.DocumentDirectory<User.ImplementationClass> | undefined>();

    // testing `.instance` is pointless because we have to fake override it per subclass

    expectTypeOf(wac["_getVisibleTreeContents"]()).toEqualTypeOf<Actor.Stored[]>();

    expectTypeOf(wac.search({})).toEqualTypeOf<Actor.Stored[]>();
    expectTypeOf(wic.search({})).toEqualTypeOf<Item.Stored[]>();
    expectTypeOf(wuc.search({})).toEqualTypeOf<User.Stored[]>();
  });

  test("importFromCompendium", () => {
    // TODO: update tests on db-ops branch, include temporary
    expectTypeOf(wac.importFromCompendium(actorPack, "id")).toEqualTypeOf<Promise<Actor.Stored>>();
  });

  test("fromCompendium", () => {
    // Scenes are the only document whose Source contains all properties operated on
    const wsc = new TestScenesWorldCollection();

    const sceneOrSource: Scene.Stored | Scene.Source = sceneSource;
    const actorOrSource: Actor.Stored | Actor.Source = actorSource;

    // no deletions with these options
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Scene.Source>();

    // clearFolder only
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: true,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "folder">>();

    // clearOwnership only
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: true,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "ownership">>();

    // clearSort only
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: true,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "sort" | "navOrder">>();

    // clearSort only - Actors don't have `navOrder`, so its irrelevant that it's omitted
    expectTypeOf(
      wac.fromCompendium(actorOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: true,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "sort">>();

    // clearState only
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: true,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "active">>();

    // clearState only - Actors don't have 'active', so its irrelevant that it's omitted
    expectTypeOf(
      wac.fromCompendium(actorOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: true,
        keepId: true,
      }),
    ).toEqualTypeOf<Actor.Source>();

    // keepId only
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id">>();

    // everything
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
        clearFolder: true,
        clearOwnership: true,
        clearSort: true,
        clearState: true,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership" | "folder">>();

    // default case - all deletions enabled except `folder`
    expectTypeOf(wsc.fromCompendium(sceneOrSource)).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(wsc.fromCompendium(sceneOrSource, {})).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(
      wsc.fromCompendium(sceneOrSource, {
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

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
    await actorPack.deleteCompendium();
  });
});
