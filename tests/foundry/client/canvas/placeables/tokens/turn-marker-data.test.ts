import { describe, expect, expectTypeOf, test } from "vitest";

import TurnMarkerData = foundry.canvas.placeables.tokens.TurnMarkerData;
import SchemaField = foundry.data.fields.SchemaField;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

export const createData = {
  id: "ARandomIDForTest",
  label: "Test TurnMarkerData",
  config: {
    shader: null,
    spin: 0.2,
    pulse: {
      speed: 1,
      min: 0.6,
      max: 1.2,
    },
  },
} satisfies TurnMarkerData.CreateData;

describe("TurnMarkerData Tests", () => {
  test("Construction", () => {
    const empty = new TurnMarkerData();
    expectTypeOf(empty).toEqualTypeOf<TurnMarkerData>();
    expect(empty).toBeInstanceOf(TurnMarkerData);

    const full = new TurnMarkerData(createData);
    expectTypeOf(full).toEqualTypeOf<TurnMarkerData>();
    expect(empty).toBeInstanceOf(TurnMarkerData);
  });

  const instance = new TurnMarkerData(createData);
  const instanceEmpty = new TurnMarkerData();

  test("Schema Properties", () => {
    expectTypeOf(instance.id).toEqualTypeOf<string | undefined>();
    expect(instance.id).toBe(createData.id);
    expect(instanceEmpty.id).toBeUndefined();

    expectTypeOf(instance.label).toEqualTypeOf<string | undefined>();
    expect(instance.label).toBe(createData.label);
    expect(instanceEmpty.label).toBeUndefined();

    expectTypeOf(instance.config.shader).toEqualTypeOf<typeof AbstractBaseShader | null | undefined>();
    expect(instance.config.shader).toBe(createData.config.shader);
    expect(instanceEmpty.config.shader).toBeUndefined();

    expectTypeOf(instance.config.spin).toEqualTypeOf<number>();
    expect(instance.config.spin).toBe(createData.config.spin);
    expect(instanceEmpty.config.spin).toBe(0);

    expectTypeOf(instance.config.pulse.speed).toEqualTypeOf<number>();
    expect(instance.config.pulse.speed).toBe(createData.config.pulse.speed);
    expect(instanceEmpty.config.pulse.speed).toBe(0);

    expectTypeOf(instance.config.pulse.min).toEqualTypeOf<number>();
    expect(instance.config.pulse.min).toBe(createData.config.pulse.min);
    expect(instanceEmpty.config.pulse.min).toBe(0.8);

    expectTypeOf(instance.config.pulse.max).toEqualTypeOf<number>();
    expect(instance.config.pulse.max).toBe(createData.config.pulse.max);
    expect(instanceEmpty.config.pulse.max).toBe(1);
  });

  test("DataModel template overrides", () => {
    const defineSchema = TurnMarkerData.defineSchema();
    expectTypeOf(defineSchema).toEqualTypeOf<TurnMarkerData.Schema>;
    expect(defineSchema.config).toBeInstanceOf(SchemaField);

    const schema = TurnMarkerData.schema;
    expectTypeOf(schema).toEqualTypeOf<SchemaField<TurnMarkerData.Schema>>();
    expect(schema).toBeInstanceOf(SchemaField);

    const _schema = TurnMarkerData["_schema"];
    expectTypeOf(_schema).toEqualTypeOf<SchemaField<TurnMarkerData.Schema>>();
    expect(_schema).toBeInstanceOf(SchemaField);

    const vJoint = TurnMarkerData.validateJoint(createData);
    expectTypeOf(vJoint).toBeVoid();
    expect(vJoint).toBeUndefined();

    const fromSource = TurnMarkerData.fromSource(createData, {
      dropInvalidEmbedded: undefined,
      fallback: true,
      parent: null,
      strict: true,
    });
    expectTypeOf(fromSource).toEqualTypeOf<TurnMarkerData>();
    expect(fromSource).toBeInstanceOf(TurnMarkerData);

    const fromJSON = TurnMarkerData.fromJSON(JSON.stringify(createData));
    expectTypeOf(fromJSON).toEqualTypeOf<TurnMarkerData>();
    expect(fromJSON).toBeInstanceOf(TurnMarkerData);
  });
});
