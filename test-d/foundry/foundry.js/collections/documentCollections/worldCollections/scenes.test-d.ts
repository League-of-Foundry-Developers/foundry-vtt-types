import { expectType } from 'tsd';

expectType<'Scene'>(Scenes.documentName);

const scenes = new Scenes();
expectType<StoredDocument<Scene> | undefined>(scenes.active);
expectType<StoredDocument<Scene> | undefined>(scenes.current);
expectType<StoredDocument<Scene> | undefined>(scenes.viewed);
