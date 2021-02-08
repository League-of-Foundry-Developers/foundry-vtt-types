import '../../../../index';
import { expectType } from 'tsd';

type TestItemData = Item.Data<{ foo: string }>;
class TestItem extends Item<TestItemData> {}

type TestActorData = Actor.Data<{ bar: number }, TestItemData>;
class TestActor extends Actor<TestActorData, TestItem> {}
const testActor = new TestActor();

class TestActorSheet extends ActorSheet<ActorSheet.Data<TestActor>> {}
const testActorSheet = new TestActorSheet(testActor);

const sheetData = await testActorSheet.getData();

expectType<string>(sheetData.items[0].data.foo);
expectType<number | null>(sheetData.actor.data.bar);
