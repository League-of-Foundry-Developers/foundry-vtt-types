import { expectType } from 'tsd';

const doc = new TileDocument();
expectType<ForegroundLayer | BackgroundLayer>(doc.layer);
