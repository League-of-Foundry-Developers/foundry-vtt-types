import { expectError, expectType } from 'tsd';

expectType<foundry.data.TileData>(new foundry.data.TileData());

expectType<foundry.data.TileData>(new foundry.data.TileData({}));

expectType<foundry.data.TileData>(
  new foundry.data.TileData({
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

expectType<foundry.data.TileData>(
  new foundry.data.TileData({
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

expectType<foundry.data.TileData>(
  new foundry.data.TileData({
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

expectType<foundry.data.TileData>(
  new foundry.data.TileData({
    occlusion: {}
  })
);

expectError<foundry.data.TileData>(
  new foundry.data.TileData({
    occlusion: { mode: 999 }
  })
);

expectType<foundry.data.TileData>(
  new foundry.data.TileData({
    video: {}
  })
);
