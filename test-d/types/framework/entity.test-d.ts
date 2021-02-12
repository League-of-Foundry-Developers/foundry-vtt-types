import { expectType } from 'tsd';
import '../../../index';

interface CustomEntityData extends Entity.Data {
  customField: boolean;
}
declare class CustomEntity extends Entity<CustomEntityData> {}
declare const actualCustomData: CustomEntityData;

// create

declare const createData: DeepPartial<Entity.Data>;
declare function createDataProducer(): DeepPartial<Entity.Data>[];
declare const customCreateData: DeepPartial<CustomEntityData>;
declare function customCreateDataProducer(): DeepPartial<CustomEntityData>[];

expectType<Promise<[]>>(Entity.create([]));
expectType<Promise<Entity | null>>(Entity.create(createData));
expectType<Promise<Entity | null>>(Entity.create([createData] as const));
expectType<Promise<Entity[] | null>>(Entity.create([createData, createData] as const));
expectType<Promise<Entity[] | null>>(Entity.create([createData, createData, createData] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.create(createDataProducer()));

expectType<Promise<[]>>(CustomEntity.create([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.create(customCreateData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([customCreateData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([customCreateData, customCreateData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.create([customCreateData, customCreateData, customCreateData] as const)
);
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create(customCreateDataProducer()));

expectType<Promise<CustomEntity | null>>(CustomEntity.create(actualCustomData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([actualCustomData, actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.create([actualCustomData, actualCustomData, actualCustomData] as const)
);

// update

declare const updateData: DeepPartial<Entity.Data> & { _id: string };
declare function updateDataProducer(): (DeepPartial<Entity.Data> & { _id: string })[];
declare const customUpdateData: DeepPartial<CustomEntityData> & { _id: string };
declare function customUpdateDataProducer(): (DeepPartial<CustomEntityData> & { _id: string })[];

expectType<Promise<[]>>(Entity.update([]));
expectType<Promise<Entity | null>>(Entity.update(updateData));
expectType<Promise<Entity | null>>(Entity.update([updateData] as const));
expectType<Promise<Entity[] | null>>(Entity.update([updateData, updateData] as const));
expectType<Promise<Entity[] | null>>(Entity.update([updateData, updateData, updateData] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.update(updateDataProducer()));

expectType<Promise<[]>>(CustomEntity.update([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.update(customUpdateData));
expectType<Promise<CustomEntity | null>>(CustomEntity.update([customUpdateData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.update([customUpdateData, customUpdateData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.update([customUpdateData, customUpdateData, customUpdateData] as const)
);
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.update(customUpdateDataProducer()));

expectType<Promise<CustomEntity | null>>(CustomEntity.update(actualCustomData));
expectType<Promise<CustomEntity | null>>(CustomEntity.update([actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.update([actualCustomData, actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.update([actualCustomData, actualCustomData, actualCustomData] as const)
);

// delete
declare const id: string;
declare function idProducer(): string[];

expectType<Promise<[]>>(Entity.update([]));
expectType<Promise<Entity | null>>(Entity.delete(id));
expectType<Promise<Entity | null>>(Entity.delete([id] as const));
expectType<Promise<Entity[] | null>>(Entity.delete([id, id] as const));
expectType<Promise<Entity[] | null>>(Entity.delete([id, id, id] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.delete(idProducer()));

expectType<Promise<[]>>(CustomEntity.delete([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.delete(id));
expectType<Promise<CustomEntity | null>>(CustomEntity.delete([id] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.delete([id, id] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.delete([id, id, id] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.delete(idProducer()));
