import { expectType } from 'tsd';

const doc = new AmbientSoundDocument();

expectType<'l' | 'g'>(doc.type);
