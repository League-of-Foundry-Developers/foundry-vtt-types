import { expectType } from 'tsd';
import '../../../../../index';

type TestItemData = Item.Data<{ foo: string }>;
class TestItem extends Item<TestItemData> {}

type TestActorData = Actor.Data<{ bar: number }, TestItemData>;
class TestActor extends Actor<TestActorData, TestItem> {
  foo = 'bar';
}
const testActor = new TestActor();

class TestActorSheet extends ActorSheet<ActorSheet.Data<TestActor>> {}
const testActorSheet = new TestActorSheet(testActor);

expectType<TestActor>(testActorSheet.actor);
expectType<string>(testActorSheet.actor.foo);

const sheetData = await testActorSheet.getData();

expectType<string>(sheetData.items[0].data.foo);
expectType<number>(sheetData.actor.data.bar);
