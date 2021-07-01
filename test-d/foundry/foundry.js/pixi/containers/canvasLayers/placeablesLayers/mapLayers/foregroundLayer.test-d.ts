import { expectType } from 'tsd';
import EmbeddedCollection from '../../../../../../../../src/foundry/common/abstract/embedded-collection.mjs';

expectType<ForegroundLayer>(ForegroundLayer.instance);
expectType<MapLayer.LayerOptions<'foreground'>>(ForegroundLayer.layerOptions);

const layer = new ForegroundLayer();
expectType<'foreground'>(layer.options.name);
expectType<Tile[]>(layer.roofs);
expectType<boolean>(layer.displayRoofs);
expectType<Promise<undefined>>(layer.draw());
expectType<ForegroundLayer>(layer.deactivate());
expectType<Promise<ForegroundLayer>>(layer.tearDown());
expectType<number>(layer.getZIndex());
expectType<EmbeddedCollection<typeof foundry.documents.BaseTile, foundry.data.SceneData>>(layer.getDocuments()); // ToDo: Replace with TileDocument once it is available
expectType<void>(layer.refresh());
expectType<void>(layer.updateOcclusion());
