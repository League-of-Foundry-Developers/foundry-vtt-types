import { expectType } from 'tsd';

const doc = new TileDocument({ width: 1, height: 1 });
expectType<typeof canvas['tokens']>(doc.layer);
