import { expectTypeOf } from "vitest";

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
expectTypeOf(MyLightSource["_dimLightingLevel"]).toEqualTypeOf<CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["_brightLightingLevel"]).toEqualTypeOf<CONST.LIGHTING_LEVELS>();
expectTypeOf(MyLightSource["ANIMATIONS"]).toExtend<Record<string, RenderedEffectSource.AnimationConfig>>();
expectTypeOf(MyLightSource["_layers"]).toEqualTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(MyLightSource.defaultData).toEqualTypeOf<BaseLightSource.SourceData>();

declare const object: foundry.canvas.placeables.Token.Implementation;
new MyLightSource();
new MyLightSource({ object: undefined, sourceId: undefined });
const mySource = new MyLightSource({ object, sourceId: object.sourceId });

// Any matches because we didn't provide any non-default type params
expectTypeOf(mySource.initialize()).toEqualTypeOf<BaseLightSource.Any>();

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
expectTypeOf(mySource.animateSoundPulse(15, { intensity: 3, reverse: false, speed: 10 }));

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toBeBoolean();
