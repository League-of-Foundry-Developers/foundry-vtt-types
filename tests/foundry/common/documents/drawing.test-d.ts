import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseDrawing = foundry.documents.BaseDrawing;
import Document = foundry.abstract.Document;

class TestBaseDrawing extends foundry.documents.BaseDrawing {}

// @ts-expect-error validateJoint requires the shape be visible
new TestBaseDrawing();

// Arguably this line should error but validation hasn't been written for that yet.
new TestBaseDrawing({});

new TestBaseDrawing({
  _id: "XXXXXSomeIDXXXXX",
  author: "YYYYYSomeIDYYYYY",
  shape: {
    // you would never actually have all of these at the same time
    type: "p",
    height: 20,
    width: 30,
    radius: 400,
    points: [500, 500, 37, 28],
  },
  x: 740,
  y: 230,
  elevation: 20,
  sort: 42,
  rotation: 0,
  bezierFactor: 0.216,
  fillType: CONST.DRAWING_FILL_TYPES.PATTERN,
  fillColor: "#FEFFAF",
  fillAlpha: 0.5,
  strokeWidth: 2,
  strokeColor: "#F9889F",
  strokeAlpha: 0.9,
  texture: "path/to/a/texture.png",
  text: "Hello World",
  fontFamily: "Amiri",
  fontSize: 96,
  textColor: "#123456",
  textAlpha: 0.7,
  hidden: false,
  locked: false,
  flags: {
    core: {
      sheetLock: false,
    },
  },
});

new TestBaseDrawing({
  _id: null,
  author: null,
  shape: {
    type: null,
    height: null,
    width: null,
    radius: null,
    points: null,
  },
  x: null,
  y: null,
  elevation: null,
  sort: null,
  rotation: null,
  bezierFactor: null,
  fillType: null,
  fillColor: null,
  fillAlpha: null,
  strokeWidth: null,
  strokeColor: null,
  strokeAlpha: null,
  texture: null,
  text: null,
  fontFamily: null,
  fontSize: null,
  textColor: null,
  textAlpha: null,
  hidden: null,
  locked: null,
  flags: null,
});
new TestBaseDrawing({ shape: null });

new TestBaseDrawing({
  _id: undefined,
  author: undefined,
  shape: {
    type: undefined,
    height: undefined,
    width: undefined,
    radius: undefined,
    points: undefined,
  },
  x: undefined,
  y: undefined,
  elevation: undefined,
  sort: undefined,
  rotation: undefined,
  bezierFactor: undefined,
  fillType: undefined,
  fillColor: undefined,
  fillAlpha: undefined,
  strokeWidth: undefined,
  strokeColor: undefined,
  strokeAlpha: undefined,
  texture: undefined,
  text: undefined,
  fontFamily: undefined,
  fontSize: undefined,
  textColor: undefined,
  textAlpha: undefined,
  hidden: undefined,
  locked: undefined,
  flags: undefined,
});

const myDrawing = new TestBaseDrawing({ shape: undefined });

expectTypeOf(myDrawing).toEqualTypeOf<BaseDrawing>();

expectTypeOf(myDrawing._id).toEqualTypeOf<string | null>();
expectTypeOf(myDrawing.author).toEqualTypeOf<User.Stored | null>();

// ShapeData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myDrawing.shape).toEqualTypeOf<foundry.data.ShapeData>();

expectTypeOf(myDrawing.x).toBeNumber();
expectTypeOf(myDrawing.y).toBeNumber();
expectTypeOf(myDrawing.elevation).toBeNumber();
expectTypeOf(myDrawing.sort).toBeNumber();
expectTypeOf(myDrawing.rotation).toBeNumber();
expectTypeOf(myDrawing.bezierFactor).toBeNumber();
expectTypeOf(myDrawing.fillType).toEqualTypeOf<CONST.DRAWING_FILL_TYPES>();
expectTypeOf(myDrawing.fillAlpha).toBeNumber();
expectTypeOf(myDrawing.strokeAlpha).toBeNumber();
expectTypeOf(myDrawing.texture).toEqualTypeOf<string | null>();
expectTypeOf(myDrawing.text).toEqualTypeOf<string | undefined>();
expectTypeOf(myDrawing.textAlpha).toBeNumber();
expectTypeOf(myDrawing.hidden).toBeBoolean();
expectTypeOf(myDrawing.locked).toBeBoolean();
expectTypeOf(myDrawing.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
expectTypeOf(myDrawing.fillColor).toEqualTypeOf<Color>();
expectTypeOf(myDrawing.strokeWidth).toEqualTypeOf<number>();
expectTypeOf(myDrawing.strokeColor).toEqualTypeOf<Color>();
expectTypeOf(myDrawing.fontFamily).toEqualTypeOf<string>();
expectTypeOf(myDrawing.fontSize).toEqualTypeOf<number>();
expectTypeOf(myDrawing.textColor).toEqualTypeOf<Color>();

// non-schema:
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myDrawing.z).toBeNumber();
