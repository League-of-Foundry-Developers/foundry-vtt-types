import { expectTypeOf } from "vitest";

import CachedContainer = foundry.canvas.containers.CachedContainer;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import CanvasIlluminationEffects = foundry.canvas.layers.CanvasIlluminationEffects;
import DarknessLevelContainer = foundry.canvas.layers.DarknessLevelContainer;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import VisualEffectsMaskingFilter = foundry.canvas.rendering.filters.VisualEffectsMaskingFilter;

const layer = new CanvasIlluminationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<CanvasLayer.AnyConstructor>();

expectTypeOf(layer.filter).toEqualTypeOf<VisualEffectsMaskingFilter.Implementation | undefined>();
expectTypeOf(layer.lights).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.baselineMesh).toEqualTypeOf<SpriteMesh>();
expectTypeOf(layer.darknessLevelMeshes).toEqualTypeOf<DarknessLevelContainer>();

expectTypeOf(layer.hasDynamicDarknessLevel).toBeBoolean();
expectTypeOf(layer.renderTexture).toEqualTypeOf<PIXI.RenderTexture>();

expectTypeOf(layer.clear()).toBeVoid();
expectTypeOf(layer.invalidateDarknessLevelContainer(true)).toBeVoid();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasIlluminationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

// deprecated until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.background()).toBeNull();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.globalLight).toBeBoolean();

// Literally no instance changes to test on DLC
expectTypeOf(DarknessLevelContainer.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();
