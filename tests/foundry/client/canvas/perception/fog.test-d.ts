import { describe, expectTypeOf, test } from "vitest";

import FogManager = foundry.canvas.perception.FogManager;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import TextureExtractor = foundry.canvas.TextureExtractor;

declare const someTex: PIXI.Texture;

describe("FogManager Tests", () => {
  test("Construction", () => {
    new FogManager();
  });

  const myFogManager = new FogManager();

  test("Uncategorized", () => {
    expectTypeOf(FogManager.emittedEvents).toEqualTypeOf<readonly string[]>();
    expectTypeOf(FogManager.COMMIT_THRESHOLD).toBeNumber();
    expectTypeOf(myFogManager.exploration).toEqualTypeOf<FogExploration.Implementation | null>();
    expectTypeOf(myFogManager["_updated"]).toBeBoolean();
    expectTypeOf(myFogManager.sprite).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(myFogManager.extractor).toEqualTypeOf<TextureExtractor | undefined | null>();
    expectTypeOf(myFogManager.textureConfiguration).toEqualTypeOf<CanvasVisibility.TextureConfiguration | undefined>();

    expectTypeOf(myFogManager.initialize()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.clear()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.commit()).toEqualTypeOf<void>();
    expectTypeOf(myFogManager.load()).toEqualTypeOf<Promise<PIXI.Texture | void>>();
    expectTypeOf(myFogManager.reset()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager.save()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myFogManager["_handleReset"]()).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myFogManager["_extractBase64"]()).toEqualTypeOf<Promise<string>>();
    expectTypeOf(myFogManager["_createExplorationObject"](someTex)).toEqualTypeOf<SpriteMesh>();
    expectTypeOf(
      myFogManager["_prepareFogUpdateData"]("base64:asfasgad252345+=5236236adfa"),
    ).toEqualTypeOf<FogExploration.UpdateData>();
  });
});
