import { expectTypeOf } from "vitest";

const layer = new CanvasIlluminationEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();

expectTypeOf(layer.filter).toEqualTypeOf<VisualEffectsMaskingFilter.ConfiguredInstance | undefined>();
expectTypeOf(layer.lights).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.backgroundColorTexture).toEqualTypeOf<PIXI.Texture>();
expectTypeOf(layer.baselineMesh).toEqualTypeOf<SpriteMesh>();
expectTypeOf(layer.darknessLevelMeshes).toEqualTypeOf<DarknessLevelContainer>();

expectTypeOf(layer.hasDynamicDarknessLevel).toBeBoolean();
expectTypeOf(layer.renderTexture).toEqualTypeOf<PIXI.RenderTexture>();

// getter not actually defined
expectTypeOf(layer.backgroundColor).toBeUndefined();
layer.backgroundColor = 0xfeafdd;
layer.backgroundColor = "#123456";
layer.backgroundColor = [0.2, 0.4, 0.9];

expectTypeOf(layer.clear()).toBeVoid();
expectTypeOf(layer.invalidateDarknessLevelContainer(true)).toBeVoid();
expectTypeOf(layer["_createBackgroundColorTexture"]()).toEqualTypeOf<PIXI.Texture>();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasIlluminationEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

// deprecated until v13
expectTypeOf(layer.updateGlobalLight()).toEqualTypeOf<false>();
// deprecated until v14
expectTypeOf(layer.background()).toBeNull();
expectTypeOf(layer.globalLight).toBeBoolean();

// Literally no instance changes to test on DLC
expectTypeOf(DarknessLevelContainer.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();
