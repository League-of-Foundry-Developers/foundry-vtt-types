import { expectType } from 'tsd';

expectType<'Tile'>(Tile.embeddedName);
expectType<Tile>(Tile.createPreview({ x: 100 }));

declare const doc: TileDocument;
const tile = new Tile(doc);
declare const token: Token;

expectType<PIXI.Container | undefined>(tile.frame);
expectType<PIXI.Texture | undefined>(tile.texture);
expectType<PIXI.Sprite | undefined>(tile.tile);
expectType<PIXI.Graphics | undefined>(tile.bg);
expectType<boolean>(tile.occluded);
expectType<number>(tile.aspectRatio);
expectType<HTMLImageElement | HTMLVideoElement | undefined>(tile.sourceElement);
expectType<boolean>(tile.isVideo);
expectType<boolean>(tile.isRoof);
expectType<Promise<Tile>>(tile.draw());
expectType<Tile>(tile.refresh());

expectType<void>(tile.play(true));
expectType<void>(tile.play(false, {}));
expectType<void>(tile.play(false, { loop: true, offset: 10, volume: 10 }));

expectType<void>(tile.updateOcclusion([token]));

expectType<boolean>(tile.testOcclusion(token));
expectType<boolean>(tile.testOcclusion(token, {}));
expectType<boolean>(tile.testOcclusion(token, { corners: false }));

expectType<boolean>(tile.containsPixel(236, 154));

expectType<PIXI.Sprite | undefined>(tile.getRoofSprite());
expectType<void>(tile.swapLayer());
expectType<void>(tile.activateListeners());
