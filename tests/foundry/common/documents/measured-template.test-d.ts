import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseMeasuredTemplate = foundry.documents.BaseMeasuredTemplate;
import Document = foundry.abstract.Document;

class TestBaseMeasuredTemplate extends BaseMeasuredTemplate {}

let myTemplate;
// MeasuredTemplate has no hard required fields for construction
myTemplate = new TestBaseMeasuredTemplate();
myTemplate = new TestBaseMeasuredTemplate({});
myTemplate = new TestBaseMeasuredTemplate({
  _id: "XXXXXSomeIDXXXXX",
  author: "YYYYYSomeIDYYYYY",
  t: CONST.MEASURED_TEMPLATE_TYPES.RAY,
  x: 1230,
  y: 340,
  elevation: 20,
  sort: 2,
  distance: 100,
  angle: 360,
  width: 60,
  borderColor: "#321123",
  fillColor: "#987789",
  texture: "path/to/a/texture.webp",
  hidden: true,
  flags: {
    core: {
      sheetLock: false,
    },
  },
});
myTemplate = new TestBaseMeasuredTemplate({
  _id: null,
  author: null,
  t: null,
  x: null,
  y: null,
  elevation: null,
  sort: null,
  distance: null,
  angle: null,
  width: null,
  borderColor: null,
  fillColor: null,
  texture: null,
  hidden: null,
  flags: null,
});
myTemplate = new TestBaseMeasuredTemplate({
  _id: undefined,
  author: undefined,
  t: undefined,
  x: undefined,
  y: undefined,
  elevation: undefined,
  sort: undefined,
  distance: undefined,
  angle: undefined,
  width: undefined,
  borderColor: undefined,
  fillColor: undefined,
  texture: undefined,
  hidden: undefined,
  flags: undefined,
});

expectTypeOf(myTemplate).toEqualTypeOf<TestBaseMeasuredTemplate>();

expectTypeOf(myTemplate._id).toEqualTypeOf<string | null>();
expectTypeOf(myTemplate.author).toEqualTypeOf<User.Implementation | null>();
expectTypeOf(myTemplate.t).toEqualTypeOf<CONST.MEASURED_TEMPLATE_TYPES>();
expectTypeOf(myTemplate.x).toBeNumber();
expectTypeOf(myTemplate.y).toBeNumber();
expectTypeOf(myTemplate.elevation).toBeNumber();
expectTypeOf(myTemplate.sort).toBeNumber();
expectTypeOf(myTemplate.distance).toBeNumber();
expectTypeOf(myTemplate.direction).toBeNumber();
expectTypeOf(myTemplate.width).toBeNumber();
expectTypeOf(myTemplate.texture).toEqualTypeOf<string | null | undefined>();
expectTypeOf(myTemplate.hidden).toBeBoolean();
expectTypeOf(myTemplate.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();

// The following fields can't really be `undefined` because they have `initial`s, see https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3055
expectTypeOf(myTemplate.borderColor).toEqualTypeOf<Color | undefined>();
expectTypeOf(myTemplate.fillColor).toEqualTypeOf<Color | undefined>();

// non-schema
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myTemplate.user).toEqualTypeOf<User.Implementation | null>();
