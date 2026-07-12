import { describe, expectTypeOf, test } from "vitest";

import VFXReferenceField = foundry.canvas.vfx.fields.VFXReferenceField;
import VFXReferenceObjectField = foundry.canvas.vfx.fields.VFXReferenceObjectField;
import VFXReferencePointField = foundry.canvas.vfx.fields.VFXReferencePointField;
import VFXPointField = foundry.canvas.vfx.fields.VFXPointField;
import VFXPointSourcePolygonField = foundry.canvas.vfx.fields.VFXPointSourcePolygonField;

import fields = foundry.data.fields;

describe("VFXReferenceField", () => {
  test("isReference detects reference objects", () => {
    expectTypeOf(VFXReferenceField.isReference({ reference: "target" })).toEqualTypeOf<boolean>();
    expectTypeOf(VFXReferenceField.isReference("not a ref")).toEqualTypeOf<boolean>();
  });

  test("wraps a StringField — initialized type is string | undefined", () => {
    const field = new VFXReferenceField(new fields.StringField());
    expectTypeOf(field).toExtend<VFXReferenceField>();
  });

  test("resolve returns inner field initialized type or undefined", () => {
    const field = new VFXReferenceField(new fields.StringField());
    const resolved = field.resolve("concrete", {});
    // result is string | undefined (inner field initialized type)
    expectTypeOf(resolved).toEqualTypeOf<string | undefined>();
  });
});

describe("VFXReferenceObjectField", () => {
  test("can be constructed with a SchemaField", () => {
    const field = new VFXReferenceObjectField(
      new fields.SchemaField({ x: new fields.NumberField(), y: new fields.NumberField() }),
    );
    expectTypeOf(field).toExtend<VFXReferenceObjectField>();
  });

  test("accepts object references with per-property deltas", () => {
    const field = new VFXReferenceObjectField(
      new fields.SchemaField({ x: new fields.NumberField(), y: new fields.NumberField() }),
    );
    field.resolve({ reference: "target", deltas: { x: 1, y: -1 } }, {});
  });
});

describe("VFXReferencePointField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXReferencePointField();
    expectTypeOf(field).toExtend<VFXReferencePointField>();
  });

  test("accepts point references with per-axis deltas", () => {
    const field = new VFXReferencePointField();
    field.resolve({ reference: "target", deltas: { x: 1, y: -1 } }, {});
  });
});

describe("VFXPointField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXPointField();
    expectTypeOf(field).toExtend<VFXPointField>();
  });
});

describe("VFXPointSourcePolygonField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXPointSourcePolygonField();
    expectTypeOf(field).toExtend<VFXPointSourcePolygonField>();
  });
});
