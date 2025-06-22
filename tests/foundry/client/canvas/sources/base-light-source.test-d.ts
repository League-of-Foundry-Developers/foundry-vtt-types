import { expectTypeOf } from "vitest";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

import BaseLightSource = foundry.canvas.sources.BaseLightSource;
import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

declare class MyLightSource extends foundry.canvas.sources.BaseLightSource {
  protected override _createShapes(): void;
}

expectTypeOf(MyLightSource.sourceType).toBeString();
expectTypeOf(MyLightSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyLightSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyLightSource["_dimLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["_brightLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["ANIMATIONS"]).toExtend<Record<string, RenderedEffectSource.AnimationConfig>>();
expectTypeOf(MyLightSource.defaultData).toEqualTypeOf<BaseLightSource.SourceData>();

declare const someToken: Token.Implementation;
const mySource = new MyLightSource({ object: someToken, sourceId: "asfsdfs" });

expectTypeOf(mySource.ratio).toBeNumber();

expectTypeOf(mySource.background).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.coloration).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.illumination).toEqualTypeOf<PointSourceMesh>();

// only new SourceData keys tested here, thorough tests are on the final Point*Source classes
expectTypeOf(
  mySource["_initialize"]({
    alpha: 0.2,
    bright: 50,
    dim: 100,
    attenuation: 0.9,
    luminosity: 0.87,
    saturation: 0.2,
    shadows: 1,
    vision: true,
  }),
).toBeVoid();

expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
declare const someBackgroundShader: AdaptiveBackgroundShader;
expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();

expectTypeOf(mySource.cachedAttenuation).toEqualTypeOf<number | undefined>();
expectTypeOf(mySource.computedAttenuation).toEqualTypeOf<number | undefined>();

// the LightAnimationFunctions all share an options interface
expectTypeOf(mySource.animatePulse(7)).toBeVoid();
expectTypeOf(mySource.animateTorch(23, { intensity: undefined, reverse: undefined, speed: undefined })).toBeVoid();
// animateFlickering is the only animation function with an extra option (`amplification`)
expectTypeOf(mySource.animateFlickering(12, { amplification: -3, intensity: 2, reverse: true, speed: 10 })).toBeVoid();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toBeBoolean();
