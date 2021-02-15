import { expectError, expectType } from 'tsd';
import '../../../index';

interface CustomEntityData extends Entity.Data {
  customField: boolean;
  attributes: {
    speed: number;
    lift: number;
    books: number;
  };
}
type CustomEmbeddedEntityConfig = {
  ActiveEffect: ActiveEffect.Data;
  OwnedItem: Item.Data<{}>;
};
declare class CustomEntity extends Entity<CustomEntityData, CustomEmbeddedEntityConfig> {}
declare const actualCustomData: CustomEntityData;

// static create
declare const customCreateData: DeepPartial<CustomEntityData>;

expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.create(customCreateData));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create([customCreateData, customCreateData]));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create([customCreateData] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(
  CustomEntity.create([customCreateData, customCreateData] as const)
);

expectType<Promise<CustomEntity | null>>(CustomEntity.create(actualCustomData));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create([actualCustomData, actualCustomData]));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create([actualCustomData] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(
  CustomEntity.create([actualCustomData, actualCustomData] as const)
);

// static update
declare const customUpdateData: DeepPartial<CustomEntityData> & { _id: string };

expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([]));
expectType<Promise<CustomEntity | []>>(CustomEntity.update(customUpdateData));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([customUpdateData, customUpdateData]));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([customUpdateData] as const));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([customUpdateData, customUpdateData] as const));

expectType<Promise<CustomEntity | []>>(CustomEntity.update(actualCustomData));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([actualCustomData, actualCustomData]));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([actualCustomData] as const));
expectType<Promise<CustomEntity | CustomEntity[]>>(CustomEntity.update([actualCustomData, actualCustomData] as const));

// static delete
declare const id: string;

expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.delete(id));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id]));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id] as const));

// update
const someEntity = new CustomEntity();
someEntity.update({ 'attributes.speed': 4 });
someEntity.update({ 'attributes.speed': 4, 'flags.lancer.misc': 'test' });
someEntity.update({ attributes: { speed: 32 }, 'flags.lancer.misc': 'test' });
someEntity.update({ attributes: { speed: 32 } });

// create embedded entity
expectType<Promise<ActiveEffect.Data | null>>(someEntity.createEmbeddedEntity('ActiveEffect', {}));
expectType<Promise<Item.Data<{}> | null>>(someEntity.createEmbeddedEntity('OwnedItem', {}));
expectType<Promise<ActiveEffect.Data | ActiveEffect.Data[] | null>>(
  someEntity.createEmbeddedEntity('ActiveEffect', [{ label: 'foo' }, { label: 'bar' }])
);
expectType<Promise<Item.Data<{}> | Item.Data<{}>[] | null>>(
  someEntity.createEmbeddedEntity('OwnedItem', [{ name: 'foo' }, { name: 'bar' }])
);
expectError(someEntity.createEmbeddedEntity('NonExistentEmbeddedEntity', {}));

// update embedded entity
expectType<Promise<ActiveEffect.Data | []>>(someEntity.updateEmbeddedEntity('ActiveEffect', { _id: 'foo' }));
expectType<Promise<Item.Data<{}> | []>>(someEntity.updateEmbeddedEntity('OwnedItem', { _id: 'foo' }));
expectType<Promise<ActiveEffect.Data | ActiveEffect.Data[]>>(
  someEntity.updateEmbeddedEntity('ActiveEffect', [{ _id: 'foo' }, { _id: 'bar' }])
);
expectType<Promise<Item.Data<{}> | Item.Data<{}>[]>>(
  someEntity.updateEmbeddedEntity('OwnedItem', [{ _id: 'foo' }, { _id: 'bar' }])
);
expectError(someEntity.updateEmbeddedEntity('NonExistentEmbeddedEntity', {}));

// delete embedded entity
expectType<Promise<ActiveEffect.Data | []>>(someEntity.deleteEmbeddedEntity('ActiveEffect', 'foo'));
expectType<Promise<Item.Data<{}> | []>>(someEntity.deleteEmbeddedEntity('OwnedItem', 'foo'));
expectType<Promise<ActiveEffect.Data | ActiveEffect.Data[]>>(
  someEntity.deleteEmbeddedEntity('ActiveEffect', ['foo', 'bar'])
);
expectType<Promise<Item.Data<{}> | Item.Data<{}>[]>>(someEntity.deleteEmbeddedEntity('OwnedItem', ['foo, bar']));
expectError(someEntity.deleteEmbeddedEntity('NonExistentEmbeddedEntity', {}));
