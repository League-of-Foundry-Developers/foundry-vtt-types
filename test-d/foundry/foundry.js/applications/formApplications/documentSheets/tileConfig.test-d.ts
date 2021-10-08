import { expectType } from 'tsd';

declare const tile: TileDocument;

const tileConfig = new TileConfig(tile, { preview: true });
expectType<TileDocument>(tileConfig.document);
expectType<string>((await tileConfig.getData()).submitText);
expectType<Record<0 | 1 | 2 | 3, string>>((await tileConfig.getData()).occlusionModes);
