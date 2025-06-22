import { expectTypeOf } from "vitest";

import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;
import GlobalLightSource = foundry.canvas.sources.GlobalLightSource;
import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import PulseColorationShader = foundry.canvas.rendering.shaders.PulseColorationShader;
import PulseIlluminationShader = foundry.canvas.rendering.shaders.PulseIlluminationShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

expectTypeOf(GlobalLightSource.sourceType).toBeString();
expectTypeOf(GlobalLightSource.effectsCollection).toBeString();
expectTypeOf(GlobalLightSource.defaultData).toEqualTypeOf<GlobalLightSource.SourceData>();

declare const ecg: EffectsCanvasGroup;
const mySource = new GlobalLightSource({ object: ecg, sourceId: "globalLight" });

expectTypeOf(mySource.data).toEqualTypeOf<GlobalLightSource.SourceData>();
expectTypeOf(mySource.shape).toEqualTypeOf<PIXI.Polygon>();

// Every property of SourceData represented for testing, not all necessarily actually used by this type
expectTypeOf(
  mySource.initialize({
    alpha: 0.9,
    angle: 360,
    animation: {
      animation: GlobalLightSource.prototype.animatePulse,
      colorationShader: PulseColorationShader,
      illuminationShader: PulseIlluminationShader,
      backgroundShader: AdaptiveBackgroundShader,
      seed: 235252,
    },
    attenuation: -0.1,
    bright: canvas!.dimensions!.maxR * 1.2,
    dim: canvas!.dimensions!.maxR * 1.2,
    color: [0.5, 0.7, 0.9],
    coloration: -0.4,
    contrast: 0.6,
    darkness: { min: 0, max: 0.78 },
    disabled: false,
    elevation: Infinity,
    luminosity: 0.1,
    preview: false,
    priority: 5,
    rotation: 0,
    saturation: 0,
    seed: 11111111,
    shadows: 0.3,
    vision: true,
    walls: false,
    x: canvas!.dimensions!.sceneWidth / 2,
    y: canvas!.dimensions!.sceneHeight / 2,
  }),
).toEqualTypeOf<typeof mySource>();

expectTypeOf(mySource.name).toBeString();
expectTypeOf(mySource.customPolygon).toEqualTypeOf<PIXI.Polygon | number[] | null>();

expectTypeOf(mySource.background).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.coloration).toEqualTypeOf<PointSourceMesh>();
expectTypeOf(mySource.illumination).toEqualTypeOf<PointSourceMesh>();

expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
declare const someBackgroundShader: AdaptiveBackgroundShader;
expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();
