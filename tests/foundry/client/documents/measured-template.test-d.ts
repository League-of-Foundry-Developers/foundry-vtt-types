import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";

// eslint-disable-next-line @typescript-eslint/no-deprecated
import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import BaseMeasuredTemplate = foundry.documents.BaseMeasuredTemplate;
import Document = foundry.abstract.Document;

const doc = new MeasuredTemplateDocument.implementation();

expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(doc.layer).toEqualTypeOf<TemplateLayer>();
expectTypeOf(doc.rotation).toEqualTypeOf<MeasuredTemplateDocument.Implementation["direction"]>();

expectTypeOf(doc.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();

class TestBaseMeasuredTemplate extends BaseMeasuredTemplate {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(
          this.pack!,
        ) as foundry.documents.collections.CompendiumCollection.ForDocument<"MeasuredTemplate">)
      : null;
  }
}

// MeasuredTemplate has no hard required fields for construction
new TestBaseMeasuredTemplate();

new TestBaseMeasuredTemplate({});

new TestBaseMeasuredTemplate({
  _id: "XXXXXSomeIDXXXXX",
  author: "YYYYYSomeIDYYYYY",
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

new TestBaseMeasuredTemplate({
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

const myTemplate = new TestBaseMeasuredTemplate({
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
expectTypeOf(myTemplate.author).toEqualTypeOf<User.Stored | null>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myTemplate.t).toEqualTypeOf<CONST.MEASURED_TEMPLATE_TYPES>();
expectTypeOf(myTemplate.x).toBeNumber();
expectTypeOf(myTemplate.y).toBeNumber();
expectTypeOf(myTemplate.elevation).toBeNumber();
expectTypeOf(myTemplate.sort).toBeNumber();
expectTypeOf(myTemplate.distance).toBeNumber();
expectTypeOf(myTemplate.direction).toBeNumber();
expectTypeOf(myTemplate.width).toBeNumber();
expectTypeOf(myTemplate.texture).toEqualTypeOf<string | null>();
expectTypeOf(myTemplate.hidden).toBeBoolean();
expectTypeOf(myTemplate.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
expectTypeOf(myTemplate.borderColor).toEqualTypeOf<Color>();
expectTypeOf(myTemplate.fillColor).toEqualTypeOf<Color>();

// non-schema
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myTemplate.user).toEqualTypeOf<User.Stored | null>();
