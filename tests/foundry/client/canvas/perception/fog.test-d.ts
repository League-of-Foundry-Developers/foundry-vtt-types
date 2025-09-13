import { describe, expectTypeOf, test } from "vitest";

import FogManager = foundry.canvas.perception.FogManager;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import TextureExtractor = foundry.canvas.TextureExtractor;

declare const texture: PIXI.Texture;
declare const user: User.Implementation;

describe("FogManager tests", () => {
  test("Construction", () => {
    new FogManager();
  });

  const myFogManager = new FogManager();

  test("Miscellaneous", () => {
    expectTypeOf(FogManager.emittedEvents).toEqualTypeOf<readonly string[]>();
    expectTypeOf(myFogManager.tokenVision).toBeBoolean();
    expectTypeOf(myFogManager.fogExploration).toBeBoolean();
    expectTypeOf(myFogManager.isPointExplored({ x: 500, y: 300 })).toBeBoolean();
    expectTypeOf(myFogManager.initialize()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.clear()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.destroy()).toEqualTypeOf<void>();
    expectTypeOf(myFogManager.commit()).toEqualTypeOf<void>();
    expectTypeOf(myFogManager.load()).toEqualTypeOf<Promise<PIXI.Texture | void>>();
    expectTypeOf(myFogManager.reset()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.save()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.sync(user, [user, user])).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager["_handleReset"]()).toEqualTypeOf<Promise<void>>();
  });

  test("Data", () => {
    expectTypeOf(FogManager.COMMIT_THRESHOLD).toBeNumber();
    expectTypeOf(myFogManager.exploration).toEqualTypeOf<FogExploration.Implementation | null>();
    expectTypeOf(myFogManager["_updated"]).toBeBoolean();
    expectTypeOf(
      myFogManager["_prepareFogUpdateData"]("base64:asfasgad252345+=5236236adfa"),
    ).toEqualTypeOf<FogExploration.UpdateData>();
  });

  test("Texture Stuff", () => {
    expectTypeOf(myFogManager.extractor).toEqualTypeOf<TextureExtractor | undefined | null>();
    expectTypeOf(myFogManager.sprite).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(myFogManager.textureConfiguration).toEqualTypeOf<CanvasVisibility.TextureConfiguration | undefined>();
    expectTypeOf(myFogManager["_createExplorationObject"](texture)).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(myFogManager["_extractBase64"]()).toEqualTypeOf<Promise<string>>();
  });
});
