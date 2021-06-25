import { expectError, expectType } from 'tsd';

expectType<BackgroundLayer>(BackgroundLayer.instance);
expectType<MapLayer.LayerOptions<'background'>>(BackgroundLayer.layerOptions);

const layer = new BackgroundLayer();
expectType<PIXI.Graphics | undefined>(layer.outline);
expectType<Promise<BackgroundLayer>>(layer.draw());
expectType<Iterable<foundry.documents.BaseTile>>(layer.getDocuments()); // TODO: Replace with TileDocument once it is available
expectType<number>(layer.getZIndex());
expectType<void>(layer.storeHistory('create', new foundry.documents.BaseTile().data));
expectType<void>(layer.storeHistory('update', new foundry.documents.BaseTile().data));
expectType<void>(layer.storeHistory('delete', new foundry.documents.BaseTile().data));
expectError(layer.storeHistory('new', new foundry.documents.BaseTile().data));
