import type EmbeddedCollection from '../../../../../../../../src/foundry/common/abstract/embedded-collection.mjs';

import { expectType } from 'tsd';

expectType<ForegroundLayer | undefined>(ForegroundLayer.instance);
expectType<MapLayer.LayerOptions<'foreground'>>(ForegroundLayer.layerOptions);

const layer = new ForegroundLayer();
expectType<'foreground'>(layer.options.name);
expectType<Tile[]>(layer.roofs);
expectType<boolean>(layer.displayRoofs);
expectType<Promise<undefined>>(layer.draw());
expectType<ForegroundLayer>(layer.deactivate());
expectType<Promise<ForegroundLayer>>(layer.tearDown());
expectType<number>(layer.getZIndex());
expectType<EmbeddedCollection<typeof TileDocument, foundry.data.SceneData>>(layer.getDocuments());
expectType<void>(layer.refresh());
expectType<void>(layer.updateOcclusion());
