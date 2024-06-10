import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import type { Merge } from "../../../../src/types/utils.d.mts";

// @ts-expect-error name and type are required
new foundry.documents.BaseActor();

// @ts-expect-error name and type are required
new foundry.documents.BaseActor({});

const baseActor = new foundry.documents.BaseActor({ name: "foo", type: "base" });
expectTypeOf(baseActor.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.effects).toEqualTypeOf<EmbeddedCollection<ActiveEffect, Actor>>();
expectTypeOf(baseActor.effects.get("")).toEqualTypeOf<ActiveEffect | undefined>();
expectTypeOf(baseActor.effects.get("")!.name).toEqualTypeOf<string>();
expectTypeOf(baseActor.items).toEqualTypeOf<EmbeddedCollection<Item, Actor>>();
expectTypeOf(baseActor.items.get("")).toEqualTypeOf<Item | undefined>();
expectTypeOf(baseActor.items.get("")!.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(baseActor._source.effects[0]!).toEqualTypeOf<foundry.documents.BaseActiveEffect.ConstructorData>();
expectTypeOf(baseActor._source.effects[0]!.duration.seconds).toEqualTypeOf<number | null | undefined>();

/**
 * Data Model Integration
 */

type MyCharacterSchema = ReturnType<(typeof MyCharacter)["defineSchema"]>;

interface MyCharacter extends foundry.data.fields.SchemaField.InnerInitializedType<MyCharacterSchema> {}

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

  prepareDerivedData(): void {
    this.abilities.strength.value + 2;
    for (const ability of Object.values(this.abilities)) {
      ability.modifier = (ability.value - 10) / 2;
    }
  }
}

declare const MyCharacterSystem: MyCharacter;

expectTypeOf(MyCharacterSystem.abilities.strength.value).toEqualTypeOf<number>();

type RequiredInteger = { required: true; nullable: false; integer: true };

interface BoilerplateActorBaseSchema extends DataSchema {
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

class BoilerplateActorBase<Schema extends BoilerplateActorBaseSchema = BoilerplateActorBaseSchema> extends foundry
  .abstract.TypeDataModel<Schema, Actor.ConfiguredInstance> {
  static defineSchema(): BoilerplateActorBaseSchema {
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

    return schema as BoilerplateActorBaseSchema;
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

interface BoilerplateCharacterSchema extends BoilerplateActorBaseSchema {
  attributes: foundry.data.fields.SchemaField<{
    level: foundry.data.fields.SchemaField<{
      value: foundry.data.fields.NumberField<RequiredInteger>;
    }>;
  }>;
  abilities: foundry.data.fields.SchemaField<{
    strength: foundry.data.fields.SchemaField<{
      value: foundry.data.fields.NumberField<{}>;
    }>;
  }>;
}

interface BoilerplateCharacter
  extends Merge<
    foundry.data.fields.SchemaField.InnerInitializedType<BoilerplateCharacterSchema>,
    {
      abilities: {
        strength: {
          mod?: number;
          label?: string;
        };
      };
    }
  > {}

class BoilerplateCharacter extends BoilerplateActorBase<BoilerplateCharacterSchema> {
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

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.

    for (const [key, abil] of Object.entries(this.abilities)) {
      // Calculate the modifier using d20 rules.
      abil.mod = Math.floor((abil.value - 10) / 2);
      // Handle ability label localization.
      abil.label = (game as Game).i18n.localize(CONFIG.BOILERPLATE.abilities[key]) ?? key;
    }
  }

  getRollData() {
    const data: object = {};

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

// interface CharacterFlags {
//   "my-module": {
//     known: boolean;
//     xp: number;
//   };
// }

// interface CharacterDataSource {
//   type: "character";
//   data: CharacterDataSourceData;
//   flags: CharacterFlags;
// }

// interface CharacterDataPropertiesData extends CharacterDataSourceData {
//   movement: number;
// }

// interface CharacterDataProperties {
//   type: "character";
//   data: CharacterDataPropertiesData;
//   flags: CharacterFlags;
// }

// interface NPCDataSourceData {
//   challenge: number;
//   faction: string;
// }

// interface NPCFlags {
//   "my-module": {
//     "hidden-name": string;
//     known: boolean;
//   };
// }

// interface NPCDataSource {
//   type: "npc";
//   data: NPCDataSourceData;
//   flags: NPCFlags;
// }

// interface NPCDataPropertiesData extends NPCDataSourceData {
//   damage: number;
// }

// interface NPCDataProperties {
//   type: "npc";
//   data: NPCDataPropertiesData;
//   flags: NPCFlags;
// }

// type MyActorDataSource = CharacterDataSource | NPCDataSource;
// type MyActorDataProperties = CharacterDataProperties | NPCDataProperties;

declare global {
  // interface DataConfig {
  //   Actor: MyActorDataProperties;
  // }

  interface DataModelConfig {
    character: BoilerplateCharacter;
  }

  // interface SourceConfig {
  //   Actor: MyActorDataSource;
  // }
}

// expectTypeOf(baseActor.type).toEqualTypeOf<"character" | "npc">();
// expectTypeOf(baseActor.items.get("", { strict: true }).parent).toEqualTypeOf<Actor | null>();

// if (baseActor._source.type === "character") {
//   expectTypeOf(baseActor._source.health).toEqualTypeOf<number>();

//   // @ts-expect-error "movement" is not a valid property of CharacterDataSourceData.
//   baseActor._source.movement;
// } else {
//   expectTypeOf(baseActor._source.faction).toEqualTypeOf<string>();
//   expectTypeOf(baseActor._source.challenge).toEqualTypeOf<number>();

//   // @ts-expect-error "damage" is not a valid property of NPCDataSourceData.
//   baseActor._source.damage;
// }

// if (baseActor.type === "character") {
//   expectTypeOf(baseActor.system.health).toEqualTypeOf<number>();
//   expectTypeOf(baseActor.system.movement).toEqualTypeOf<number>();
// } else {
//   expectTypeOf(baseActor.system.faction).toEqualTypeOf<string>();
//   expectTypeOf(baseActor.system.challenge).toEqualTypeOf<number>();
//   expectTypeOf(baseActor.system.damage).toEqualTypeOf<number>();
// }

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags for actors and items via FlagConfig please have a look into baseItem.test-d.ts.
// shared flags are available
expectTypeOf(baseActor.getFlag("my-module", "known")).toEqualTypeOf<boolean>();
// non shared flags are not available
expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
expectTypeOf(baseActor.getFlag("my-module", "hidden-name")).toEqualTypeOf<never>();
// non shared flags are also not available if the type is known
if (baseActor._source.type === "character") {
  expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
}
if (baseActor.type === "character") {
  expectTypeOf(baseActor.getFlag("my-module", "xp")).toEqualTypeOf<never>();
}
expectTypeOf(baseActor.documentName).toEqualTypeOf<"Actor">();
