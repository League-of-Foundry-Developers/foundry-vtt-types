import { expectType } from 'tsd';
import '../../index';

interface CustomEntityData extends Entity.Data {
  attributes: {
    speed: number;
    lift: number;
    books: number;
  };
  customField: boolean;
}
declare class CustomEntity extends Entity<CustomEntityData> {}
declare const actualCustomData: CustomEntityData;

// create
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

// update
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

// delete
declare const id: string;

expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.delete(id));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id]));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id] as const));

const someEntity = new CustomEntity();
someEntity.update({ 'attributes.speed': 4 });
someEntity.update({ 'attributes.speed': 4, 'flags.lancer.misc': 'test' });
someEntity.update({ attributes: { speed: 32 }, 'flags.lancer.misc': 'test' });
someEntity.update({ attributes: { speed: 32 } });
