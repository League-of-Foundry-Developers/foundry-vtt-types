import { describe, expectTypeOf, test } from "vitest";

import Scenes = foundry.documents.collections.Scenes;

declare const sceneCreateData: Scene.CreateData;
declare const sceneSource: Scene.Source;
declare const scene: Scene.Stored;
declare const sceneImpl: Scene.Implementation;
declare const actor: Actor.Stored;
declare const wallCreateData: WallDocument.CreateData;
declare const wall: WallDocument.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Scenes Tests", () => {
  test("Construction", () => {
    new Scenes();
    new Scenes([sceneCreateData]);
    new Scenes([sceneSource]);

    // @ts-expect-error `WallDocument` data not assignable to `Scene` data
    new Scenes([wallCreateData]);
  });

  const scenes = new Scenes([sceneCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Scenes.documentName).toEqualTypeOf<"Scene">();
    expectTypeOf(Scenes.instance).toEqualTypeOf<Scenes.Implementation>();
    expectTypeOf(scenes.folders).toEqualTypeOf<Collection<Folder.Stored<"Scene">>>();
    expectTypeOf(scenes.directory).toEqualTypeOf<typeof ui.scenes>();

    expectTypeOf(scenes.active).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.current).toEqualTypeOf<Scene.Stored | undefined>();
    expectTypeOf(scenes.viewed).toEqualTypeOf<Scene.Stored | undefined>();

    expectTypeOf(scenes.preload("ID")).toEqualTypeOf<Promise<Array<foundry.audio.Sound | undefined>>>();
    expectTypeOf(scenes.preload("ID", false)).toEqualTypeOf<Promise<Array<foundry.audio.Sound | undefined>>>();
    expectTypeOf(scenes.preload("ID", undefined)).toEqualTypeOf<Promise<Array<foundry.audio.Sound | undefined>>>();
    expectTypeOf(scenes.preload("ID", true)).toEqualTypeOf<Promise<io.Socket>>();

    expectTypeOf(Scenes._activateSocketListeners(game.socket!)).toBeVoid();
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
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(scenes.set("ID", scene)).toBeVoid();

    expectTypeOf(scenes.delete("ID")).toBeBoolean();
  });

  test("fromCompendium", () => {
    // no deletions with these options
    expectTypeOf(
      scenes.fromCompendium(scene, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Scene.Source>();

    // more thorough options testing is in the `WorldCollection` tests

    // default case - all deletions enabled except `folder`
    expectTypeOf(scenes.fromCompendium(scene)).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(scenes.fromCompendium(scene, {})).toEqualTypeOf<
      Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">
    >();
    expectTypeOf(
      scenes.fromCompendium(scene, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Scene.Source, "_id" | "active" | "sort" | "navOrder" | "ownership">>();

    // @ts-expect-error `WallDocument.Stored`s aren't `Scene.Stored`s
    scenes.fromCompendium(wall);
  });
});
