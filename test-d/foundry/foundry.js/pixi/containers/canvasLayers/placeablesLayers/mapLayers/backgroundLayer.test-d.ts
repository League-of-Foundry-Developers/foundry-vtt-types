import { expectError, expectType } from 'tsd';
import EmbeddedCollection from '../../../../../../../../src/foundry/common/abstract/embedded-collection.mjs';

expectType<BackgroundLayer | undefined>(BackgroundLayer.instance);
expectType<MapLayer.LayerOptions<'background'>>(BackgroundLayer.layerOptions);

const layer = new BackgroundLayer();
expectType<'background'>(layer.options.name);
expectType<PIXI.Graphics | undefined>(layer.outline);
expectType<Promise<BackgroundLayer>>(layer.draw());
expectType<EmbeddedCollection<typeof foundry.documents.BaseTile, foundry.data.SceneData>>(layer.getDocuments()); // TODO: Replace with TileDocument once it is available
expectType<number>(layer.getZIndex());
expectType<void>(layer.storeHistory('create', new foundry.documents.BaseTile().data));
expectType<void>(layer.storeHistory('update', new foundry.documents.BaseTile().data));
expectType<void>(layer.storeHistory('delete', new foundry.documents.BaseTile().data));
expectError(layer.storeHistory('new', new foundry.documents.BaseTile().data));
