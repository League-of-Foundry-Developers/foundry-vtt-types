import { expectError, expectType } from 'tsd';

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

expectType<foundry.documents.BaseTile>(new foundry.documents.BaseTile());

expectType<foundry.documents.BaseTile>(new foundry.documents.BaseTile({}));

expectType<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    _id: undefined,
    img: undefined,
    width: undefined,
    height: undefined,
    x: undefined,
    y: undefined,
    z: undefined,
    rotation: undefined,
    alpha: undefined,
    tint: undefined,
    hidden: undefined,
    locked: undefined,
    overhead: undefined,
    occlusion: undefined,
    video: undefined,
    flags: undefined
  })
);

expectType<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    _id: null,
    img: null,
    width: null,
    height: null,
    x: null,
    y: null,
    z: null,
    rotation: null,
    alpha: null,
    tint: null,
    hidden: null,
    locked: null,
    overhead: null,
    occlusion: null,
    video: null,
    flags: null
  })
);

expectType<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    _id: 'BGBEITBTEIGE',
    img: 'path/to/some/image.png',
    width: 100,
    height: 200,
    x: 300,
    y: 500,
    z: 100,
    rotation: 0,
    alpha: 0,
    tint: '#FF0000',
    hidden: true,
    locked: false,
    overhead: true,
    occlusion: {
      mode: foundry.CONST.TILE_OCCLUSION_MODES.FADE,
      alpha: 1
    },
    video: {
      loop: true,
      autoplay: true,
      volume: 0.5
    },
    flags: {}
  })
);

expectType<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    occlusion: {}
  })
);

expectError<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    occlusion: { mode: 999 }
  })
);

expectType<foundry.documents.BaseTile>(
  new foundry.documents.BaseTile({
    video: {}
  })
);
