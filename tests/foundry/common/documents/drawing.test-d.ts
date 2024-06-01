import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseDrawing.create({})).toEqualTypeOf<
  Promise<StoredDocument<DrawingDocument> | undefined>
>();
expectTypeOf(foundry.documents.BaseDrawing.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<DrawingDocument>[]>
>();
expectTypeOf(foundry.documents.BaseDrawing.updateDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();
expectTypeOf(foundry.documents.BaseDrawing.deleteDocuments([])).toEqualTypeOf<Promise<DrawingDocument[]>>();

const drawing = await foundry.documents.BaseDrawing.create({}, { temporary: true });
if (drawing) {
  expectTypeOf(drawing).toEqualTypeOf<DrawingDocument>();
  // @ts-expect-error Drawing is distinct from the DrawingDocument
  expectTypeOf(drawing).toEqualTypeOf<Drawing>();
}

expectTypeOf(new foundry.documents.BaseDrawing()).toEqualTypeOf<foundry.documents.BaseDrawing>();
expectTypeOf(new foundry.documents.BaseDrawing({})).toEqualTypeOf<foundry.documents.BaseDrawing>();
expectTypeOf(
  new foundry.documents.BaseDrawing({
    author: null,
    bezierFactor: null,
    fillAlpha: null,
    fillColor: null,
    fillType: null,
    flags: null,
    fontFamily: null,
    fontSize: null,
    height: null,
    hidden: null,
    locked: null,
    points: null,
    rotation: null,
    strokeAlpha: null,
    strokeColor: null,
    strokeWidth: null,
    text: null,
    textColor: null,
    texture: null,
    type: null,
    width: null,
    x: null,
    y: null,
    z: null,
    _id: null,
  }),
).toEqualTypeOf<foundry.documents.BaseDrawing>();
expectTypeOf(
  new foundry.documents.BaseDrawing({
    author: undefined,
    bezierFactor: undefined,
    fillAlpha: undefined,
    fillColor: undefined,
    fillType: undefined,
    flags: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    height: undefined,
    hidden: undefined,
    locked: undefined,
    points: undefined,
    rotation: undefined,
    strokeAlpha: undefined,
    strokeColor: undefined,
    strokeWidth: undefined,
    text: undefined,
    textColor: undefined,
    texture: undefined,
    type: undefined,
    width: undefined,
    x: undefined,
    y: undefined,
    z: undefined,
    _id: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseDrawing>();

expectTypeOf(
  new foundry.documents.BaseDrawing({
    author: new User(),
    bezierFactor: 0,
    fillAlpha: 0.5,
    fillColor: "#FFFFFF",
    fillType: 0,
    flags: {},
    fontFamily: "Signika",
    fontSize: 48,
    height: 0,
    hidden: false,
    locked: false,
    points: [],
    rotation: 0,
    strokeAlpha: 1,
    strokeColor: "#FFFFFF",
    strokeWidth: 0,
    text: "Hello World",
    textColor: "#FFFFFF",
    texture: "path/to/a/texture.png",
    type: "p",
    width: 0,
    x: 0,
    y: 0,
    z: 0,
    _id: "NlBhrPq62QrMErNh",
  }),
).toEqualTypeOf<foundry.documents.BaseDrawing>();
