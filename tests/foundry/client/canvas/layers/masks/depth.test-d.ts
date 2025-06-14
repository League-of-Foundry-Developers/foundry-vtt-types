import { expectTypeOf } from "vitest";
import { CanvasDepthMask } from "#client/canvas/layers/_module.mjs";
import { CachedContainer } from "#client/canvas/containers/_module.mjs";

expectTypeOf(CanvasDepthMask.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();

const mySprite = new SpriteMesh();
const myDepthMask = new CanvasDepthMask(mySprite);

expectTypeOf(myDepthMask.roofs).toEqualTypeOf<PIXI.Container>();
expectTypeOf(myDepthMask.clearColor).toEqualTypeOf<Color.RGBAColorVector>();
expectTypeOf(myDepthMask["_elevationDirty"]).toBeBoolean();
expectTypeOf(myDepthMask.mapElevation(5)).toBeNumber();
expectTypeOf(myDepthMask["_update"]()).toBeVoid();
expectTypeOf(myDepthMask.clear()).toBeVoid();
