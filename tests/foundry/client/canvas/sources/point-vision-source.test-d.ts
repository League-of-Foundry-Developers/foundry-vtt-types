import { expectTypeOf } from "vitest";

import AdaptiveVisionShader = foundry.canvas.rendering.shaders.AdaptiveVisionShader;
import BackgroundVisionShader = foundry.canvas.rendering.shaders.BackgroundVisionShader;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import VisionMode = foundry.canvas.perception.VisionMode;

expectTypeOf(PointVisionSource.sourceType).toBeString();
expectTypeOf(PointVisionSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(PointVisionSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(PointVisionSource["_dimLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointVisionSource["_brightLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointVisionSource.EDGE_OFFSET).toBeNumber();
expectTypeOf(PointVisionSource.effectsCollection).toBeString();
expectTypeOf(PointVisionSource.defaultData).toEqualTypeOf<PointVisionSource.SourceData>();
expectTypeOf(PointVisionSource["_layers"]).toEqualTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();

const mySource = new PointVisionSource();

expectTypeOf(mySource.data).toEqualTypeOf<PointVisionSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.visionMode).toEqualTypeOf<VisionMode | undefined>();
expectTypeOf(mySource["_visionModeActivated"]).toBeBoolean();
expectTypeOf(mySource.los).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.light).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.fov).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource.preferred).toEqualTypeOf<boolean | undefined>();
expectTypeOf(mySource.isAnimated).toBeBoolean();
expectTypeOf(mySource.lightRadius).toBeNumber();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.radius).toBeNumber();
expectTypeOf(mySource.isBlinded).toBeBoolean();
expectTypeOf(mySource.blinded).toEqualTypeOf<PointVisionSource.BlindedReasons>();
expectTypeOf(mySource.visionModeOverrides).toEqualTypeOf<PointVisionSource.VisionModeOverrides>();

// Every property of SourceData represented for testing, not all necessarily actually used by this type
expectTypeOf(
  mySource["_initialize"]({
    angle: 100,
    animation: {
      animation: PointVisionSource.prototype.animateTime,
      // not actually sure if vision animation takes shaders here or not, so omitted
    },
    attenuation: -1,
    blinded: false,
    brightness: 0.6,
    color: 0xfeafef,
    contrast: -0.2,
    disabled: false,
    elevation: 10,
    externalRadius: 20000,
    lightRadius: 3123,
    preview: false,
    radius: 222,
    rotation: 179,
    saturation: 0.3,
    seed: 2442,
    visionMode: "darkvision",
    walls: false,
    x: 10,
    y: 20,
  }),
).toBeVoid();
expectTypeOf(mySource["_createShapes"]()).toBeVoid();

const someBackgroundShader = BackgroundVisionShader.create();
expectTypeOf(
  mySource["_configureLayer"](
    {
      active: true,
      blendMode: "SATURATION",
      defaultShader: BackgroundVisionShader,
      mesh: undefined,
      reset: false,
      suppressed: false,
      shader: someBackgroundShader,
      vmUniforms: {
        foo: 7,
        bar: new PIXI.Matrix(),
      },
    },
    "background",
  ),
).toBeVoid();

expectTypeOf(mySource["_configure"]({})).toBeVoid();
expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointVisionSource.PolygonConfig>();

expectTypeOf(mySource["_createLightPolygon"]()).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource["_createRestrictedPolygon"]()).toEqualTypeOf<PointSourcePolygon>();

expectTypeOf(mySource["_configureShaders"]()).toEqualTypeOf<
  Record<keyof RenderedEffectSource.Layers, AdaptiveVisionShader.AnyConstructor>
>();

expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();

expectTypeOf(
  mySource["_updateVisionModeUniforms"](someBackgroundShader, [
    ["foo", 7],
    ["baz", [1, 1, 0, 1]],
  ]),
).toBeVoid();
