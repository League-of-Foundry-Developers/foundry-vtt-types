import { expectType } from 'tsd';

class SomeLayer extends CanvasLayer {}

expectType<SomeLayer>(new SomeLayer());
expectType<CanvasLayer | undefined>(SomeLayer.instance);
expectType<CanvasLayerOptions>(SomeLayer.layerOptions);
expectType<CanvasLayer.LayerOptions>(SomeLayer.layerOptions);

const layer = new SomeLayer();
expectType<CanvasLayerOptions>(layer.options);
expectType<CanvasLayer.LayerOptions>(layer.options);
expectType<SomeLayer | Promise<SomeLayer | undefined>>(layer.draw());
expectType<Promise<SomeLayer>>(layer.tearDown());
expectType<SomeLayer>(layer.activate());
expectType<SomeLayer | void>(layer.deactivate());
expectType<number>(layer.getZIndex());
