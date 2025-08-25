import { expectTypeOf, test } from "vitest";

import DataField = foundry.data.fields.DataField;
import fields = foundry.data.fields;

type DataSchema = fields.DataSchema;

// #2554 Null and undefined for SchemaField and EmbeddedDataField

await foundry.documents.BaseAmbientSound.create({
  darkness: null,
});

await foundry.documents.BaseAmbientSound.create({
  darkness: undefined,
});

await foundry.documents.BaseNote.create({
  texture: null,
});

await foundry.documents.BaseNote.create({
  texture: undefined,
});

// #2555 NumberField Choices

// @ts-expect-error A textAnchor cannot be an arbitrary number.
await foundry.documents.BaseNote.create({ textAnchor: 999 });
// Should be correct
await foundry.documents.BaseNote.create({ textAnchor: CONST.TEXT_ANCHOR_POINTS.BOTTOM });

// @ts-expect-error t cannot be an arbitrary string.
await foundry.documents.BaseMeasuredTemplate.create({ t: "foobar" });

// Flags
declare const myEffect: ActiveEffect.Implementation;
// @ts-expect-error Invalid flag in the space
myEffect.getFlag("core", "foobar");
// All documents have a sheetClass flag
expectTypeOf(myEffect.getFlag("core", "sheetClass")).toEqualTypeOf<string | undefined>();
expectTypeOf(myEffect.flags.core!.sheetClass).toEqualTypeOf<string | undefined>();
// Document-specific flag
expectTypeOf(myEffect.getFlag("core", "overlay")).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myEffect.flags.core!.overlay).toEqualTypeOf<boolean | undefined>();

// TypeDataField
declare const JEPCoreTypes: JournalEntryPage.SubType;
declare const JEPSystemTypes: Game.Model.TypeNames<"JournalEntryPage">;

// Note(LukeAbby): Inlining this causes some circularities.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class HeadquartersModel extends foundry.abstract.TypeDataModel<DataSchema, JournalEntryPage.Implementation> {}

declare module "fvtt-types/configuration" {
  interface DataModelConfig {
    JournalEntryPage: {
      headquarters: typeof HeadquartersModel;
    };
  }
}

expectTypeOf(JEPCoreTypes).toEqualTypeOf<
  "image" | "pdf" | "text" | "video" | "headquarters" | foundry.abstract.Document.ModuleSubType
>();
expectTypeOf(JEPSystemTypes).toEqualTypeOf<
  "image" | "pdf" | "text" | "video" | "headquarters" | foundry.abstract.Document.ModuleSubType
>();

declare const myJournalEntryPage: JournalEntryPage.Implementation;
if (myJournalEntryPage.system instanceof foundry.abstract.TypeDataModel) {
  myJournalEntryPage.system?.prepareBaseData();
}

/** EmbeddedDataField */

type EmbeddedModel = typeof foundry.data.LightData;
declare type embeddedOptions = foundry.data.fields.EmbeddedDataField.Options<EmbeddedModel>;
// eslint-disable-next-line @typescript-eslint/no-deprecated
declare const embeddedAssignment: foundry.data.fields.EmbeddedDataField.AssignmentType<EmbeddedModel, embeddedOptions>;
declare const embeddedInitialized: foundry.data.fields.EmbeddedDataField.InitializedType<
  EmbeddedModel,
  embeddedOptions
>;
declare const embeddedPersisted: foundry.data.fields.EmbeddedDataField.PersistedType<EmbeddedModel, embeddedOptions>;

declare const lightModel: foundry.data.LightData;

expectTypeOf(embeddedAssignment?.alpha).toEqualTypeOf<number | undefined | null>();
expectTypeOf(embeddedInitialized?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(embeddedPersisted?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(lightModel.schema.fields.color).toEqualTypeOf<foundry.data.fields.ColorField>();

declare const embeddedLightField: foundry.data.fields.EmbeddedDataField<typeof foundry.data.LightData>;
expectTypeOf(embeddedLightField.model).toEqualTypeOf<typeof foundry.data.LightData>();

declare const schemaWithLight: foundry.data.fields.SchemaField.InitializedData<{
  light: typeof embeddedLightField;
}>;
expectTypeOf(schemaWithLight.light).toEqualTypeOf<foundry.data.LightData>();

/** EmbeddedCollectionField */

declare const effectsField: foundry.data.fields.EmbeddedCollectionField<
  typeof foundry.documents.BaseActiveEffect,
  Actor.Implementation
>;

expectTypeOf(effectsField.hint).toEqualTypeOf<string>();

declare const ElementFieldType: typeof foundry.documents.BaseActiveEffect;
declare const ParentDataModel: Actor.Implementation;
declare const AssignmentElementType: foundry.data.fields.EmbeddedCollectionField.InitializedElementType<
  typeof ElementFieldType
>;
declare const InitializedElementType: foundry.data.fields.EmbeddedCollectionField.InitializedElementType<
  typeof ElementFieldType
>;
declare type EmbeddedCollectionOptions = foundry.data.fields.EmbeddedCollectionField.DefaultOptions;
declare const InitializedType: foundry.data.fields.EmbeddedCollectionField.InitializedType<
  typeof AssignmentElementType,
  typeof InitializedElementType,
  typeof ParentDataModel,
  EmbeddedCollectionOptions
>;

expectTypeOf(ElementFieldType.hasTypeData).toEqualTypeOf<true>();
expectTypeOf(ParentDataModel.name).toEqualTypeOf<string>();
expectTypeOf(AssignmentElementType.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(InitializedElementType.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(InitializedType.get("", { strict: true })).toEqualTypeOf<ActiveEffect.Implementation>();

const stringField = new foundry.data.fields.StringField();

const withChoices = new foundry.data.fields.StringField({ choices: ["a", "b", "c"] });

stringField.validate(null);

// A string field can effectively cast anything. It's a very unsound method.
stringField["_cast"](null);

// `null` gets handled by `DataField.clean` and gets turned into `undefined` and then the default initial value.
stringField.clean(null);

stringField.initialize("", new Actor.implementation({ type: "base", name: "Test Actor" }));

type _NullOptions = DataField.Options<null>;
type _UndefinedOptions = DataField.Options<undefined>;

// Regression test for issue where label was being constrained to `""`.
// Reported by @FloRadical on Discord, see https://discord.com/channels/732325252788387980/793933527065690184/1268262811063287869.
test("BooleanField options.label regression test", () => {
  new foundry.data.fields.BooleanField({
    label: "foo",
  });
});

stringField.toInput({ value: "foo" });

// @ts-expect-error values passed to `toInput` MUST be valid for the field
stringField.toInput({ value: 200 });

// Inputs generated from a StringField should accept additional config properties for possible use in `createSelectInput`.
stringField.toInput({ blank: "blank option", choices: ["option1"] });
stringField.toInput({ blank: "blank option", options: [{ value: "option2", label: "Option 2" }] });

// @ts-expect-error `blank` is not valid by itself when the field doesn't have choices set.
stringField.toInput({ blank: "blank option" });

// Because this `StringField` has options it doesn't need to be passed in to `toInput` anymore.
withChoices.toInput({ blank: "blank option" });

// Regression test for a "type instantation is excessively deep" error reported by @Eon.
// Reduction case: https://tsplay.dev/W4964w
test("circular data model heritage regression test", () => {
  class EmbeddedModel extends foundry.abstract.DataModel<any, MyActorSystem> {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schema = {
    test: new foundry.data.fields.EmbeddedDataField(EmbeddedModel),
  };

  class MyActorSystem extends foundry.abstract.TypeDataModel<typeof schema, Actor.Implementation> {}
});

test("choices", () => {
  const schema = () => ({
    choices: new foundry.data.fields.StringField({ choices: ["a", "b"] }),
  });

  class StringModel extends foundry.abstract.DataModel<ReturnType<typeof schema>> {
    static override defineSchema() {
      return schema();
    }
  }

  // @ts-expect-error `blank` is `false` by default when `choices` is set.
  new StringModel({ choices: "" });

  const model = new StringModel({ choices: "a" });
  expectTypeOf(model.choices).toEqualTypeOf<"a" | "b" | undefined>();
});

test("blank choices", () => {
  const schema = () => ({
    blankChoices: new foundry.data.fields.StringField({ blank: true, choices: ["a", "b"] }),
  });

  class BlankModel extends foundry.abstract.DataModel<ReturnType<typeof schema>> {
    static override defineSchema() {
      return schema();
    }
  }

  new BlankModel({ blankChoices: "a" });

  const model = new BlankModel({ blankChoices: "" });
  expectTypeOf(model.blankChoices).toEqualTypeOf<"a" | "b" | "" | undefined>();
});

test("nullable SchemaField", () => {
  const schema = () => ({
    data: new foundry.data.fields.SchemaField(
      {
        max: new foundry.data.fields.StringField({ required: true }),
        value: new foundry.data.fields.StringField({ required: true }),
        editable: new foundry.data.fields.BooleanField({ required: true }),
      },
      { nullable: true },
    ),
  });

  class NullableSchema extends foundry.abstract.DataModel<ReturnType<typeof schema>> {
    static override defineSchema() {
      return schema();
    }
  }

  new NullableSchema({ data: undefined });

  const nullableSchema = new NullableSchema({ data: null });

  expectTypeOf(nullableSchema.data).toEqualTypeOf<{ max: string; value: string; editable: boolean } | null>();
});

// TODO(LukeAbby): Relevant once requisite circularities are fixed.
// type ActorSchema = foundry.data.fields.SchemaField<Actor.Schema>;

// declare const actorSchema: ActorSchema;

// test("SchemaField#getField", () => {
//   expectTypeOf(actorSchema.getField("")).toEqualTypeOf<ActorSchema>();
//   expectTypeOf(actorSchema.getField([])).toEqualTypeOf<ActorSchema>();
//   expectTypeOf(actorSchema.getField("effects.element._id")).toEqualTypeOf<fields.DocumentIdField>();

//   expectTypeOf(actorSchema.getField(["items"])).toEqualTypeOf<
//     fields.EmbeddedCollectionField<typeof foundry.documents.BaseItem, Actor.Implementation>
//   >();

//   expectTypeOf(actorSchema.getField(["items", "element"])).toEqualTypeOf<SchemaField<Item._Schema>>();

//   expectTypeOf(actorSchema.getField(["items", "element", "effects"])).toEqualTypeOf<
//     fields.EmbeddedCollectionField<typeof foundry.documents.BaseActiveEffect, Actor.Implementation>
//   >();

//   expectTypeOf(actorSchema.getField(["items", "element", "effects", "element"])).toEqualTypeOf<
//     SchemaField<ActiveEffect._Schema>
//   >();

//   expectTypeOf(actorSchema.getField(["items", "element", "effects", "element", "description"])).toEqualTypeOf<
//     ActiveEffect.Schema["description"]
//   >();

//   expectTypeOf(actorSchema.getField("items")).toEqualTypeOf<
//     fields.EmbeddedCollectionField<typeof foundry.documents.BaseItem, Actor.Implementation>
//   >();

//   expectTypeOf(actorSchema.getField("items.element")).toEqualTypeOf<SchemaField<Item._Schema>>();

//   expectTypeOf(actorSchema.getField("items.element.effects")).toEqualTypeOf<
//     fields.EmbeddedCollectionField<typeof foundry.documents.BaseActiveEffect, Actor.Implementation>
//   >();

//   expectTypeOf(actorSchema.getField("items.element.effects.element")).toEqualTypeOf<
//     SchemaField<ActiveEffect._Schema>
//   >();

//   expectTypeOf(actorSchema.getField("items.element.effects.element.description")).toEqualTypeOf<
//     ActiveEffect.Schema["description"]
//   >();
// });

// const simplestSchema = {
//   foo: new fields.NumberField({ initial: 5 }),
// } satisfies DataSchema;

// const schemaFieldsSchema = {
//   default: new fields.SchemaField(simplestSchema),
//   optional: new fields.SchemaField(simplestSchema, { required: false }),
//   required: new fields.SchemaField(simplestSchema, { required: true }),
//   nullable: new fields.SchemaField(simplestSchema, { nullable: true }),
//   nonNullable: new fields.SchemaField(simplestSchema, { nullable: false }),
//   optionalAndNullable: new fields.SchemaField(simplestSchema, { required: false, nullable: true }),
//   requiredAndNonNullable: new fields.SchemaField(simplestSchema, { required: true, nullable: false }),
// } satisfies DataSchema;

// const booleanFieldsSchema = {
//   default: new fields.BooleanField(),
//   optional: new fields.BooleanField({ required: false }),
//   required: new fields.BooleanField({ required: true }),
//   nullable: new fields.BooleanField({ nullable: true }),
//   nonNullable: new fields.BooleanField({ nullable: false }),
//   optionalAndNullable: new fields.BooleanField({ required: false, nullable: true }),
//   requiredAndNonNullable: new fields.BooleanField({ required: true, nullable: false }),
// } satisfies DataSchema;

// const numberFieldsSchema = {
//   default: new fields.NumberField(),
//   optional: new fields.NumberField({ required: false }),
//   required: new fields.NumberField({ required: true }),
//   nullable: new fields.NumberField({ nullable: true }),
//   nonNullable: new fields.NumberField({ nullable: false }),
//   optionalAndNullable: new fields.NumberField({ required: false, nullable: true }),
//   requiredAndNonNullable: new fields.NumberField({ required: true, nullable: false }),
// } satisfies DataSchema;

// const stringFieldsSchema = {
//   default: new fields.StringField(),
//   optional: new fields.StringField({ required: false }),
//   required: new fields.StringField({ required: true }),
//   nullable: new fields.StringField({ nullable: true }),
//   nonNullable: new fields.StringField({ nullable: false }),
//   optionalAndNullable: new fields.StringField({ required: false, nullable: true }),
//   requiredAndNonNullable: new fields.StringField({ required: true, nullable: false }),
// } satisfies DataSchema;

// const objectFieldsSchema = {
//   default: new fields.ObjectField(),
//   optional: new fields.ObjectField({ required: false }),
//   required: new fields.ObjectField({ required: true }),
//   nullable: new fields.ObjectField({ nullable: true }),
//   nonNullable: new fields.ObjectField({ nullable: false }),
//   optionalAndNullable: new fields.ObjectField({ required: false, nullable: true }),
//   requiredAndNonNullable: new fields.ObjectField({ required: true, nullable: false }),
// } satisfies DataSchema;

// const typedObjectFieldsSchema = {
//   default: new fields.TypedObjectField(new fields.BooleanField()),
//   optional: new fields.TypedObjectField(new fields.BooleanField(), { required: false }),
//   required: new fields.TypedObjectField(new fields.BooleanField(), { required: true }),
//   nullable: new fields.TypedObjectField(new fields.BooleanField(), { nullable: true }),
//   nonNullable: new fields.TypedObjectField(new fields.BooleanField(), { nullable: false }),
//   optionalAndNullable: new fields.TypedObjectField(new fields.BooleanField(), { required: false, nullable: true }),
//   requiredAndNonNullable: new fields.TypedObjectField(new fields.BooleanField(), { required: true, nullable: false }),
// } satisfies DataSchema;

// const arrayFieldsSchema = {
//   default: new fields.ArrayField(new fields.BooleanField()),
//   optional: new fields.ArrayField(new fields.BooleanField(), { required: false }),
//   required: new fields.ArrayField(new fields.BooleanField(), { required: true }),
//   nullable: new fields.ArrayField(new fields.BooleanField(), { nullable: true }),
//   nonNullable: new fields.ArrayField(new fields.BooleanField(), { nullable: false }),
//   optionalAndNullable: new fields.ArrayField(new fields.BooleanField(), { required: false, nullable: true }),
//   requiredAndNonNullable: new fields.ArrayField(new fields.BooleanField(), { required: true, nullable: false }),
// } satisfies DataSchema;

// const setFieldsSchema = {
//   default: new fields.SetField(new fields.StringField()),
//   optional: new fields.SetField(new fields.StringField(), { required: false }),
//   required: new fields.SetField(new fields.StringField(), { required: true }),
//   nullable: new fields.SetField(new fields.StringField(), { nullable: true }),
//   nonNullable: new fields.SetField(new fields.StringField(), { nullable: false }),
//   optionalAndNullable: new fields.SetField(new fields.StringField(), { required: false, nullable: true }),
//   requiredAndNonNullable: new fields.SetField(new fields.StringField(), { required: true, nullable: false }),
// } satisfies DataSchema;

// const oneOfEverythingSchema = {
//   schemaFields: new fields.SchemaField(schemaFieldsSchema),
//   booleanFields: new fields.SchemaField(booleanFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   stringFields: new fields.SchemaField(stringFieldsSchema),
//   objectFields: new fields.SchemaField(objectFieldsSchema),
//   typedObjectFields: new fields.SchemaField(typedObjectFieldsSchema),
//   arrayFields: new fields.SchemaField(arrayFieldsSchema),
//   setFields: new fields.SchemaField(setFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
//   numberFields: new fields.SchemaField(numberFieldsSchema),
// } satisfies DataSchema;

// class OneOfEverything extends foundry.abstract.DataModel<typeof oneOfEverythingSchema> {
//   static override defineSchema() {
//     return oneOfEverythingSchema;
//   }
// }
