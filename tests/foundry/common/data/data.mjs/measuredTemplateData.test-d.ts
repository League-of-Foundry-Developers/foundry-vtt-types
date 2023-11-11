import { expectTypeOf } from "vitest";

const scene = new Scene({ name: "My scene" });

// @ts-expect-error - A MeasuredTemplateData requires data.
new foundry.data.MeasuredTemplateData();

// @ts-expect-error - A MeasuredTemplateData requires data with an x and y property and a scene.
new foundry.data.MeasuredTemplateData({ x: 100, y: 100 });

expectTypeOf(
  new foundry.data.MeasuredTemplateData({ x: 100, y: 100 }, scene),
).toEqualTypeOf<foundry.data.MeasuredTemplateData>();
expectTypeOf(new foundry.data.MeasuredTemplateData({}, scene)).toEqualTypeOf<foundry.data.MeasuredTemplateData>();
expectTypeOf(
  new foundry.data.MeasuredTemplateData(undefined, scene),
).toEqualTypeOf<foundry.data.MeasuredTemplateData>();
expectTypeOf(
  new foundry.data.MeasuredTemplateData(
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
).toEqualTypeOf<foundry.data.MeasuredTemplateData>();
expectTypeOf(
  new foundry.data.MeasuredTemplateData(
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
).toEqualTypeOf<foundry.data.MeasuredTemplateData>();

expectTypeOf(
  new foundry.data.MeasuredTemplateData(
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
).toEqualTypeOf<foundry.data.MeasuredTemplateData>();
