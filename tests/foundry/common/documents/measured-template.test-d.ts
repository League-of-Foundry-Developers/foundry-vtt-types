import { expectTypeOf } from "vitest";

declare const template: foundry.documents.BaseMeasuredTemplate;
expectTypeOf(template._id).toEqualTypeOf<string | null>();
expectTypeOf(template.t).toEqualTypeOf<foundry.CONST.MEASURED_TEMPLATE_TYPES>();
expectTypeOf(template.parent).toEqualTypeOf<Scene | null>();

const scene = new Scene({ name: "My scene" });

class TestBaseMeasuredTemplate extends foundry.documents.BaseMeasuredTemplate {};

new TestBaseMeasuredTemplate();

new TestBaseMeasuredTemplate({ x: 100, y: 100 });

expectTypeOf(
  new TestBaseMeasuredTemplate({ x: 100, y: 100 }, scene),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();
expectTypeOf(
  new TestBaseMeasuredTemplate({}, scene),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();
expectTypeOf(
  new TestBaseMeasuredTemplate(undefined, scene),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();
expectTypeOf(
  new TestBaseMeasuredTemplate(
    {
      _id: null,
      user: null,
      t: null,
      x: null,
      y: null,
      distance: null,
      angle: null,
      width: null,
      borderColor: null,
      fillColor: null,
      texture: null,
      flags: null,
    },
    scene,
  ),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();
expectTypeOf(
  new TestBaseMeasuredTemplate(
    {
      _id: undefined,
      user: undefined,
      t: undefined,
      x: undefined,
      y: undefined,
      distance: undefined,
      angle: undefined,
      width: undefined,
      borderColor: undefined,
      fillColor: undefined,
      texture: undefined,
      flags: undefined,
    },
    scene,
  ),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();

expectTypeOf(
  new TestBaseMeasuredTemplate(
    {
      _id: "10",
      user: "11",
      t: "ray",
      x: 0,
      y: 0,
      distance: 10,
      angle: 360,
      width: 10,
      borderColor: "#000000",
      fillColor: "#ffffff",
      texture: "path/to/a/texture",
      flags: {},
    },
    scene,
  ),
).toEqualTypeOf<foundry.documents.BaseMeasuredTemplate>();
