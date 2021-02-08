import '../../../../index';
import { expectType } from 'tsd';

type TestItemData = Item.Data<{ foo: string }>;
class TestItem extends Item<TestItemData> {}
const testItem = new TestItem();

class TestItemSheet extends ItemSheet<ItemSheet.Data<TestItem>> {}
const testItemSheet = new TestItemSheet(testItem);

const sheetData = await testItemSheet.getData();

expectType<string>(sheetData.data.foo);
expectType<string | undefined>(testItemSheet.actor?.data.items[0].data.foo);
