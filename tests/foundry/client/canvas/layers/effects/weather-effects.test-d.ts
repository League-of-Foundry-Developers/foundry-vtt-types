import { expectTypeOf } from "vitest";

import AbstractWeatherShader = foundry.canvas.rendering.shaders.AbstractWeatherShader;
// eslint-disable-next-line @typescript-eslint/no-deprecated
import AutumnLeavesWeatherEffect = foundry.canvas.containers.AutumnLeavesWeatherEffect;
import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;
import ParticleGenerator = foundry.canvas.animation.ParticleGenerator;
// eslint-disable-next-line @typescript-eslint/no-deprecated
import ParticleEffect = foundry.canvas.containers.ParticleEffect;
import WeatherEffects = foundry.canvas.layers.WeatherEffects;
import WeatherShaderEffect = foundry.canvas.rendering.shaders.WeatherShaderEffect;

// not an error, Foundry really does this for some reason
expectTypeOf(WeatherEffects.instance).toEqualTypeOf<EffectsCanvasGroup | undefined>();
expectTypeOf(WeatherEffects.layerOptions).toEqualTypeOf<WeatherEffects.LayerOptions>();
expectTypeOf(WeatherEffects.layerOptions.name).toEqualTypeOf<"effects">();

declare class SomeWeatherShader extends AbstractWeatherShader {}
declare const someShader: SomeWeatherShader;
declare const someTex: PIXI.Texture;
expectTypeOf(WeatherEffects.configureOcclusionMask(someShader)).toBeVoid();
expectTypeOf(WeatherEffects.configureOcclusionMask(someShader, {})).toBeVoid();
expectTypeOf(
  WeatherEffects.configureOcclusionMask(someShader, {
    channelWeights: [1, 0, 0, 0],
    enabled: true,
    reverse: false,
    texture: someTex,
  }),
).toBeVoid();

expectTypeOf(WeatherEffects.configureTerrainMask(someShader)).toBeVoid();
expectTypeOf(WeatherEffects.configureTerrainMask(someShader, {})).toBeVoid();
expectTypeOf(
  WeatherEffects.configureTerrainMask(someShader, {
    channelWeights: undefined,
    enabled: false,
    reverse: true,
    texture: someTex,
  }),
).toBeVoid();

const layer = new WeatherEffects();

expectTypeOf(layer.weatherEffects).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(layer.suppression).toEqualTypeOf<PIXI.Container | undefined>();

expectTypeOf(layer.options.name).toEqualTypeOf<"effects">();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(layer.effects).toEqualTypeOf<Map<string, ParticleEffect | WeatherShaderEffect | ParticleGenerator>>();
expectTypeOf(layer.terrainMaskConfig).toEqualTypeOf<WeatherEffects.MaskConfiguration | undefined>();
expectTypeOf(layer.occlusionMaskConfig).toEqualTypeOf<WeatherEffects.MaskConfiguration | undefined>();

expectTypeOf(layer.elevation).toBeNumber();
expectTypeOf(layer.sortLayer).toBeNumber();
expectTypeOf(layer.sort).toBeNumber();
expectTypeOf(layer.zIndex).toBeNumber();

expectTypeOf(layer.draw()).toEqualTypeOf<Promise<WeatherEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<WeatherEffects>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
declare class SomeParticleEffect extends ParticleEffect {}
// eslint-disable-next-line @typescript-eslint/no-deprecated
declare class SomeLeavesEffect extends AutumnLeavesWeatherEffect {}
declare class SomeWeatherShaderEffect extends WeatherShaderEffect {}

expectTypeOf(layer.initializeEffects()).toBeVoid();
expectTypeOf(layer.initializeEffects(null)).toBeVoid();
expectTypeOf(layer.initializeEffects(undefined)).toBeVoid();
expectTypeOf(
  layer.initializeEffects({
    id: "someID",
    label: "MYSYSTEM.WeatherEffects.someID.label",
    filter: {
      enabled: false,
    },
    effects: [
      {
        id: "leaves2",
        effectClass: SomeLeavesEffect,
      },
      {
        id: "someParticleGenerator",
        particles: [{ textures: ["ui/particles/leaf1.png"], count: 20, lifetime: 1000 }],
      },
      {
        id: "someParticleEffect",
        effectClass: SomeParticleEffect,
        blendMode: PIXI.BLEND_MODES.LUMINOSITY,
        performanceLevel: CONST.CANVAS_PERFORMANCE_MODES.HIGH,
        config: {
          // a PIXI.particles.EmitterConfigV3
          lifetime: { max: 5, min: 2 },
          frequency: 0.25,
          pos: { x: 0, y: 10 },
          behaviors: [
            {
              type: "someBehaviourType",
              config: {
                foo: 7,
                bar: "string",
              },
            },
          ],
        },
      },
      {
        id: "someWeatherEffect",
        effectClass: SomeWeatherShaderEffect,
        shaderClass: SomeWeatherShader,
        performanceLevel: CONST.CANVAS_PERFORMANCE_MODES.MED,
        blendMode: undefined,
        config: {
          // UniformValues
          foo: 7.6,
          bar: [1, 2, 3, 4],
          baz: new PIXI.Matrix(),
          // properties of AbstractWeatherShader
          scaleX: 2.2,
          scaleY: 3.5,
        },
      },
    ],
  }),
).toBeVoid();

expectTypeOf(layer.clearEffects()).toBeVoid();
