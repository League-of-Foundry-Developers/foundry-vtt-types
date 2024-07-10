import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import type { NumberField, SchemaField } from "../../../../src/foundry/common/data/fields.d.mts";
import type DataModel from "../../../../src/foundry/common/abstract/data.d.mts";
import type { Merge } from "../../../../src/types/utils.d.mts";
import type { TypeDataModel } from "../../../../src/foundry/common/abstract/type-data.d.mts";

// @ts-expect-error name and type are required
new foundry.documents.BaseActor();

// @ts-expect-error name and type are required
new foundry.documents.BaseActor({});

const baseActor = new foundry.documents.BaseActor({ name: "foo", type: "character" });
expectTypeOf(baseActor.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.effects).toEqualTypeOf<
  EmbeddedCollection<ActiveEffect.ConfiguredInstance, Actor.ConfiguredInstance>
>();
expectTypeOf(baseActor.effects.get("")).toEqualTypeOf<ActiveEffect.ConfiguredInstance | undefined>();
expectTypeOf(baseActor.effects.get("")!.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.items).toEqualTypeOf<EmbeddedCollection<Item.ConfiguredInstance, Actor.ConfiguredInstance>>();
expectTypeOf(baseActor.items.get("")).toEqualTypeOf<Item | undefined>();
expectTypeOf(baseActor.items.get("")!.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(baseActor._source.effects[0]!.duration.seconds).toEqualTypeOf<number | null | undefined>();

/**
 * Data Model Integration
 */

// type MyCharacterSchema = ReturnType<(typeof MyCharacter)["defineSchema"]>;

type MyCharacterSchema = {
  abilities: SchemaField<{
    strength: SchemaField<{
      value: NumberField<{
        required: true;
        nullable: false;
        integer: true;
      }>;
    }>;
    dexterity: SchemaField<{
      value: NumberField<{
        required: true;
        nullable: false;
        integer: true;
      }>;
    }>;
  }>;
};

class MyCharacter extends foundry.abstract.TypeDataModel<MyCharacterSchema, Actor.ConfiguredInstance> {
  static defineSchema() {
    const { SchemaField, NumberField } = foundry.data.fields;
    return {
      abilities: new SchemaField({
        strength: new SchemaField({
          value: new NumberField({
            required: true,
            nullable: false,
            integer: true,
          }),
        }),
        dexterity: new SchemaField({
          value: new NumberField({
            required: true,
            nullable: false,
            integer: true,
          }),
        }),
      }),
    };
  }

  prepareDerivedData(this: Merge<DataModel<MyCharacterSchema, Actor.ConfiguredInstance>, {}>): void {
    this.abilities.strength.value + 2;
    for (const ability of Object.values(this.abilities)) {
      // @ts-expect-error Derived data must be declared
      ability.modifier = (ability.value - 10) / 2;
    }
  }
}

// interface MyCharacter extends foundry.data.fields.SchemaField.InnerInitializedType<MyCharacterSchema> {}

declare const MyCharacterSystem: MyCharacter;

expectTypeOf(MyCharacterSystem.abilities.strength.value).toEqualTypeOf<number>();

type RequiredInteger = { required: true; nullable: false; integer: true };

declare namespace BoilerplateActorBase {
  interface Schema extends DataSchema {
    health: foundry.data.fields.SchemaField<{
      value: foundry.data.fields.NumberField<RequiredInteger>;
      max: foundry.data.fields.NumberField<RequiredInteger>;
    }>;
    power: foundry.data.fields.SchemaField<{
      value: foundry.data.fields.NumberField<RequiredInteger>;
      max: foundry.data.fields.NumberField<RequiredInteger>;
    }>;
    biography: foundry.data.fields.HTMLField;
  }
}

class BoilerplateActorBase<
  Schema extends BoilerplateActorBase.Schema = BoilerplateActorBase.Schema,
  BaseData extends Record<string, unknown> = Record<string, never>,
  DerivedData extends Record<string, unknown> = Record<string, never>,
> extends foundry.abstract.TypeDataModel<Schema, Actor.ConfiguredInstance, BaseData, DerivedData> {
  static defineSchema(): BoilerplateActorBase.Schema {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema: DataSchema = {};

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 }),
    });
    schema.power = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 }),
    });
    schema.biography = new fields.HTMLField();

    return schema as BoilerplateActorBase.Schema;
  }
}

declare global {
  interface CONFIG {
    BOILERPLATE: {
      abilities: Record<string, string>;
      abilityAbbreviations: Record<string, string>;
    };
  }
}

declare namespace BoilerplateCharacter {
  interface Schema extends BoilerplateActorBase.Schema {
    attributes: foundry.data.fields.SchemaField<{
      level: foundry.data.fields.SchemaField<{
        value: foundry.data.fields.NumberField<RequiredInteger>;
      }>;
    }>;
    abilities: foundry.data.fields.SchemaField<{
      strength: foundry.data.fields.SchemaField<{
        value: foundry.data.fields.NumberField<RequiredInteger>;
      }>;
    }>;
    extra: foundry.data.fields.SchemaField<{
      deep: foundry.data.fields.SchemaField<{
        check: foundry.data.fields.SchemaField<{
          propA: foundry.data.fields.StringField<{ required: true }>;
        }>;
      }>;
    }>;
  }

  interface DerivedProps extends Record<string, unknown> {
    abilities: {
      strength: {
        mod: number;
        label: string;
      };
    };
    extra: {
      deep: {
        check: {
          deepDerivedProp: number;
        };

        derived: {
          prop: string;
        };
      };
    };
    derivedString: string;
  }
}

class BoilerplateCharacter extends BoilerplateActorBase<
  BoilerplateCharacter.Schema,
  Record<string, never>,
  BoilerplateCharacter.DerivedProps
> {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.attributes = new fields.SchemaField({
      level: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
      }),
    });

    // Iterate over ability names and create a new SchemaField for each.
    schema.abilities = new fields.SchemaField(
      Object.keys(CONFIG.BOILERPLATE.abilities).reduce((obj: DataSchema, ability) => {
        obj[ability] = new fields.SchemaField({
          value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        });
        return obj;
      }, {}),
    );

    return schema;
  }

  prepareDerivedData(this: TypeDataModel.PrepareDerivedDataThis<this>) {
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (const [key, abil] of Object.entries(this.abilities)) {
      // Calculate the modifier using d20 rules.
      abil.mod = Math.floor((abil.value - 10) / 2);
      // Handle ability label localization.
      abil.label = game.i18n!.localize(CONFIG.BOILERPLATE.abilities[key]) ?? key;
    }

    expectTypeOf(this.extra.deep.check.propA).toEqualTypeOf<string>();
    expectTypeOf(this.extra.deep.check.deepDerivedProp).toEqualTypeOf<number | undefined>();
    expectTypeOf(this.extra.deep.derived?.prop).toEqualTypeOf<string | undefined>();

    expectTypeOf(this.derivedString).toEqualTypeOf<string | undefined>();
  }

  getRollData() {
    const data: Record<string, unknown> = {};

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@str.mod + 4`.
    if (this.abilities) {
      for (const [k, v] of Object.entries(this.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
    data.lvl = this.attributes.level.value;

    return data;
  }
}

declare const boilerplateCharacter: BoilerplateCharacter;

// The class is assumed to have fully gone through initialization.
// Therefore the derived properties are all available.
expectTypeOf(boilerplateCharacter.abilities.strength.mod).toEqualTypeOf<number>();
expectTypeOf(boilerplateCharacter.extra.deep.check.deepDerivedProp).toEqualTypeOf<number>();
expectTypeOf(boilerplateCharacter.extra.deep.derived.prop).toEqualTypeOf<string>();

declare global {
  interface DataModelConfig {
    Actor: {
      character: BoilerplateCharacter;
    };
  }
}

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// shared flags are available
// expectTypeOf(baseActor.getFlag("my-module", "known")).toEqualTypeOf<boolean>();
// // non shared flags are not available
// expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// expectTypeOf(baseActor.getFlag("my-module", "hidden-name")).toEqualTypeOf<never>();
// // non shared flags are also not available if the type is known
// if (baseActor._source.type === "character") {
//   expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// }
// if (baseActor.type === "character") {
//   expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
// }
// expectTypeOf(baseActor.documentName).toEqualTypeOf<"Actor">();
