import { expectType } from 'tsd';

const actors = new Actors();
expectType<StoredDocument<Actor>>(actors.get('', { strict: true }));
expectType<StoredDocument<Actor>['_source'][]>(actors.toJSON());
expectType<ActorDirectory | undefined>(actors.directory);
expectType<Actor | undefined>(actors.tokens['foo']);
