import type { ItemDataSource } from '../../../../../../src/foundry/common/data/data.mjs/itemData';

import { expectType } from 'tsd';

const items = new Items();
expectType<Item>(items.get('', { strict: true }));
expectType<ItemDataSource[]>(items.toJSON());
expectType<ItemDirectory | undefined>(items.directory);
