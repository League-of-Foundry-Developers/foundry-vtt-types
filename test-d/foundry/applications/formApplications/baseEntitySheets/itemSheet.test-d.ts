import { expectType } from 'tsd';
import '../../../../../index';

type TestItemData = Item.Data<{ foo: string }>;
class TestItem extends Item<TestItemData> {
  foo = 'bar';
}
const testItem = new TestItem();

class TestItemSheet extends ItemSheet<ItemSheet.Data<TestItem>> {}
const testItemSheet = new TestItemSheet(testItem);

expectType<TestItem>(testItemSheet.item);
expectType<string>(testItemSheet.item.foo);

const sheetData = await testItemSheet.getData();

expectType<string>(sheetData.data.foo);
expectType<string | undefined>(testItemSheet.actor?.data.items[0].data.foo);
