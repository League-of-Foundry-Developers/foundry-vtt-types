import { afterAll, describe, expect, expectTypeOf, test } from "vitest";

import Scenes = foundry.documents.collections.Scenes;
import Sound = foundry.audio.Sound;

describe("Scenes Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({
    name: "Scenes Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const scene = await Scene.implementation.create({ name: "Scenes Collection Test Scene" });
  if (!scene) throw new Error("Failed to create test Scene.");
  docsToCleanUp.add(scene);

  const sceneImpl = new Scene.implementation({ name: "Scenes Collection Test Scene" });
  const sceneSource = scene.toObject();

  const wallDoc = await WallDocument.implementation.create({ c: [0, 0, 50, 50] });
  if (!wallDoc) throw new Error("Failed to create Test Wall.");
  // cleanup handled by parent scene
  // docsToCleanUp.add(wall);

  const wallSource = wallDoc.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Scenes();
    new Scenes([sceneSource]);

    // @ts-expect-error `WallDocument` data not assignable to `Scene` data
    new Scenes([wallSource]);
  });

  const scenes = new Scenes([sceneSource]);

  test("Inheritance", () => {
    expectTypeOf(scenes).toExtend<Collection.Any>();
    expectTypeOf(Scenes).toExtend<Collection.AnyConstructor>();
    expect(scenes).toBeInstanceOf(Collection);
    expectTypeOf(scenes).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(Scenes).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(scenes).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(scenes).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(Scenes).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(scenes).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

  test("Miscellaneous", () => {
    expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();
    expectTypeOf(Scenes.instance).toEqualTypeOf<Scenes.Implementation>();
    expectTypeOf(scenes.folders).toEqualTypeOf<Collection<Folder.Stored<"Scene">>>();
    expectTypeOf(scenes.directory).toEqualTypeOf<typeof ui.scenes>();

    expectTypeOf(scenes.active).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.current).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.viewed).toEqualTypeOf<Scene.Stored | undefined>();

    expectTypeOf(Scenes._activateSocketListeners(game.socket!)).toBeVoid();
  });

  test("preload", () => {
    expectTypeOf(scenes.preload("ID")).toEqualTypeOf<Promise<Array<Sound | undefined>>>();
    expectTypeOf(scenes.preload("ID", undefined)).toEqualTypeOf<Promise<Array<Sound | undefined>>>();
    expectTypeOf(scenes.preload("ID", { broadcast: true, level: "some level ID" })).toEqualTypeOf<
      Promise<Array<Sound | undefined>>
    >();
    expectTypeOf(scenes.preload("ID", { broadcast: undefined, level: undefined })).toEqualTypeOf<
      Promise<Array<Sound | undefined>>
    >();

    // deprecated signature, since v14 until v16:

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(scenes.preload("ID", true)).toEqualTypeOf<Promise<Array<Sound | undefined>>>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(scenes.preload("ID", false)).toEqualTypeOf<Promise<Array<Sound | undefined>>>();
  });

  test("Getting", () => {
    expectTypeOf(scenes.get("ID")).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.get("ID", {})).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Scene.Invalid | Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Scene.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(scenes.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Scene.Invalid | Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Scene.Invalid | Scene.Stored
    >();
    expectTypeOf(scenes.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Scene.Invalid | Scene.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(scenes.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Scene.Stored>();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Scene.Stored | undefined
    >();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Scene.Stored | undefined
    >();
    expectTypeOf(scenes.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Scene.Stored | undefined
    >();

    expectTypeOf(scenes.getInvalid("ID")).toEqualTypeOf<Scene.Invalid>();
    expectTypeOf(scenes.getInvalid("ID", {})).toEqualTypeOf<Scene.Invalid>();
    expectTypeOf(scenes.getInvalid("ID", { strict: false })).toEqualTypeOf<Scene.Invalid | undefined>();
    expectTypeOf(scenes.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Scene.Invalid>();
    expectTypeOf(scenes.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Scene.Invalid>();
    expectTypeOf(scenes.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Scene.Invalid | undefined>();
    expectTypeOf(scenes.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Scene.Invalid | undefined>();

    expectTypeOf(scenes.getName("name")).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.getName("name", {})).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.getName("name", { strict: true })).toEqualTypeOf<Scene.Stored>();
    expectTypeOf(scenes.getName("name", { strict: undefined })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Scene.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    scenes.set("ID", sceneImpl);
    // @ts-expect-error `Actor`s are not `Scene`s
    scenes.set("ID", actor);

    expectTypeOf(scenes.set("ID", scene)).toEqualTypeOf<typeof scenes>();

    expectTypeOf(scenes.delete("ID")).toBeBoolean();
  });

  test("fromCompendium", () => {
    const sceneOrSource: Scene.Stored | Scene.Source = sceneSource;

    // no deletions with these options
    expectTypeOf(
      scenes.fromCompendium(sceneOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Scene.Source>();

    // more thorough options testing is in the `WorldCollection` tests

    // default case - all deletions enabled except `folder`
    expectTypeOf(scenes.fromCompendium(sceneOrSource)).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder">
    >();
    expectTypeOf(scenes.fromCompendium(sceneOrSource, {})).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder">
    >();
    expectTypeOf(
      scenes.fromCompendium(sceneOrSource, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder">>();

    // @ts-expect-error `WallDocument.Stored`s aren't `Scene.Stored`s
    scenes.fromCompendium(wallDoc);
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
