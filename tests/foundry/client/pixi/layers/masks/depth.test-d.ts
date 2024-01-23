import { expectTypeOf } from "vitest";

const mySprite = new SpriteMesh();

const myDepthMask = new CanvasDepthMask(mySprite);

expectTypeOf(myDepthMask.createRenderTexture()).toEqualTypeOf<PIXI.RenderTexture>();

expectTypeOf(myDepthMask.clearColor[3]).toEqualTypeOf<number>();
