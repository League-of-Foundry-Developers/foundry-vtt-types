import { expectType } from 'tsd';

expectType<EffectsLayer>(EffectsLayer.instance);
expectType<EffectsLayer.LayerOptions>(EffectsLayer.layerOptions);
expectType<'effects'>(EffectsLayer.layerOptions.name);

const layer = new EffectsLayer();
expectType<'effects'>(layer.options.name);
expectType<PIXI.Container | undefined>(layer.weather);
expectType<SpecialEffect | undefined>(layer.weatherEffect);
expectType<unknown[]>(layer.emitters);
expectType<AbstractBaseMaskFilter | undefined>(layer.weatherOcclusionFilter);
expectType<Promise<EffectsLayer>>(layer.tearDown());
expectType<Promise<undefined>>(layer.draw());
expectType<PIXI.Container | null>(layer.drawWeather());
