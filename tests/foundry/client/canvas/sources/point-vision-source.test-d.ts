import { expectTypeOf } from "vitest";

import AdaptiveVisionShader = foundry.canvas.rendering.shaders.AdaptiveVisionShader;
import BackgroundVisionShader = foundry.canvas.rendering.shaders.BackgroundVisionShader;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import VisionMode = foundry.canvas.perception.VisionMode;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

expectTypeOf(PointVisionSource.sourceType).toEqualTypeOf<"sight">();
expectTypeOf(PointVisionSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(PointVisionSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(PointVisionSource["_dimLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointVisionSource["_brightLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointVisionSource.EDGE_OFFSET).toBeNumber();
expectTypeOf(PointVisionSource.effectsCollection).toBeString();
expectTypeOf(PointVisionSource.defaultData).toEqualTypeOf<PointVisionSource.SourceData>();
expectTypeOf(PointVisionSource["_layers"]).toEqualTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();

declare const object: foundry.canvas.placeables.Token.Implementation;
new PointVisionSource();
new PointVisionSource({ object: undefined, sourceId: undefined });
const mySource = new PointVisionSource({ object, sourceId: object.sourceId });
// #initialize param tests are with BaseEffectSource
const initializedSource = mySource.initialize();

expectTypeOf(mySource.data).toEqualTypeOf<PointVisionSource.SourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<PointVisionSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();
const _shape: foundry.canvas.geometry.PointSourcePolygon = initializedSource.shape;

expectTypeOf(mySource.background).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.coloration).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.illumination).toEqualTypeOf<PointSourceMesh>();

expectTypeOf(mySource.visionMode).toEqualTypeOf<VisionMode | null>();
expectTypeOf(initializedSource.visionMode).toEqualTypeOf<VisionMode>();

expectTypeOf(mySource["_visionModeActivated"]).toBeBoolean();

expectTypeOf(mySource.los).toEqualTypeOf<PointVisionSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.los).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();

expectTypeOf(mySource.light).toEqualTypeOf<PointVisionSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.light).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();

expectTypeOf(mySource.fov).toEqualTypeOf<PointVisionSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.fov).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();

expectTypeOf(mySource.preferred).toEqualTypeOf<boolean | undefined>();
expectTypeOf(initializedSource.preferred).toEqualTypeOf<boolean>();

expectTypeOf(mySource.isAnimated).toBeBoolean();
expectTypeOf(mySource.lightRadius).toBeNumber();
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
expectTypeOf(mySource["_updateVisionMode"]()).toBeVoid();

// AnyObject until we get Flatten
expectTypeOf(mySource["_configure"]({})).toBeVoid();

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

expectTypeOf(mySource.drawMeshes().background).toEqualTypeOf<PointSourceMesh | null>();
// @ts-expect-error foo is not a RenderingLayers key
expectTypeOf(mySource.drawMeshes().foo).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_drawMesh"]("background")).toEqualTypeOf<PointSourceMesh | null>;
// @ts-expect-error foo is not a RenderingLayers key
expectTypeOf(mySource["_drawMesh"]("foo")).toEqualTypeOf<PointSourceMesh | null>;

expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointVisionSource.PolygonConfig>();
expectTypeOf(mySource["_createLightPolygon"]()).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();
expectTypeOf(mySource["_createRestrictedPolygon"]()).toEqualTypeOf<PointVisionSource.ImplementationPolygon>();
expectTypeOf(mySource["_configureShaders"]()).toEqualTypeOf<
  Record<keyof PointVisionSource.Layers, AdaptiveVisionShader.AnyConstructor>
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
