import { expectType } from 'tsd';
import '../../../index';

declare const data: DeepPartial<Entity.Data>;
declare function dataProducer(): DeepPartial<Entity.Data>[];

expectType<Promise<[]>>(Entity.create([]));
expectType<Promise<Entity | null>>(Entity.create(data));
expectType<Promise<Entity | null>>(Entity.create([data] as const));
expectType<Promise<Entity[] | null>>(Entity.create([data, data] as const));
expectType<Promise<Entity[] | null>>(Entity.create([data, data, data] as const));
expectType<Promise<Entity | Entity[] | null>>(Entity.create(dataProducer()));

interface CustomEntityData extends Entity.Data {
  customField: boolean;
}
declare class CustomEntity extends Entity<CustomEntityData> {}
declare const customData: DeepPartial<CustomEntityData>;
declare function customDataProducer(): DeepPartial<CustomEntityData>[];

expectType<Promise<[]>>(CustomEntity.create([]));
expectType<Promise<CustomEntity | null>>(CustomEntity.create(customData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([customData, customData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([customData, customData, customData] as const));
expectType<Promise<CustomEntity | CustomEntity[] | null>>(CustomEntity.create(customDataProducer()));

declare const actualCustomData: CustomEntityData;

expectType<Promise<CustomEntity | null>>(CustomEntity.create(actualCustomData));
expectType<Promise<CustomEntity | null>>(CustomEntity.create([actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(CustomEntity.create([actualCustomData, actualCustomData] as const));
expectType<Promise<CustomEntity[] | null>>(
  CustomEntity.create([actualCustomData, actualCustomData, actualCustomData] as const)
);
