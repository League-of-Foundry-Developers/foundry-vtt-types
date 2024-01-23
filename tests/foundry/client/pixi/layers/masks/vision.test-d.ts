import { expectTypeOf } from "vitest";

const mySprite = new SpriteMesh();

const myVisionMask = new CanvasVisionMask(mySprite);

const myVisionContainer = new PIXI.Container();

expectTypeOf(myVisionMask.createRenderTexture()).toEqualTypeOf<PIXI.RenderTexture>();

expectTypeOf(myVisionMask.clearColor[3]).toEqualTypeOf<number>();

expectTypeOf(myVisionMask.attachVision(myVisionContainer)).toEqualTypeOf<CanvasVisionContainer>();
