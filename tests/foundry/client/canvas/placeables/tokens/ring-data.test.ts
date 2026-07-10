import { describe, expect, expectTypeOf, test } from "vitest";

import TokenRing = foundry.canvas.placeables.tokens.TokenRing;
import DynamicRingData = foundry.canvas.placeables.tokens.DynamicRingData;
import PrimaryBaseSamplerShader = foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader;
import TokenRingSamplerShader = foundry.canvas.rendering.shaders.TokenRingSamplerShader;
import SchemaField = foundry.data.fields.SchemaField;

export class TypesTestTokenRing extends TokenRing {
  #differentClass = true;
}

export class TypesTestTokenRingSamplerShader extends PrimaryBaseSamplerShader {
  #differentClass = true;
}

export const createData = {
  id: "myRingConfig",
  label: "MYSYSTEM.RingConfigs.myRingConfig.label",
  spritesheet: "path/to/spritesheet.json",
  effects: {
    foo: "bar",
  },
  framework: {
    ringClass: TypesTestTokenRing,
    shaderClass: TypesTestTokenRingSamplerShader,
  },
} satisfies DynamicRingData.CreateData;

describe("DynamicRingData Tests", () => {
  test("Construction", () => {
    const empty = new DynamicRingData();
    expectTypeOf(empty).toEqualTypeOf<DynamicRingData>();
    expect(empty).toBeInstanceOf(DynamicRingData);

    const nullish = new DynamicRingData({
      id: undefined,
      label: undefined,
      spritesheet: null,
      effects: {},
      framework: undefined,
    });
    expectTypeOf(nullish).toEqualTypeOf<DynamicRingData>();
    expect(nullish).toBeInstanceOf(DynamicRingData);

    const full = new DynamicRingData(createData);
    expectTypeOf(full).toEqualTypeOf<DynamicRingData>();
    expect(full).toBeInstanceOf(DynamicRingData);
  });

  const instance = new DynamicRingData(createData);
  const instanceEmpty = new DynamicRingData();

  test("Schema properties", () => {
    expectTypeOf(instance.id).toEqualTypeOf<string | undefined>();
    expect(instance.id).toBe(createData.id);
    expect(instanceEmpty.id).toBeUndefined();

    expectTypeOf(instance.label).toEqualTypeOf<string | undefined>();
    expect(instance.label).toBe(createData.label);
    expect(instanceEmpty.label).toBeUndefined();

    expectTypeOf(instance.spritesheet).toEqualTypeOf<string | null>();
    expect(instance.spritesheet).toBe(createData.spritesheet);
    expect(instanceEmpty.spritesheet).toBeNull();

    expectTypeOf(instance.effects).toEqualTypeOf<Record<string, string>>();
    expect(instance.effects).toEqual(createData.effects);
    expect(instanceEmpty.effects).toEqual(DynamicRingData.schema.fields.effects.initial);

    expectTypeOf(instance.framework.ringClass).toEqualTypeOf<typeof TokenRing>();
    expect(instance.framework.ringClass).toBe(createData.framework.ringClass);
    expect(instanceEmpty.framework.ringClass).toBe(TokenRing);

    expectTypeOf(instance.framework.shaderClass).toEqualTypeOf<PrimaryBaseSamplerShader.AnyConstructor>();
    expect(instance.framework.shaderClass).toBe(createData.framework.shaderClass);
    expect(instanceEmpty.framework.shaderClass).toBe(TokenRingSamplerShader);
  });

  test("DataModel template overrides", () => {
    const defineSchema = DynamicRingData.defineSchema();
    expectTypeOf(defineSchema).toEqualTypeOf<DynamicRingData.Schema>;
    expect(defineSchema.framework).toBeInstanceOf(SchemaField);

    const schema = DynamicRingData.schema;
    expectTypeOf(schema).toEqualTypeOf<SchemaField<DynamicRingData.Schema>>();
    expect(schema).toBeInstanceOf(SchemaField);

    const _schema = DynamicRingData._schema;
    expectTypeOf(_schema).toEqualTypeOf<SchemaField<DynamicRingData.Schema>>();
    expect(_schema).toBeInstanceOf(SchemaField);

    const vJoint = DynamicRingData.validateJoint(createData);
    expectTypeOf(vJoint).toBeVoid();
    expect(vJoint).toBeUndefined();

    const fromSource = DynamicRingData.fromSource(createData, {
      dropInvalidEmbedded: undefined,
      fallback: true,
      parent: null,
      strict: true,
    });
    expectTypeOf(fromSource).toEqualTypeOf<DynamicRingData>();
    expect(fromSource).toBeInstanceOf(DynamicRingData);

    const fromJSON = DynamicRingData.fromJSON(JSON.stringify(createData));
    expectTypeOf(fromJSON).toEqualTypeOf<DynamicRingData>();
    expect(fromJSON).toBeInstanceOf(DynamicRingData);
  });
});

const instance = new DynamicRingData({
  id: "myRingConfig",
  label: "MYSYSTEM.RingConfigs.myRingConfig.label",
  spritesheet: "path/to/spritesheet.json",
  effects: {
    foo: "bar",
  },
  framework: {
    ringClass: TypesTestTokenRing,
    shaderClass: TypesTestTokenRingSamplerShader,
  },
});

expectTypeOf(instance.id).toEqualTypeOf<string | undefined>();
expectTypeOf(instance.label).toEqualTypeOf<string | undefined>();
expectTypeOf(instance.spritesheet).toEqualTypeOf<string | null>();
expectTypeOf(instance.effects).toEqualTypeOf<Record<string, string>>();
expectTypeOf(instance.framework.ringClass).toEqualTypeOf<typeof TokenRing>();
expectTypeOf(instance.framework.shaderClass).toEqualTypeOf<PrimaryBaseSamplerShader.AnyConstructor>();
