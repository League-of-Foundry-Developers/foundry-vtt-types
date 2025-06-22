import { expectTypeOf } from "vitest";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import PointLightSource = foundry.canvas.sources.PointLightSource;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import FairyLightIlluminationShader = foundry.canvas.rendering.shaders.FairyLightIlluminationShader;
import FairyLightColorationShader = foundry.canvas.rendering.shaders.FairyLightColorationShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

expectTypeOf(PointLightSource.effectsCollection).toBeString();
expectTypeOf(PointLightSource.defaultData).toEqualTypeOf<PointLightSource.SourceData>();

const mySource = new PointLightSource();

expectTypeOf(mySource.data).toEqualTypeOf<PointLightSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();

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
expectTypeOf(mySource["_configure"]({})).toBeVoid();
expectTypeOf(mySource["_configure"](sourceData)).toBeVoid();

expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointLightSource.PolygonConfig>();

declare const someVisionSource: foundry.canvas.sources.PointVisionSource;
declare const someToken: Token.Implementation;
const tests = [
  {
    elevation: 0,
    los: new Map([[someVisionSource, true]]),
    point: { x: 50, y: 50 },
  },
];
expectTypeOf(mySource.testVisibility({ object: someToken, tests }));
expectTypeOf(mySource.testVisibility({ object: null, tests }));
expectTypeOf(mySource.testVisibility({ tests }));

expectTypeOf(mySource["_canDetectObject"]()).toBeBoolean();
expectTypeOf(mySource["_canDetectObject"](null)).toBeBoolean();
expectTypeOf(mySource["_canDetectObject"](someToken)).toBeBoolean();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toEqualTypeOf<false>();
