import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseNote = foundry.documents.BaseNote;
import Document = foundry.abstract.Document;

class TestBaseNote extends BaseNote {}

let myNote;
myNote = new TestBaseNote();
myNote = new TestBaseNote({});
myNote = new TestBaseNote({
  _id: "XXXXXSomeIDXXXXX",
  entryId: "YYYYYSomeIDYYYYY",
  pageId: "ZZZZZSomeIDZZZZZ",
  x: 100,
  y: 300,
  elevation: 20,
  sort: 11,
  texture: {
    alphaThreshold: 1,
    anchorX: 10,
    anchorY: 20,
    fit: "height",
    offsetX: -20,
    offsetY: -10,
    rotation: 90,
    scaleX: 1.2,
    scaleY: 1.3,
    src: "path/to/some/icon.svg",
    tint: "#FFFFFF",
  },
  iconSize: 100,
  text: "Some text",
  fontFamily: "Comic Sans",
  fontSize: 50,
  textAnchor: CONST.TEXT_ANCHOR_POINTS.TOP,
  textColor: "#FF0000",
  global: true,
  flags: {
    core: {
      sheetLock: false,
    },
  },
});
myNote = new TestBaseNote({
  _id: null,
  entryId: null,
  pageId: null,
  x: null,
  y: null,
  elevation: null,
  sort: null,
  texture: {
    alphaThreshold: null,
    anchorX: null,
    anchorY: null,
    fit: null,
    offsetX: null,
    offsetY: null,
    rotation: null,
    scaleX: null,
    scaleY: null,
    src: null,
    tint: null,
  },
  iconSize: null,
  text: null,
  fontFamily: null,
  fontSize: null,
  textAnchor: null,
  textColor: null,
  global: null,
  flags: null,
});
myNote = new TestBaseNote({ texture: null });

myNote = new TestBaseNote({
  _id: undefined,
  entryId: undefined,
  pageId: undefined,
  x: undefined,
  y: undefined,
  elevation: undefined,
  sort: undefined,
  texture: {
    alphaThreshold: undefined,
    anchorX: undefined,
    anchorY: undefined,
    fit: undefined,
    offsetX: undefined,
    offsetY: undefined,
    rotation: undefined,
    scaleX: undefined,
    scaleY: undefined,
    src: undefined,
    tint: undefined,
  },
  iconSize: undefined,
  text: undefined,
  fontFamily: undefined,
  fontSize: undefined,
  textAnchor: undefined,
  textColor: undefined,
  global: undefined,
  flags: undefined,
});
myNote = new TestBaseNote({ texture: undefined });

expectTypeOf(myNote).toEqualTypeOf<BaseNote>();

expectTypeOf(myNote._id).toEqualTypeOf<string | null>();
expectTypeOf(myNote.entryId).toEqualTypeOf<string | null>();
expectTypeOf(myNote.pageId).toEqualTypeOf<string | null>();
expectTypeOf(myNote.x).toBeNumber();
expectTypeOf(myNote.y).toBeNumber();
expectTypeOf(myNote.elevation).toBeNumber();
expectTypeOf(myNote.sort).toBeNumber();

// TextureData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myNote.texture).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.TextureData.Schema>
>();

expectTypeOf(myNote.iconSize).toBeNumber();
expectTypeOf(myNote.text).toEqualTypeOf<string | undefined>();
expectTypeOf(myNote.fontFamily).toBeString();
expectTypeOf(myNote.fontSize).toEqualTypeOf<number | null>();
expectTypeOf(myNote.textAnchor).toEqualTypeOf<CONST.TEXT_ANCHOR_POINTS | null>();
expectTypeOf(myNote.textColor).toEqualTypeOf<Color>();
expectTypeOf(myNote.global).toBeBoolean();
expectTypeOf(myNote.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
