import { expectError, expectType } from "tsd";

expectError(new foundry.data.WallData());
expectError(new foundry.data.WallData({}));
expectError(new foundry.data.WallData({ c: [10, 20] }));
expectType<foundry.data.WallData>(new foundry.data.WallData({ c: [10, 20, 30, 40] }));
expectType<foundry.data.WallData>(
  new foundry.data.WallData({
    _id: null,
    c: [10, 20, 30, 40],
    light: null,
    move: null,
    sight: null,
    sound: null,
    dir: null,
    door: null,
    ds: null,
    flags: null,
  }),
);
expectType<foundry.data.WallData>(
  new foundry.data.WallData({
    _id: undefined,
    c: [10, 20, 30, 40],
    light: undefined,
    move: undefined,
    sight: undefined,
    sound: undefined,
    dir: undefined,
    door: undefined,
    ds: undefined,
    flags: undefined,
  }),
);
expectType<foundry.data.WallData>(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    light: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    move: foundry.CONST.WALL_MOVEMENT_TYPES.NORMAL,
    sight: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    sound: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
    dir: foundry.CONST.WALL_DIRECTIONS.BOTH,
    door: foundry.CONST.WALL_DOOR_TYPES.NONE,
    ds: foundry.CONST.WALL_DOOR_STATES.CLOSED,
    flags: {},
  }),
);
expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    light: 9999,
  }),
);
expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    move: 9999,
  }),
);
expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    sight: 9999,
  }),
);
expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    sound: 9999,
  }),
);

expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    dir: 9999,
  }),
);
expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    door: 9999,
  }),
);

expectError(
  new foundry.data.WallData({
    c: [10, 20, 30, 40],
    ds: 9999,
  }),
);
