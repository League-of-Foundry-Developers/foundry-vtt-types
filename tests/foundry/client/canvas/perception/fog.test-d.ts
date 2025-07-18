import { expectTypeOf } from "vitest";
import { FogManager } from "#client/canvas/perception/_module.mjs";

import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import TextureExtractor = foundry.canvas.TextureExtractor;

expectTypeOf(FogManager.COMMIT_THRESHOLD).toBeNumber();

declare const someTex: PIXI.Texture;
const myFogManager = new FogManager();

expectTypeOf(myFogManager.exploration).toEqualTypeOf<FogExploration.Implementation | null>();
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

// deprecated since v11 until v13
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myFogManager.pending).toEqualTypeOf<PIXI.Container | undefined>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myFogManager.revealed).toEqualTypeOf<PIXI.Container | undefined>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myFogManager.update("garbage", true)).toEqualTypeOf<true>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myFogManager.resolution).toEqualTypeOf<CanvasVisibility.TextureConfiguration | undefined>();
