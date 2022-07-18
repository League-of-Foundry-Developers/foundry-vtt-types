import { expectType, expectError } from 'tsd';

declare const scene: Scene;

new foundry.documents.BaseWall({ c: [0, 0, 0, 0] });
new foundry.documents.BaseWall({ c: [0, 0, 0, 0] }, { parent: scene });

expectError(new foundry.documents.BaseWall());
expectError(new foundry.documents.BaseWall({ c: [10, 20] }));

expectType<foundry.documents.BaseWall>(new foundry.documents.BaseWall({ c: [10, 20, 30, 40] }));
expectType<foundry.documents.BaseWall>(
  new foundry.documents.BaseWall({
    _id: null,
    c: [10, 20, 30, 40]
  })
);
expectType<foundry.documents.BaseWall>(
  new foundry.documents.BaseWall({
    _id: null,
    c: [10, 20, 30, 40]
  })
);
expectType<foundry.documents.BaseWall>(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    light: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    move: foundry.CONST.WALL_MOVEMENT_TYPES.NORMAL,
    sight: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    sound: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    dir: foundry.CONST.WALL_DIRECTIONS.BOTH,
    door: foundry.CONST.WALL_DOOR_TYPES.NONE,
    ds: foundry.CONST.WALL_DOOR_STATES.CLOSED,
    flags: {}
  })
);
expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    light: 9999
  })
);
expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    move: 9999
  })
);
expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    sight: 9999
  })
);
expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    sound: 9999
  })
);

expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    dir: 9999
  })
);
expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    door: 9999
  })
);

expectError(
  new foundry.documents.BaseWall({
    c: [10, 20, 30, 40],
    ds: 9999
  })
);
