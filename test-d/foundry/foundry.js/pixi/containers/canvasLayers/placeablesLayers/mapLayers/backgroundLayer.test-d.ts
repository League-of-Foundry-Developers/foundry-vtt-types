import type EmbeddedCollection from '../../../../../../../../src/foundry/common/abstract/embedded-collection.mjs';

import { expectError, expectType } from 'tsd';

expectType<BackgroundLayer | undefined>(BackgroundLayer.instance);
expectType<MapLayer.LayerOptions<'background'>>(BackgroundLayer.layerOptions);

const layer = new BackgroundLayer();
expectType<'background'>(layer.options.name);
expectType<PIXI.Graphics | undefined>(layer.outline);
expectType<Promise<BackgroundLayer>>(layer.draw());
expectType<EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]>(layer.getDocuments());
expectType<number>(layer.getZIndex());
expectType<void>(layer.storeHistory('create', new TileDocument().data));
expectType<void>(layer.storeHistory('update', new TileDocument().data));
expectType<void>(layer.storeHistory('delete', new TileDocument().data));
expectError(layer.storeHistory('new', new TileDocument().data));
