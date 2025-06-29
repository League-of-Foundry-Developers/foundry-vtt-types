import { expectTypeOf } from "vitest";

import PointDarknessSource = foundry.canvas.sources.PointDarknessSource;
import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;
import BlackHoleDarknessShader = foundry.canvas.rendering.shaders.BlackHoleDarknessShader;

expectTypeOf(PointDarknessSource.sourceType).toEqualTypeOf<"darkness">();
expectTypeOf(PointDarknessSource.effectsCollection).toBeString();
expectTypeOf(PointDarknessSource["_dimLightingLevel"]).toExtend<CONST.LIGHTING_LEVELS>();
expectTypeOf(PointDarknessSource["_brightLightingLevel"]).toExtend<CONST.LIGHTING_LEVELS>();
expectTypeOf(PointDarknessSource["ANIMATIONS"]).toExtend<Record<string, CONFIG.Canvas.DarknessSourceAnimationConfig>>();
expectTypeOf(PointDarknessSource["_layers"]).toExtend<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(PointDarknessSource.defaultData).toEqualTypeOf<PointDarknessSource.SourceData>();

declare const object: foundry.canvas.placeables.AmbientLight.Implementation;
new PointDarknessSource();
new PointDarknessSource({ object: undefined, sourceId: undefined });
const mySource = new PointDarknessSource({ object, sourceId: object.sourceId });
// #initialize param tests are with BaseEffectSource
const initializedSource = mySource.initialize();

expectTypeOf(mySource.shape).toEqualTypeOf<PointDarknessSource.ConfiguredPolygon | undefined>();
expectTypeOf(initializedSource.shape).toEqualTypeOf<PointDarknessSource.ConfiguredPolygon>();

expectTypeOf(mySource["_visualShape"]).toEqualTypeOf<PointDarknessSource.ConfiguredPolygon | undefined | null>();
expectTypeOf(mySource["_padding"]).toBeNumber();
expectTypeOf(mySource.requiresEdges).toBeBoolean();

expectTypeOf(mySource.darkness).toEqualTypeOf<PointSourceMesh>();

expectTypeOf(mySource.background).toEqualTypeOf<undefined>();
expectTypeOf(mySource.coloration).toEqualTypeOf<undefined>();
expectTypeOf(mySource.illumination).toEqualTypeOf<undefined>();

expectTypeOf(mySource.testPoint({ x: object.x, y: object.y, elevation: 0 })).toBeBoolean();

const sourceData = {
  x: 50,
  y: 50,
  alpha: 0.1,
  angle: 215,
  animation: {
    animation: PointDarknessSource.prototype.animateTime,
    darknessShader: BlackHoleDarknessShader,
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
} satisfies PointDarknessSource.SourceData;

expectTypeOf(mySource["_initialize"]({})).toBeVoid();
expectTypeOf(mySource["_initialize"](sourceData)).toBeVoid();

expectTypeOf(mySource["_createShapes"]()).toBeVoid();
expectTypeOf(mySource["_configure"]({})).toBeVoid();
expectTypeOf(mySource["_configure"](sourceData)).toBeVoid();

expectTypeOf(mySource["_getPolygonConfiguration"]()).toEqualTypeOf<PointDarknessSource.PolygonConfig>();

expectTypeOf(mySource.drawMeshes().darkness).toEqualTypeOf<PointSourceMesh | null>();
// @ts-expect-error background is not a RenderingLayers key
expectTypeOf(mySource.drawMeshes().background).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_drawMesh"]("darkness")).toEqualTypeOf<PointSourceMesh | null>;
// @ts-expect-error background is not a RenderingLayers key
expectTypeOf(mySource["_drawMesh"]("background")).toEqualTypeOf<PointSourceMesh | null>;

expectTypeOf(mySource["_updateGeometry"]()).toBeVoid();
expectTypeOf(mySource["_updateDarknessUniforms"]()).toBeVoid();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toEqualTypeOf<true>();
