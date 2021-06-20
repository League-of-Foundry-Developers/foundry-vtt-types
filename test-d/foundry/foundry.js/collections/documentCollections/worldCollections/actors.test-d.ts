import { expectType } from 'tsd';
import { ActorDataSource } from '../../../../../../src/foundry/common/data/data.mjs/actorData';

const actors = new Actors();
expectType<Actor>(actors.get('', { strict: true }));
expectType<ActorDataSource[]>(actors.toJSON());
expectType<ActorDirectory | undefined>(actors.directory);
