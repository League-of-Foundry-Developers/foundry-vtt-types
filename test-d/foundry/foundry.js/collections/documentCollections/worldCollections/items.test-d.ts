import { expectType } from 'tsd';
import { ItemDataSource } from '../../../../../../src/foundry/common/data/data.mjs/itemData';

const items = new Items();
expectType<Item>(items.get('', { strict: true }));
expectType<ItemDataSource[]>(items.toJSON());
