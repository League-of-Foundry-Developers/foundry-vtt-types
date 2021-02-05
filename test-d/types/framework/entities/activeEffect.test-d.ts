import '../../../../index';
import { expectType } from 'tsd';

type SomeItemData = Item.Data<{}>;
class SomeItem extends Item<SomeItemData> {}
const someItem = new SomeItem();

type SomeActorData = Actor.Data<{}, SomeItemData>;
class SomeActor extends Actor<SomeActorData, SomeItem> {}
const someActor = new SomeActor();

const actorEffect = ActiveEffect.create<SomeActor>({}, someActor);
expectType<SomeActor>(actorEffect.parent);
expectType<SomeActor | undefined>(actorEffect.parent.effects.find(() => true)?.parent);

const itemEffect = ActiveEffect.create<SomeItem>({}, someItem);
expectType<SomeItem>(itemEffect.parent);
expectType<SomeItem | undefined>(itemEffect.parent.effects.find(() => true)?.parent);
