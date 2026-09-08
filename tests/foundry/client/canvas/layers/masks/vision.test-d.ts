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
  expectTypeOf(vis.sight.surfaceExposure).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.sight.shared).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.darkness).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainerDarkness>();
  expectTypeOf(vis.light.global.meshes).toEqualTypeOf<PIXI.Container>();
  expectTypeOf(vis.light.surfaceExposure).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.light.mask.shared).toEqualTypeOf<PIXI.LegacyGraphics>();
  expectTypeOf(vis.light.mask.surfaceExposure).toEqualTypeOf<PIXI.LegacyGraphics>();
}

expectTypeOf(myVisionMask.blurFilter).toEqualTypeOf<AlphaBlurFilter | undefined>();

expectTypeOf(myVisionMask.draw()).toEqualTypeOf<Promise<void>>();

declare const someVisionContainer: CanvasVisionMask.CanvasVisionContainer;
expectTypeOf(myVisionMask.attachVision(someVisionContainer)).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer>();
expectTypeOf(myVisionMask.detachVision()).toEqualTypeOf<CanvasVisionMask.CanvasVisionContainer>();
