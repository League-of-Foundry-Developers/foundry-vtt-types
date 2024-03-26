import { expectTypeOf } from "vitest";

const mySprite = new SpriteMesh();

const myOcclusionMask = new CanvasOcclusionMask(mySprite);

expectTypeOf(myOcclusionMask.createRenderTexture()).toEqualTypeOf<PIXI.RenderTexture>();

expectTypeOf(myOcclusionMask.clearColor[3]).toEqualTypeOf<number>();
