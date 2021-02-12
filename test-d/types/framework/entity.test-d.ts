import { expectType } from 'tsd';
import '../../../index';

interface CustomEntityData extends Entity.Data {
  customField: boolean;
}
declare class CustomEntity extends Entity<CustomEntityData> {}
declare const actualCustomData: CustomEntityData;

// create
declare const createData: DeepPartial<Entity.Data>;
declare const customCreateData: DeepPartial<CustomEntityData>;

expectType<Promise<Entity | Entity[] | null>>(Entity.create([]));
expectType<Promise<Entity | null>>(Entity.create(createData));
expectType<Promise<Entity | Entity[] | null>>(Entity.create([createData, createData]));
expectType<Promise<Entity | Entity[] | null>>(Entity.create([createData] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.create([createData, createData] as const));

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
declare const updateData: DeepPartial<Entity.Data> & { _id: string };
declare const customUpdateData: DeepPartial<CustomEntityData> & { _id: string };

expectType<Promise<Entity | Entity[]>>(Entity.update([]));
expectType<Promise<Entity | []>>(Entity.update(updateData));
expectType<Promise<Entity | Entity[]>>(Entity.update([updateData, updateData]));
expectType<Promise<Entity | Entity[]>>(Entity.update([updateData] as const));
expectType<Promise<Entity | Entity[]>>(Entity.update([updateData, updateData] as const));

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

expectType<Promise<Entity | Entity[] | null>>(Entity.delete([]));
expectType<Promise<Entity | null>>(Entity.delete(id));
expectType<Promise<Entity | Entity[] | null>>(Entity.delete([id, id]));
expectType<Promise<Entity | Entity[] | null>>(Entity.delete([id] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.delete([id, id] as const));

expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.delete(id));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id]));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete([id, id] as const));
