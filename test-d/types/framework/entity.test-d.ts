import { expectType } from 'tsd';
import '../../../index';

declare const data: DeepPartial<Entity.Data>;
declare function dataProducer(): DeepPartial<Entity.Data>[];
interface CustomEntityData extends Entity.Data {
  customField: boolean;
}
declare class CustomEntity extends Entity<CustomEntityData> {}
declare const customData: DeepPartial<CustomEntityData>;
declare function customDataProducer(): DeepPartial<CustomEntityData>[];
declare const actualCustomData: CustomEntityData;

// create
expectType<Promise<[]>>(Entity.create([]));
expectType<Promise<Entity | null>>(Entity.create(data));
expectType<Promise<Entity | null>>(Entity.create([data] as const));
expectType<Promise<Entity[] | null>>(Entity.create([data, data] as const));
expectType<Promise<Entity[] | null>>(Entity.create([data, data, data] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.create(dataProducer()));

expectType<Promise<[]>>(CustomEntity.create([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.create(customData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([customData, customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([customData, customData, customData] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create(customDataProducer()));

expectType<Promise<CustomEntity | null>>(CustomEntity.create(actualCustomData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([actualCustomData, actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.create([actualCustomData, actualCustomData, actualCustomData] as const)
);

// update
expectType<Promise<[]>>(Entity.update([]));
expectType<Promise<Entity | null>>(Entity.update(data));
expectType<Promise<Entity | null>>(Entity.update([data] as const));
expectType<Promise<Entity[] | null>>(Entity.update([data, data] as const));
expectType<Promise<Entity[] | null>>(Entity.update([data, data, data] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.update(dataProducer()));

expectType<Promise<[]>>(CustomEntity.update([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.update(customData));
expectType<Promise<CustomEntity | null>>(CustomEntity.update([customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.update([customData, customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.update([customData, customData, customData] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.update(customDataProducer()));

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
