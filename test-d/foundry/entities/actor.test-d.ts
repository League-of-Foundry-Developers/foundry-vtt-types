import { expectType } from 'tsd';
import '../../../index';

interface CustomActorDataData {
  attributes: { strength: { value: number } };
}

interface CustomActorPreparedDataData {
  attributes: { strength: { value: number; mod: number } };
}

type CustomActorData = Actor.Data<CustomActorDataData>;
type CustomActorPreparedData = Actor.Data<CustomActorPreparedDataData>;

declare class CustomActor extends Actor<CustomActorData, Item, CustomActorPreparedData> {}

const customActor = new CustomActor();
expectType<CustomActorData>(customActor._data);
expectType<CustomActorPreparedData>(customActor.data);
