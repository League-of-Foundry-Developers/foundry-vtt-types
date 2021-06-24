import { expectType } from 'tsd';

expectType<'Scene'>(Scenes.documentName);

const scenes = new Scenes();
expectType<Scene | undefined>(scenes.active);
expectType<Scene | undefined>(scenes.current);
expectType<Scene | undefined>(scenes.viewed);
