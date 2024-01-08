import { expectTypeOf } from "vitest";

expectTypeOf(WeatherLayer.instance).toEqualTypeOf<WeatherLayer | undefined>();
expectTypeOf(WeatherLayer.layerOptions).toEqualTypeOf<WeatherLayer.LayerOptions>();
expectTypeOf(WeatherLayer.layerOptions.name).toEqualTypeOf<"effects">();

const layer = new WeatherLayer();
expectTypeOf(layer.options.name).toEqualTypeOf<"effects">();
expectTypeOf(layer.weather).toEqualTypeOf<PIXI.Container | undefined>();
expectTypeOf(layer.weatherEffect).toEqualTypeOf<SpecialEffect | undefined>();
expectTypeOf(layer.emitters).toEqualTypeOf<PIXI.particles.Emitter[]>();
expectTypeOf(layer.weatherOcclusionFilter).toEqualTypeOf<AbstractBaseMaskFilter | undefined>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<WeatherLayer>>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(layer.drawWeather()).toEqualTypeOf<PIXI.Container | null>();
