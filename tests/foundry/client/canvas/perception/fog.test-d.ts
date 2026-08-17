import { describe, expectTypeOf, test } from "vitest";

import type { AnyObject } from "#utils";

import FogManager = foundry.canvas.perception.FogManager;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import TextureExtractor = foundry.canvas.TextureExtractor;

declare const texture: PIXI.Texture;
declare const user: User.Stored;
declare const exploration: FogExploration.Implementation;

describe("FogManager tests", () => {
  test("Construction", () => {
    new FogManager();
  });

  const myFogManager = new FogManager();

  test("Miscellaneous", () => {
    expectTypeOf(FogManager.emittedEvents).toEqualTypeOf<readonly string[]>();
    expectTypeOf(myFogManager.tokenVision).toBeBoolean();
    expectTypeOf(myFogManager.fogExploration).toBeBoolean();
    expectTypeOf(myFogManager.sharedExploration).toBeBoolean();
    expectTypeOf(myFogManager.isPointExplored({ x: 500, y: 300 })).toBeBoolean();
    expectTypeOf(myFogManager.initialize()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.clear()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.destroy()).toEqualTypeOf<void>();
    expectTypeOf(myFogManager.commit()).toEqualTypeOf<void>();
    expectTypeOf(myFogManager.load()).toEqualTypeOf<Promise<PIXI.Texture | void>>();
    expectTypeOf(myFogManager.load({})).toEqualTypeOf<Promise<PIXI.Texture | void>>();
    expectTypeOf(myFogManager.load({ preserve: true })).toEqualTypeOf<Promise<PIXI.Texture | void>>();
    expectTypeOf(myFogManager.reset()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.save()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.save({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.save({ share: true })).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.sync(user, [user, user])).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager["_handleReset"]()).toEqualTypeOf<Promise<void>>();
  });

  test("Data", () => {
    expectTypeOf(myFogManager.exploration).toEqualTypeOf<FogExploration.Implementation | null>();
    expectTypeOf(myFogManager["_updated"]).toBeBoolean();
    expectTypeOf(
      myFogManager["_prepareFogUpdateData"]("base64:asfasgad252345+=5236236adfa"),
    ).toEqualTypeOf<FogExploration.UpdateData>();
    expectTypeOf(myFogManager["_createExplorationDocument"]()).toEqualTypeOf<FogExploration.Implementation>();
    expectTypeOf(
      myFogManager["_createExplorationDocument"]({ scene: "XXXXXSomeIDXXXXX" }),
    ).toEqualTypeOf<FogExploration.Implementation>();
  });

  test("Texture Stuff", () => {
    expectTypeOf(myFogManager.extractor).toEqualTypeOf<TextureExtractor | undefined | null>();
    expectTypeOf(myFogManager.sprite).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(myFogManager.textureConfiguration).toEqualTypeOf<CanvasVisibility.TextureConfiguration | undefined>();
    expectTypeOf(myFogManager["_createExplorationObject"](texture)).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(myFogManager["_extractBase64"]()).toEqualTypeOf<Promise<string | undefined>>();
    expectTypeOf(
      myFogManager["_getBase64ExtractionConfiguration"](),
    ).toEqualTypeOf<FogManager.Base64ExtractionConfiguration>();
    expectTypeOf(myFogManager["_createExplorationRenderTexture"]()).toEqualTypeOf<Promise<PIXI.RenderTexture>>();
  });

  test("Shared Exploration", () => {
    expectTypeOf(myFogManager["_unionizeSharedExploration"]([exploration])).toEqualTypeOf<
      Promise<FogManager.UnionizedExploration>
    >();
    expectTypeOf(myFogManager["_applySharedExploration"]("base64:asdf")).toEqualTypeOf<
      Promise<AnyObject | undefined>
    >();
    expectTypeOf(myFogManager["_applySharedExploration"]("base64:asdf", { someToken: [50, 300] })).toEqualTypeOf<
      Promise<AnyObject | undefined>
    >();
  });
});
