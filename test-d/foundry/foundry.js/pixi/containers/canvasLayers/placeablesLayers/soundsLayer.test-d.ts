import { expectType } from 'tsd';

expectType<'AmbientSound'>(SoundsLayer.documentName);
expectType<SoundsLayer | undefined>(SoundsLayer.instance);
expectType<SoundsLayer.LayerOptions>(SoundsLayer.layerOptions);
expectType<'sounds'>(SoundsLayer.layerOptions.name);
expectType<typeof AmbientSound>(SoundsLayer.layerOptions.objectClass);

const layer = new SoundsLayer();
expectType<typeof AmbientSound>(layer.options.objectClass);
expectType<SoundsLayer.LayerOptions>(layer.options);
expectType<'sounds'>(layer.options.name);

expectType<boolean>(layer.livePreview);

expectType<Promise<SoundsLayer>>(layer.tearDown());

expectType<void>(layer.initializeSources());

expectType<number | void>(layer.refresh());
expectType<number | void>(layer.refresh({}));
expectType<number | void>(layer.refresh({ fade: 50 }));

expectType<void>(layer.previewSound({ x: 100, y: 0 }));

expectType<void>(layer.stopAll());
