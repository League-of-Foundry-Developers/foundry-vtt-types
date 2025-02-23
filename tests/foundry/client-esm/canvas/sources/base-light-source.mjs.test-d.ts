import { expectTypeOf } from "vitest";
import type BaseLightSource from "../../../../../src/foundry/client-esm/canvas/sources/base-light-source.d.mts";
import type RenderedEffectSource from "../../../../../src/foundry/client-esm/canvas/sources/rendered-effect-source.d.mts";

class MyLightSource extends foundry.canvas.sources.BaseLightSource {}

expectTypeOf(MyLightSource.sourceType).toBeString();
expectTypeOf(MyLightSource["_initializeShaderKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyLightSource["_refreshUniformsKeys"]).toEqualTypeOf<string[]>();
expectTypeOf(MyLightSource["_dimLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["_brightLightingLevel"]).toEqualTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["ANIMATIONS"]).toMatchTypeOf<Record<string, RenderedEffectSource.AnimationConfig>>();
expectTypeOf(MyLightSource.defaultData).toEqualTypeOf<BaseLightSource.SourceData>();

declare const someToken: Token.ConfiguredInstance;
const mySource = new MyLightSource({ object: someToken, sourceId: "asfsdfs" });

expectTypeOf(mySource.ratio).toBeNumber();

expectTypeOf(
  mySource["_initialize"]({
    priority: 7,
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
expectTypeOf(mySource._noise).toEqualTypeOf<SmoothNoise | undefined>();

expectTypeOf(mySource.animatePulse(7)).toBeVoid();
expectTypeOf(mySource.animateTorch(23, { intensity: undefined, reverse: null, speed: undefined })).toBeVoid();
// animateFlickering is the only animation function with an extra option (`amplification`)
expectTypeOf(mySource.animateFlickering(12, { amplification: -3, intensity: 2, reverse: true, speed: 10 })).toBeVoid();

// deprecated since v12, until v14
expectTypeOf(mySource.isDarkness).toBeBoolean();
