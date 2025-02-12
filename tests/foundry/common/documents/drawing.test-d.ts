import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

class BaseDrawing extends foundry.documents.BaseDrawing {}

expectTypeOf(BaseDrawing.create({})).toEqualTypeOf<Promise<Document.Stored<DrawingDocument> | undefined>>();
expectTypeOf(BaseDrawing.createDocuments([])).toEqualTypeOf<Promise<Document.Stored<DrawingDocument>[]>>();
expectTypeOf(BaseDrawing.updateDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();
expectTypeOf(BaseDrawing.deleteDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();

const drawing = await BaseDrawing.create({}, { temporary: true });
if (drawing) {
  expectTypeOf(drawing).toEqualTypeOf<DrawingDocument>();
  // @ts-expect-error Drawing is distinct from the DrawingDocument
  expectTypeOf(drawing).toEqualTypeOf<Drawing>();
}

expectTypeOf(new BaseDrawing()).toEqualTypeOf<BaseDrawing>();
expectTypeOf(new BaseDrawing({})).toEqualTypeOf<BaseDrawing>();
expectTypeOf(
  new BaseDrawing({
    author: null,
    bezierFactor: null,
    fillAlpha: null,
    fillColor: null,
    fillType: null,
    flags: null,
    fontFamily: null,
    fontSize: null,
    hidden: null,
    locked: null,
    rotation: null,
    shape: null,
    strokeAlpha: null,
    strokeColor: null,
    strokeWidth: null,
    text: null,
    textColor: null,
    texture: null,
    x: null,
    y: null,
    z: null,
    _id: null,
  }),
).toEqualTypeOf<BaseDrawing>();
expectTypeOf(
  new BaseDrawing({
    author: undefined,
    bezierFactor: undefined,
    fillAlpha: undefined,
    fillColor: undefined,
    fillType: undefined,
    flags: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    hidden: undefined,
    locked: undefined,
    rotation: undefined,
    shape: undefined,
    strokeAlpha: undefined,
    strokeColor: undefined,
    strokeWidth: undefined,
    text: undefined,
    textColor: undefined,
    texture: undefined,
    x: undefined,
    y: undefined,
    z: undefined,
    _id: undefined,
  }),
).toEqualTypeOf<BaseDrawing>();

expectTypeOf(
  new BaseDrawing({
    author: new User.implementation({ name: "foo" }),
    bezierFactor: 0,
    fillAlpha: 0.5,
    fillColor: "#FFFFFF",
    fillType: 0,
    flags: {},
    fontFamily: "Signika",
    fontSize: 48,
    hidden: false,
    locked: false,
    rotation: 0,
    shape: {
      type: "p",
      height: 0,
      width: 0,
      points: [],
    },
    strokeAlpha: 1,
    strokeColor: "#FFFFFF",
    strokeWidth: 0,
    text: "Hello World",
    textColor: "#FFFFFF",
    texture: "path/to/a/texture.png",
    x: 0,
    y: 0,
    z: 0,
    _id: "NlBhrPq62QrMErNh",
  }),
).toEqualTypeOf<BaseDrawing>();
