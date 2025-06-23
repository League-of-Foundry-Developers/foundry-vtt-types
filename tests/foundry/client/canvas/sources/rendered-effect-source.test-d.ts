import { expectTypeOf } from "vitest";

import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import AdaptiveLightingShader = foundry.canvas.rendering.shaders.AdaptiveLightingShader;
import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import BlackHoleDarknessShader = foundry.canvas.rendering.shaders.BlackHoleDarknessShader;
import FlameIlluminationShader = foundry.canvas.rendering.shaders.FlameIlluminationShader;
import FlameColorationShader = foundry.canvas.rendering.shaders.FlameColorationShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

declare class MyRenderedSource extends foundry.canvas.sources.RenderedEffectSource {
  protected override _createShapes(): void;
}

expectTypeOf(MyRenderedSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyRenderedSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyRenderedSource["_layers"]).toEqualTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(MyRenderedSource.EDGE_OFFSET).toBeNumber();
expectTypeOf(MyRenderedSource.defaultData).toEqualTypeOf<RenderedEffectSource.SourceData>();

expectTypeOf(MyRenderedSource.getCorrectedLevel(CONST.LIGHTING_LEVELS.BRIGHT)).toExtend<CONST.LIGHTING_LEVELS>();
expectTypeOf(
  MyRenderedSource.getCorrectedColor(
    CONST.LIGHTING_LEVELS.HALFDARK,
    Color.from("9C9C9C"),
    Color.from([0.2, 0.7, 0.65]),
  ),
).toEqualTypeOf<Color>();
expectTypeOf(
  MyRenderedSource.getCorrectedColor(
    CONST.LIGHTING_LEVELS.HALFDARK,
    Color.from("9C9C9C"),
    Color.from([0.2, 0.7, 0.65]),
    Color.from(0x0),
  ),
).toEqualTypeOf<Color>();

declare const object: foundry.canvas.placeables.Token.Implementation;
new MyRenderedSource();
new MyRenderedSource({ object: undefined, sourceId: undefined });
const mySource = new MyRenderedSource({ object, sourceId: object.sourceId });

expectTypeOf(mySource.animation).toEqualTypeOf<RenderedEffectSource.StoredAnimationConfig>();

expectTypeOf(mySource.layers).toEqualTypeOf<RenderedEffectSource.Layers>();
// @ts-expect-error RenderedEffectSource provides no layers as of v13
expectTypeOf(mySource.layers.background.mesh).toEqualTypeOf<PointSourceMesh | undefined>();

expectTypeOf(mySource.colorRGB).toEqualTypeOf<Color.RGBColorVector | null>();
expectTypeOf(mySource["_geometry"]).toEqualTypeOf<PIXI.Geometry | null>();
expectTypeOf(mySource.isAnimated).toBeBoolean();
expectTypeOf(mySource.hasActiveLayer).toBeBoolean();
expectTypeOf(mySource.isPreview).toBeBoolean();

// RenderedEffectSource provides no layers, so has no meshes
expectTypeOf(mySource.background).toEqualTypeOf<undefined>();
expectTypeOf(mySource.coloration).toEqualTypeOf<undefined>();
expectTypeOf(mySource.illumination).toEqualTypeOf<undefined>();

// only new SourceData keys tested here, thorough tests are on the final Point*Source classes
expectTypeOf(
  mySource["_initialize"]({
    color: 0xfedcba,
    preview: true,
    seed: 420,
    animation: {
      label: "MYSOURCE.SomeAnimation.Label",
      animation: foundry.canvas.sources.RenderedEffectSource.prototype.animateTime,
      darknessShader: BlackHoleDarknessShader,
    },
  }),
).toBeVoid();
expectTypeOf(
  mySource["_initialize"]({
    color: null,
    preview: false,
    seed: null,
    animation: {
      label: "MYSOURCE.SomeOtherAnimation.Label",
      animation: foundry.canvas.sources.RenderedEffectSource.prototype.animateTime,
      illuminationShader: FlameIlluminationShader,
      colorationShader: FlameColorationShader,
      seed: 42,
    },
  }),
).toBeVoid();

expectTypeOf(mySource["_initializeSoftEdges"]()).toBeVoid();

// AnyObject until we get Flatten
expectTypeOf(mySource["_configure"]({})).toBeVoid();

// RenderedEffectSource provides no layers
expectTypeOf(mySource["_configureShaders"]()).toEqualTypeOf<Record<never, AdaptiveLightingShader.AnyConstructor>>();

const someBackgroundShader = AdaptiveBackgroundShader.create();
expectTypeOf(
  mySource["_configureLayer"](
    {
      active: true,
      blendMode: "COLOR_BURN",
      defaultShader: AdaptiveBackgroundShader,
      mesh: undefined,
      reset: false,
      suppressed: false,
      shader: someBackgroundShader,
      vmUniforms: undefined,
    },
    "background",
  ),
).toBeVoid();

expectTypeOf(mySource["_updateGeometry"]()).toBeVoid();

// RenderedEffectSource provides no layers
expectTypeOf(mySource.drawMeshes()).toEqualTypeOf<Record<never, PointSourceMesh | null>>();
// @ts-expect-error as RES provides no layers there are no valid keys to pass
expectTypeOf(mySource["_drawMesh"]("illumination")).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();

// #animateTime is the prototypical AnimationFunction, it's the provided one in most core-
// provided configs, and the ones that aren't it call it
const _animationFunction: RenderedEffectSource.AnimationFunction = mySource.animateTime;

expectTypeOf(mySource.animate(0.8)).toBeVoid();
expectTypeOf(mySource.animateTime(1)).toBeVoid();
expectTypeOf(
  mySource.animateTime(1, {
    intensity: undefined,
    reverse: undefined,
    speed: undefined,
  }),
).toBeVoid();
expectTypeOf(
  mySource.animateTime(1, {
    intensity: 7,
    reverse: true,
    speed: 3,
  }),
).toBeVoid();
