import { expectTypeOf } from "vitest";
import type GlobalLightSource from "../../../../../src/foundry/client-esm/canvas/sources/global-light-source.d.mts";

const { GlobalLightSource: GLSC } = foundry.canvas.sources;

expectTypeOf(GLSC.sourceType).toBeString();
expectTypeOf(GLSC.effectsCollection).toBeString();
expectTypeOf(GLSC.defaultData).toEqualTypeOf<GlobalLightSource.SourceData>();

declare const ecg: EffectsCanvasGroup;
const mySource = new GLSC({ object: ecg, sourceId: "globalLight" });

expectTypeOf(mySource.name).toBeString();
expectTypeOf(mySource.customPolygon).toEqualTypeOf<PIXI.Polygon | number[] | null>();

expectTypeOf(mySource["_updateColorationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateIlluminationUniforms"]()).toBeVoid();
expectTypeOf(mySource["_updateBackgroundUniforms"]()).toBeVoid();
declare const someBackgroundShader: AdaptiveBackgroundShader;
expectTypeOf(mySource["_updateCommonUniforms"](someBackgroundShader)).toBeVoid();
