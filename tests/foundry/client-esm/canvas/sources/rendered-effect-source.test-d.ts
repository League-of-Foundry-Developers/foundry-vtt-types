import { expectTypeOf } from "vitest";
import type RenderedEffectSource from "../../../../../src/foundry/client-esm/canvas/sources/rendered-effect-source.d.mts";

declare class MyRenderedSource extends foundry.canvas.sources.RenderedEffectSource {
  protected override _createShapes(): void;
}

expectTypeOf(MyRenderedSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyRenderedSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyRenderedSource["_layers"]).toEqualTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(MyRenderedSource.EDGE_OFFSET).toBeNumber();
expectTypeOf(MyRenderedSource.defaultData).toEqualTypeOf<RenderedEffectSource.SourceData>();

expectTypeOf(
  MyRenderedSource.getCorrectedLevel(CONST.LIGHTING_LEVELS.BRIGHT),
).toMatchTypeOf<foundry.CONST.LIGHTING_LEVELS>();
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
expectTypeOf(
  MyRenderedSource.getCorrectedColor(
    CONST.LIGHTING_LEVELS.HALFDARK,
    Color.from("9C9C9C"),
    Color.from([0.2, 0.7, 0.65]),
    null,
  ),
).toEqualTypeOf<Color>();

const mySource = new MyRenderedSource();

expectTypeOf(mySource.animation).toEqualTypeOf<RenderedEffectSource.StoredAnimationConfig>();

// if there's a `darknessShader`, it's a `DarknessAnimationConfig`
if (mySource.animation.darknessShader) {
  expectTypeOf(mySource.animation.darknessShader).toEqualTypeOf<AdaptiveDarknessShader.AnyConstructor>();
} else {
  expectTypeOf(mySource.animation.illuminationShader).toEqualTypeOf<
    AdaptiveIlluminationShader.AnyConstructor | undefined | null
  >();
  expectTypeOf(mySource.animation.colorationShader).toEqualTypeOf<
    AdaptiveColorationShader.AnyConstructor | undefined | null
  >();
  expectTypeOf(mySource.animation.backgroundShader).toEqualTypeOf<
    AdaptiveBackgroundShader.AnyConstructor | undefined | null
  >();
}

expectTypeOf(mySource.layers).toEqualTypeOf<RenderedEffectSource.Layers>();
expectTypeOf(mySource.layers.background.mesh).toEqualTypeOf<PointSourceMesh | undefined>();

expectTypeOf(mySource.colorRGB).toEqualTypeOf<Color.RGBColorVector | null>();
expectTypeOf(mySource["_geometry"]).toEqualTypeOf<PIXI.Geometry | null>();
expectTypeOf(mySource.isAnimated).toBeBoolean();
expectTypeOf(mySource.hasActiveLayer).toBeBoolean();
expectTypeOf(mySource.isPreview).toBeBoolean();

expectTypeOf(mySource.background).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.coloration).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.illumination).toEqualTypeOf<PointSourceMesh>();

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
expectTypeOf(mySource["_configure"]({})).toBeVoid();
expectTypeOf(mySource["_configureShaders"]()).toEqualTypeOf<
  Record<keyof RenderedEffectSource.Layers, AdaptiveLightingShader.AnyConstructor>
>();

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
expectTypeOf(mySource.drawMeshes().coloration).toEqualTypeOf<PointSourceMesh | null>();
expectTypeOf(mySource["_drawMesh"]("illumination")).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();

expectTypeOf(mySource.animate(0.8)).toBeVoid();
expectTypeOf(mySource.animateTime(1)).toBeVoid();
expectTypeOf(
  mySource.animateTime(1, {
    intensity: undefined,
    reverse: null,
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

const meshes = mySource.drawMeshes();
expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(meshes.background?.visible).toEqualTypeOf<boolean | undefined>();

//deprecated since v11, until v13
expectTypeOf(mySource.preview).toBeBoolean();
expectTypeOf((mySource.preview = false)).toBeBoolean();
