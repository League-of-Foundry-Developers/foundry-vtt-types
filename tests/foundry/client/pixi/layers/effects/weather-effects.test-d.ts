import { expectTypeOf } from "vitest";

expectTypeOf(WeatherEffects.instance).toEqualTypeOf<EffectsCanvasGroup | undefined>();
expectTypeOf(WeatherEffects.layerOptions).toEqualTypeOf<WeatherEffects.LayerOptions>();
expectTypeOf(WeatherEffects.layerOptions.name).toEqualTypeOf<"effects">();

const layer = new WeatherEffects();
expectTypeOf(layer.options.name).toEqualTypeOf<"effects">();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<WeatherEffects | void>>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<WeatherEffects>>();
