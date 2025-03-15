import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseWall = foundry.documents.BaseWall;
import Document = foundry.abstract.Document;

const myScene = new Scene({ name: "foobar" });

class TestBaseWall extends BaseWall {}

let myWall = new TestBaseWall();
myWall = new TestBaseWall({});

// @ts-expect-error - c must be a length-4 array of integer coordinates
myWall = new TestBaseWall({ c: [10, 20] });

// @ts-expect-error - c must be a length-4 array of integer coordinates
myWall = new TestBaseWall({ c: [10, 20, 30, 40, 50] });

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - light can't be an arbitrary number
  light: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - move can't be an arbitrary number
  move: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - sight can't be an arbitrary number
  sight: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - sound can't be an arbitrary number
  sound: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - dir can't be an arbitrary number
  dir: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - door can't be an arbitrary number
  door: 9999,
});

new TestBaseWall({
  c: [10, 20, 30, 40],
  // @ts-expect-error - ds can't be an arbitrary number
  ds: 9999,
});

myWall = new TestBaseWall({
  _id: "XXXXXSomeIDXXXXX",
  c: [20, 30, 240, 340],
  light: CONST.WALL_SENSE_TYPES.DISTANCE,
  move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
  sight: CONST.WALL_SENSE_TYPES.LIMITED,
  sound: CONST.WALL_SENSE_TYPES.PROXIMITY,
  dir: CONST.WALL_DIRECTIONS.LEFT,
  door: CONST.WALL_DOOR_TYPES.SECRET,
  ds: CONST.WALL_DOOR_STATES.LOCKED,
  doorSound: "futuristicForcefield",
  threshold: {
    light: 20,
    sight: 20,
    sound: 50,
    attenuation: true,
  },
  flags: {
    core: {
      sheetLock: false,
    },
  },
});
myWall = new TestBaseWall({
  _id: null,
  c: [20, 30, 240, 340],
  light: null,
  move: null,
  sight: null,
  sound: null,
  dir: null,
  door: null,
  ds: null,
  doorSound: null,
  threshold: {
    light: null,
    sight: null,
    sound: null,
    attenuation: null,
  },
  flags: null,
});
myWall = new TestBaseWall({ threshold: null });

myWall = new TestBaseWall({
  _id: undefined,
  c: [20, 30, 240, 340],
  light: undefined,
  move: undefined,
  sight: undefined,
  sound: undefined,
  dir: undefined,
  door: undefined,
  ds: undefined,
  doorSound: undefined,
  threshold: {
    light: undefined,
    sight: undefined,
    sound: undefined,
    attenuation: undefined,
  },
  flags: undefined,
});
myWall = new TestBaseWall({ threshold: undefined });

expectTypeOf(myWall).toEqualTypeOf<foundry.documents.BaseWall>();

expectTypeOf(myWall._id).toEqualTypeOf<string | null>();
expectTypeOf(myWall.c).toEqualTypeOf<[number, number, number, number]>();
expectTypeOf(myWall.light).toEqualTypeOf<CONST.WALL_SENSE_TYPES | null>();
expectTypeOf(myWall.move).toEqualTypeOf<CONST.WALL_MOVEMENT_TYPES | null>();
expectTypeOf(myWall.sight).toEqualTypeOf<CONST.WALL_SENSE_TYPES | null>();
expectTypeOf(myWall.sound).toEqualTypeOf<CONST.WALL_SENSE_TYPES | null>();
expectTypeOf(myWall.dir).toEqualTypeOf<CONST.WALL_DIRECTIONS | null>();
expectTypeOf(myWall.door).toEqualTypeOf<CONST.WALL_DOOR_TYPES | null>();
expectTypeOf(myWall.ds).toEqualTypeOf<CONST.WALL_DOOR_STATES | null>();
expectTypeOf(myWall.doorSound).toEqualTypeOf<string | undefined>();
expectTypeOf(myWall.threshold.light).toEqualTypeOf<number | null>();
expectTypeOf(myWall.threshold.sight).toEqualTypeOf<number | null>();
expectTypeOf(myWall.threshold.sound).toEqualTypeOf<number | null>();
expectTypeOf(myWall.threshold.attenuation).toBeBoolean();
expectTypeOf(myWall.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
