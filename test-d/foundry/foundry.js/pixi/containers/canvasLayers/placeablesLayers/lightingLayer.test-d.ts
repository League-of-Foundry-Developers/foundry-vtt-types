import { expectType } from 'tsd';

expectType<'AmbientLight'>(LightingLayer.documentName);
expectType<LightingLayer>(LightingLayer.instance);
expectType<LightingLayer.LayerOptions>(LightingLayer.layerOptions);
expectType<'lighting'>(LightingLayer.layerOptions.name);
expectType<ConstructorOf<AmbientLight>>(LightingLayer.layerOptions.objectClass);

const layer = new LightingLayer();
expectType<ConstructorOf<AmbientLight>>(layer.options.objectClass);
expectType<LightingLayer.layerOptions>(layer.options);
expectType<'lighting'>(layer.options.name);

expectType<foundry.utils.Collection<PointSource>>(layer.sources);

expectType<number>(layer.version);

expectType<boolean>(layer.globalLight);

expectType<PIXI.Container | null>(layer.coloration);

expectType<PIXI.Container | null>(layer.illumination);

expectType<{ black: LightChannel; dark: LightChannel; dim: LightChannel; bright: LightChannel } | undefined>(
  layer.channels
);

expectType<Promise<LightingLayer>>(layer.draw());

expectType<boolean>(layer.hasGlobalIllumination());

expectType<void>(layer.initializeSources());

expectType<void>(layer.refresh());
expectType<void>(layer.refresh(undefined));
expectType<void>(layer.refresh(100));

expectType<Promise<LightingLayer>>(layer.tearDown());

expectType<void>(layer.activateAnimation());

expectType<void>(layer.deactivateAnimation());

expectType<Promise<void>>(layer.animateDarkness());
expectType<Promise<void>>(layer.animateDarkness(1.0));
expectType<Promise<void>>(layer.animateDarkness(1.0, {}));
expectType<Promise<void>>(layer.animateDarkness(1.0, { duration: 10000 }));
