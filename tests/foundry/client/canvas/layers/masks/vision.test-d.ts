import { expectTypeOf } from "vitest";

import AlphaBlurFilter = foundry.canvas.rendering.filters.AlphaBlurFilter;
import VoidFilter = foundry.canvas.rendering.filters.VoidFilter;
import CanvasVisionMask = foundry.canvas.layers.CanvasVisionMask;
import CachedContainer = foundry.canvas.containers.CachedContainer;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

expectTypeOf(CanvasVisionMask.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();

const mySprite = new SpriteMesh();
const myVisionMask = new CanvasVisionMask(mySprite);

expectTypeOf(myVisionMask.clearColor).toEqualTypeOf<Color.RGBAColorVector>();
expectTypeOf(myVisionMask.autoRender).toBeBoolean();
expectTypeOf(myVisionMask.vision).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer | undefined>();
const vis = myVisionMask.vision;
if (vis) {
  expectTypeOf(vis.containmentFilter).toEqualTypeOf<VoidFilter>();
  expectTypeOf(vis.sight.preview).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.darkness.darkness).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.light.global.meshes).toEqualTypeOf<PIXI.Container>();
  // deprecated since v12 until v14
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(vis.light.tokens.tokens.tokens.tokens).toEqualTypeOf<typeof vis.light>();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(vis.base).toEqualTypeOf<typeof vis.light.preview>();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(vis.fov).toEqualTypeOf<typeof vis.light>();
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(vis.los).toEqualTypeOf<typeof vis.light.mask>();
}

expectTypeOf(myVisionMask.blurFilter).toEqualTypeOf<AlphaBlurFilter | undefined>();

expectTypeOf(myVisionMask.draw()).toEqualTypeOf<Promise<void>>();

declare const someVisionContainer: CanvasVisionMask.CanvasVisionContainer;
expectTypeOf(myVisionMask.attachVision(someVisionContainer)).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer>();
expectTypeOf(myVisionMask.detachVision()).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer>();
