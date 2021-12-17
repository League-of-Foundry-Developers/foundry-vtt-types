import { expectType } from 'tsd';

expectType<WeatherLayer | undefined>(WeatherLayer.instance);
expectType<WeatherLayer.LayerOptions>(WeatherLayer.layerOptions);
expectType<'effects'>(WeatherLayer.layerOptions.name);

const layer = new WeatherLayer();
expectType<'effects'>(layer.options.name);
expectType<PIXI.Container | undefined>(layer.weather);
expectType<SpecialEffect | undefined>(layer.weatherEffect);
expectType<PIXI.particles.Emitter[]>(layer.emitters);
expectType<AbstractBaseMaskFilter | undefined>(layer.weatherOcclusionFilter);
expectType<Promise<WeatherLayer>>(layer.tearDown());
expectType<Promise<undefined>>(layer.draw());
expectType<PIXI.Container | null>(layer.drawWeather());
