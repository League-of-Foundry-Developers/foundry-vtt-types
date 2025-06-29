import { expectTypeOf } from "vitest";

import PointLightSource = foundry.canvas.sources.PointLightSource;

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import FairyLightIlluminationShader = foundry.canvas.rendering.shaders.FairyLightIlluminationShader;
import FairyLightColorationShader = foundry.canvas.rendering.shaders.FairyLightColorationShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

expectTypeOf(PointLightSource.sourceType).toEqualTypeOf<"light">();
expectTypeOf(PointLightSource.effectsCollection).toBeString();
expectTypeOf(PointLightSource["ANIMATIONS"]).toExtend<Record<string, CONFIG.Canvas.LightSourceAnimationConfig>>();
expectTypeOf(PointLightSource.defaultData).toEqualTypeOf<PointLightSource.SourceData>();

declare const object: foundry.canvas.placeables.AmbientLight.Implementation;
new PointLightSource();
new PointLightSource({ object: undefined, sourceId: undefined });
const mySource = new PointLightSource({ object, sourceId: object.sourceId });
// #initialize param tests are with BaseEffectSource
const initializedSource = mySource.initialize();

expectTypeOf(mySource.data).toEqualTypeOf<PointLightSource.SourceData>();

expectTypeOf(mySource.shape).toEqualTypeOf<PointLightSource.ImplementationPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointLightSource.ImplementationPolygon>();
const _shape: foundry.canvas.geometry.PointSourcePolygon = initializedSource.shape;

expectTypeOf(mySource.requiresEdges).toBeBoolean();

expectTypeOf(mySource.background).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.coloration).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.illumination).toEqualTypeOf<PointSourceMesh>();

const sourceData = {
  x: 50,
  y: 50,
  alpha: 0.1,
  angle: 215,
  animation: {
    animation: PointLightSource.prototype.animateTime,
    illuminationShader: FairyLightIlluminationShader,
    colorationShader: FairyLightColorationShader,
    backgroundShader: AdaptiveBackgroundShader,
    seed: 987654321,
  },
  attenuation: 0,
  bright: 10,
  color: 0xffffff,
  coloration: 1,
  contrast: 0.7,
  dim: 20,
  disabled: false,
  elevation: 0,
  externalRadius: 0,
  luminosity: 1,
  preview: false,
  priority: 17,
  radius: 50,
  rotation: 0,
  saturation: 1,
  seed: 42,
  shadows: 1,
  vision: true,
  walls: false,
} satisfies PointLightSource.SourceData;

expectTypeOf(mySource["_initialize"]({})).toBeVoid();
expectTypeOf(mySource["_initialize"](sourceData)).toBeVoid();

expectTypeOf(mySource["_createShapes"]()).toBeVoid();

// AnyObject until we get Flatten
expectTypeOf(mySource["_configure"]({})).toBeVoid();
expectTypeOf(mySource["_configure"](sourceData)).toBeVoid();

expectTypeOf(mySource.drawMeshes().background).toEqualTypeOf<PointSourceMesh | null>();
// @ts-expect-error foo is not a RenderingLayers key
expectTypeOf(mySource.drawMeshes().foo).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_drawMesh"]("background")).toEqualTypeOf<PointSourceMesh | null>;
// @ts-expect-error foo is not a RenderingLayers key
expectTypeOf(mySource["_drawMesh"]("foo")).toEqualTypeOf<PointSourceMesh | null>;

expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointLightSource.PolygonConfig>();

declare const someVisionSource: foundry.canvas.sources.PointVisionSource;
const tests = [
  {
    elevation: 0,
    los: new Map([[someVisionSource, true]]),
    point: { x: 50, y: 50 },
  },
];
expectTypeOf(mySource.testVisibility({ object: object, tests }));
expectTypeOf(mySource.testVisibility({ object: null, tests }));
expectTypeOf(mySource.testVisibility({ tests }));

expectTypeOf(mySource["_canDetectObject"]()).toBeBoolean();
expectTypeOf(mySource["_canDetectObject"](null)).toBeBoolean();
expectTypeOf(mySource["_canDetectObject"](object)).toBeBoolean();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toEqualTypeOf<false>();
