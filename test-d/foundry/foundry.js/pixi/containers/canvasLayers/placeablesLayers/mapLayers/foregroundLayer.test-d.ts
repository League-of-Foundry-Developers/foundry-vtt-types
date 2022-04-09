import type EmbeddedCollection from '../../../../../../../../src/foundry/common/abstract/embedded-collection.mjs';

import { expectType } from 'tsd';

expectType<ForegroundLayer | undefined>(ForegroundLayer.instance);
expectType<MapLayer.LayerOptions<'foreground'>>(ForegroundLayer.layerOptions);

const layer = new ForegroundLayer();
expectType<'foreground'>(layer.options.name);
expectType<EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]>(layer.getDocuments());
