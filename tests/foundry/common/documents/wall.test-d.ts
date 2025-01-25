// import { expectTypeOf } from "vitest";

// const myScene = new Scene({ name: "foobar" });

// Note (2025-01-23): The constructor for this class is currently missing due to a
// circular error, so these tests are failing for now.

// // @ts-expect-error - A BaseWall requires data.
// new foundry.documents.BaseWall();

// // @ts-expect-error - A BaseWall requires c (coordinates).
// new foundry.documents.BaseWall({});

// new foundry.documents.BaseWall({ c: [0, 0, 0, 0] });
// new foundry.documents.BaseWall({ c: [0, 0, 0, 0] }, { parent: myScene });

// // @ts-expect-error - a BaseWall requires data.
// new foundry.documents.BaseWall();

// // @ts-expect-error - a BaseWall requires c (coordinates).
// new foundry.documents.BaseWall({});

// // @ts-expect-error - c must be a length-4 array of integer coordinates
// new foundry.documents.BaseWall({ c: [10, 20] });
// // @ts-expect-error - c must be a length-4 array of integer coordinates
// new foundry.documents.BaseWall({ c: [10, 20, 30, 40, 50] });

// expectTypeOf(new foundry.documents.BaseWall({ c: [10, 20, 30, 40] })).toEqualTypeOf<foundry.documents.BaseWall>();
// expectTypeOf(
//   new foundry.documents.BaseWall({
//     _id: null,
//     c: [10, 20, 30, 40],
//     light: null,
//     move: null,
//     sight: null,
//     sound: null,
//     dir: null,
//     door: null,
//     ds: null,
//     flags: null,
//   }),
// ).toEqualTypeOf<foundry.documents.BaseWall>();
// expectTypeOf(
//   new foundry.documents.BaseWall({
//     _id: undefined,
//     c: [10, 20, 30, 40],
//     light: undefined,
//     move: undefined,
//     sight: undefined,
//     sound: undefined,
//     dir: undefined,
//     door: undefined,
//     ds: undefined,
//     flags: undefined,
//   }),
// ).toEqualTypeOf<foundry.documents.BaseWall>();
// expectTypeOf(
//   new foundry.documents.BaseWall({
//     c: [10, 20, 30, 40],
//     light: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
//     move: foundry.CONST.WALL_MOVEMENT_TYPES.NORMAL,
//     sight: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
//     sound: foundry.CONST.WALL_SENSE_TYPES.NORMAL,
//     dir: foundry.CONST.WALL_DIRECTIONS.BOTH,
//     door: foundry.CONST.WALL_DOOR_TYPES.NONE,
//     ds: foundry.CONST.WALL_DOOR_STATES.CLOSED,
//     flags: {},
//   }),
// ).toEqualTypeOf<foundry.documents.BaseWall>();

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - light can't be an arbitrary number
//   light: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - move can't be an arbitrary number
//   move: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - sight can't be an arbitrary number
//   sight: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - sound can't be an arbitrary number
//   sound: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - dir can't be an arbitrary number
//   dir: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - door can't be an arbitrary number
//   door: 9999,
// });

// new foundry.documents.BaseWall({
//   c: [10, 20, 30, 40],
//   // @ts-expect-error - ds can't be an arbitrary number
//   ds: 9999,
// });
