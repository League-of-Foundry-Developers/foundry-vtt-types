import { expectType } from 'tsd';

expectType<SoundsLayer | undefined>(SoundsLayer.instance);
expectType<typeof AmbientSound>(SoundsLayer.layerOptions.objectClass);

const layer = new SoundsLayer();
expectType<typeof AmbientSound>(layer.options.objectClass);
expectType<SoundsLayer.LayerOptions>(layer.options);
expectType<'sounds'>(layer.options.name);
