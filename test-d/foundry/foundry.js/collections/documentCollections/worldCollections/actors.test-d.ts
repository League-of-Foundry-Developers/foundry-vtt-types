import type { ActorDataSource } from '../../../../../../src/foundry/common/data/data.mjs/actorData';

import { expectType } from 'tsd';

const actors = new Actors();
expectType<Actor>(actors.get('', { strict: true }));
expectType<ActorDataSource[]>(actors.toJSON());
expectType<ActorDirectory | undefined>(actors.directory);
