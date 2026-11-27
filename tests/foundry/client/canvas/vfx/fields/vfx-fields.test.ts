import { describe, expect, expectTypeOf, test } from "vitest";

import VFXReferenceField = foundry.canvas.vfx.fields.VFXReferenceField;
import VFXReferenceObjectField = foundry.canvas.vfx.fields.VFXReferenceObjectField;
import VFXReferencePointField = foundry.canvas.vfx.fields.VFXReferencePointField;
import VFXPointField = foundry.canvas.vfx.fields.VFXPointField;
import VFXPositionField = foundry.canvas.vfx.fields.VFXPositionField;
import VFXReferencePositionField = foundry.canvas.vfx.fields.VFXReferencePositionField;
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

  test("options widen the initialized type", () => {
    expectTypeOf<VFXReferenceField.InitializedType<fields.NumberField, { required: true }>>().toEqualTypeOf<
      number | null | undefined
    >();
    expectTypeOf<VFXReferenceField.InitializedType<fields.NumberField, { nullable: true }>>().toEqualTypeOf<
      number | null | undefined
    >();
  });

  test("default options preserve the wrapped field's required state", () => {
    expectTypeOf<
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      VFXReferenceField.AssignmentType<fields.StringField<{ required: true; nullable: false }>>
    >().toEqualTypeOf<string | VFXReferenceField.ReferenceData>();
  });

  test("options widen the persisted type", () => {
    expectTypeOf<VFXReferenceField.PersistedType<fields.NumberField, { nullable: true }>>().toEqualTypeOf<
      VFXReferenceField.ReferenceData | number | null | undefined
    >();
  });

  test("reference properties may explicitly be null", () => {
    const reference = {
      reference: "target",
      property: null,
    } satisfies VFXReferenceField.ReferenceData;
    expectTypeOf(reference.property).toEqualTypeOf<null>();
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
    field.resolve({ reference: "target", deltas: { x: 1, y: -1 } }, { target: { x: 0, y: 0 } });
  });

  test("reference properties may explicitly be null", () => {
    const reference = {
      reference: "target",
      property: null,
      deltas: {},
    } satisfies VFXReferenceObjectField.ReferenceData;
    expectTypeOf(reference.property).toEqualTypeOf<null>();
  });
});

describe("VFXReferencePointField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXReferencePointField();
    expectTypeOf(field).toExtend<VFXReferencePointField>();
  });

  test("accepts point references with per-axis deltas", () => {
    const field = new VFXReferencePointField();
    field.resolve({ reference: "target", deltas: { x: 1, y: -1 } }, { target: { x: 0, y: 0 } });
  });
});

describe("VFXPointField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXPointField();
    expectTypeOf(field).toExtend<VFXPointField>();
  });

  test("initialized type is the point schema, widened by options", () => {
    expectTypeOf<VFXPointField.InitializedType>().toEqualTypeOf<{ x: number; y: number }>();
    expectTypeOf<VFXPointField.InitializedType<{ nullable: true }>>().toEqualTypeOf<{
      x: number;
      y: number;
    } | null>();
  });
});

describe("VFXPointSourcePolygonField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXPointSourcePolygonField();
    expectTypeOf(field).toExtend<VFXPointSourcePolygonField>();
  });

  test("initialized type is always a PointSourcePolygon", () => {
    expectTypeOf<VFXPointSourcePolygonField.InitializedType>().toEqualTypeOf<
      foundry.canvas.geometry.PointSourcePolygon | null | undefined
    >();
  });
});

describe("VFXPositionField", () => {
  test("can be constructed with no arguments", () => {
    const field = new VFXPositionField();
    expectTypeOf(field).toExtend<VFXPositionField>();
    expect(Object.keys(field.fields)).toEqual(["x", "y", "elevation", "rotation", "scale", "sort", "sortLayer"]);
  });

  test("initialized type requires only the point", () => {
    expectTypeOf<VFXPositionField.InitializedType["x"]>().toEqualTypeOf<number>();
    expectTypeOf<VFXPositionField.InitializedType["elevation"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<VFXPositionField.InitializedType["scale"]>().toEqualTypeOf<{ x: number; y: number } | undefined>();
  });
});

describe("VFXReferencePositionField", () => {
  test("drops rotation and scale from a referenced object", () => {
    const field = new VFXReferencePositionField();
    expectTypeOf(field).toExtend<VFXReferencePositionField>();
    const resolved = field.resolve(
      { reference: "token", deltas: { elevation: 1 } },
      { token: { x: 1000, y: 2000, elevation: 5, sort: 3, rotation: 90 } },
    );
    expect(resolved).not.toHaveProperty("rotation");
    expect(resolved).toMatchObject({ x: 1000, y: 2000, elevation: 6, sort: 3 });
  });
});
