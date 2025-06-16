import { expectTypeOf } from "vitest";

import PointDarknessSource = foundry.canvas.sources.PointDarknessSource;
import RenderedEffectSource = foundry.canvas.sources.RenderedEffectSource;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;
import BlackHoleDarknessShader = foundry.canvas.rendering.shaders.BlackHoleDarknessShader;

expectTypeOf(PointDarknessSource.effectsCollection).toBeString();
expectTypeOf(PointDarknessSource["_dimLightingLevel"]).toExtend<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointDarknessSource["_brightLightingLevel"]).toExtend<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PointDarknessSource["ANIMATIONS"]).toEqualTypeOf<typeof CONFIG.Canvas.darknessAnimations>();
expectTypeOf(PointDarknessSource["_layers"]).toExtend<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(PointDarknessSource.defaultData).toEqualTypeOf<PointDarknessSource.SourceData>();

const mySource = new foundry.canvas.sources.PointDarknessSource();

expectTypeOf(mySource["_visualShape"]).toEqualTypeOf<PointSourcePolygon | null>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource["_padding"]).toBeNumber();
expectTypeOf(mySource.edges).toEqualTypeOf<foundry.canvas.geometry.edges.Edge[]>();
expectTypeOf(mySource.darkness).toEqualTypeOf<PointSourceMesh>();

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
expectTypeOf(mySource["_drawMesh"]("darkness")).toEqualTypeOf<PointSourceMesh | null>();

expectTypeOf(mySource["_updateGeometry"]()).toBeVoid();
expectTypeOf(mySource["_updateDarknessUniforms"]()).toBeVoid();
expectTypeOf(mySource["_destroy"]()).toBeVoid();

// deprecated since v12, until v14
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(mySource.isDarkness).toEqualTypeOf<true>();
