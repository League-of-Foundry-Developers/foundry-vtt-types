import { expectTypeOf } from "vitest";
import type RenderedEffectSource from "../../../../../src/foundry/client-esm/canvas/sources/rendered-effect-source.d.mts";
import type PointDarknessSource from "../../../../../src/foundry/client-esm/canvas/sources/point-darkness-source.d.mts";

const { PointDarknessSource: PDS } = foundry.canvas.sources;

expectTypeOf(PDS.effectsCollection).toBeString();
expectTypeOf(PDS["_dimLightingLevel"]).toMatchTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PDS["_brightLightingLevel"]).toMatchTypeOf<foundry.CONST.LIGHTING_LEVELS>();
expectTypeOf(PDS["ANIMATIONS"]).toEqualTypeOf<typeof CONFIG.Canvas.darknessAnimations>();
expectTypeOf(PDS["_layers"]).toMatchTypeOf<Record<string, RenderedEffectSource.LayerConfig>>();
expectTypeOf(PDS.defaultData).toEqualTypeOf<PointDarknessSource.SourceData>();

const mySource = new foundry.canvas.sources.PointDarknessSource();

expectTypeOf(mySource["_visualShape"]).toEqualTypeOf<PointSourcePolygon | null>();
expectTypeOf(mySource.shape).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(mySource["_padding"]).toBeNumber();
expectTypeOf(mySource.edges).toEqualTypeOf<foundry.canvas.edges.Edge[]>();
expectTypeOf(mySource.darkness).toEqualTypeOf<PointSourceMesh>();

const sourceData = {
  alpha: 0.1,
  angle: 215,
  animation: {
    animation: PDS.prototype.animateTime,
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
};

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
expectTypeOf(mySource.isDarkness).toEqualTypeOf<true>();
