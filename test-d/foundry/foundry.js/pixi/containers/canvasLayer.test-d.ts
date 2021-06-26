import { expectType } from 'tsd';

class SomeLayer extends CanvasLayer {}

expectType<SomeLayer>(new SomeLayer());
expectType<CanvasLayer>(SomeLayer.instance);
expectType<CanvasLayerOptions>(SomeLayer.layerOptions);
expectType<CanvasLayer.LayerOptions>(SomeLayer.layerOptions);

const layer = new SomeLayer();
expectType<CanvasLayerOptions>(layer.options);
expectType<CanvasLayer.LayerOptions>(layer.options);
expectType<Promise<SomeLayer | undefined>>(layer.draw());
expectType<Promise<SomeLayer>>(layer.tearDown());
expectType<SomeLayer>(layer.activate());
expectType<SomeLayer>(layer.deactivate());
expectType<number>(layer.getZIndex());
