import { expectTypeOf } from "vitest";
import DataField = foundry.data.fields.DataField;

type DataSchema = foundry.data.fields.DataSchema;

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

// @ts-expect-error - A textAnchor cannot be an arbitrary number.
await foundry.documents.BaseNote.create({ textAnchor: 999 });
// Should be correct
await foundry.documents.BaseNote.create({ textAnchor: 2 });

// @ts-expect-error - t cannot be an arbitrary string.
await foundry.documents.BaseMeasuredTemplate.create({ t: "foobar" });

// Flags
declare const myEffect: ActiveEffect;
// @ts-expect-error Invalid flag in the space
myEffect.getFlag("core", "foobar");
// All documents have a sheetClass flag
expectTypeOf(myEffect.getFlag("core", "sheetClass")).toEqualTypeOf<string | undefined>();
expectTypeOf(myEffect.flags.core!.sheetClass!).toEqualTypeOf<string>();
// Document-specific flag
expectTypeOf(myEffect.getFlag("core", "overlay")).toEqualTypeOf<boolean | undefined>();
expectTypeOf(myEffect.flags.core!.overlay!).toEqualTypeOf<boolean>();

// TypeDataField
declare const JEPCoreTypes: JournalEntryPage.SubType;
declare const JEPSystemTypes: Game.Model.TypeNames<"JournalEntryPage">;

declare global {
  interface DataModelConfig {
    JournalEntryPage: {
      headquarters: typeof foundry.abstract.TypeDataModel<DataSchema, JournalEntryPage>;
    };
  }
}

expectTypeOf(JEPCoreTypes).toEqualTypeOf<"base" | "image" | "pdf" | "text" | "video">();
expectTypeOf(JEPSystemTypes).toEqualTypeOf<"headquarters">();

declare const myJournalEntryPage: JournalEntryPage;
if (myJournalEntryPage.system instanceof foundry.abstract.TypeDataModel) {
  expectTypeOf(myJournalEntryPage.system?.prepareBaseData()).toEqualTypeOf<void>();
}

/** EmbeddedDataField */

declare const embeddedModel: typeof foundry.data.LightData;
declare type embeddedOptions = foundry.data.fields.EmbeddedDataField.Options<typeof embeddedModel>;
declare const embeddedAssignment: foundry.data.fields.EmbeddedDataField.AssignmentType<
  typeof embeddedModel,
  embeddedOptions
>;
declare const embeddedInitialized: foundry.data.fields.EmbeddedDataField.InitializedType<
  typeof embeddedModel,
  embeddedOptions
>;
declare const embeddedPersisted: foundry.data.fields.EmbeddedDataField.PersistedType<
  typeof embeddedModel,
  embeddedOptions
>;

expectTypeOf(embeddedAssignment?.alpha).toEqualTypeOf<number | undefined | null>();
expectTypeOf(embeddedInitialized?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(embeddedPersisted?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(embeddedModel.schema.fields.color).toEqualTypeOf<
  foundry.data.fields.ColorField<{ label: "LIGHT.Color" }>
>();

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
declare type EmbeddedCollectionOptions = foundry.data.fields.EmbeddedCollectionField.DefaultOptions<
  typeof AssignmentElementType
>;
declare const InitializedType: foundry.data.fields.EmbeddedCollectionField.InitializedType<
  typeof AssignmentElementType,
  typeof InitializedElementType,
  typeof ParentDataModel,
  EmbeddedCollectionOptions
>;

expectTypeOf(ElementFieldType.hasTypeData).toEqualTypeOf<boolean>();
expectTypeOf(ParentDataModel.name).toEqualTypeOf<string>();
expectTypeOf(AssignmentElementType.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(InitializedElementType.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(InitializedType.get("", { strict: true })).toEqualTypeOf<ActiveEffect>();

const stringField = new foundry.data.fields.StringField();

const withChoices = new foundry.data.fields.StringField({ choices: ["a", "b", "c"] });

// @ts-expect-error - A string field is not `nullable` by default and validate does not accept null.
stringField.validate(null);

// A string field can effectively cast anything. It's a very unsound method.
stringField["_cast"](null);

// `null` gets handled by `DataField.clean` and gets turned into `undefined` and then the default initial value.
stringField.clean(null);

stringField.initialize(null);

// @ts-expect-error - Options cannot accept null.
type _NullOptions = DataField.Options<null>;

// @ts-expect-error - Options cannot accept undefined.
type _UndefinedOptions = DataField.Options<undefined>;

// Regression test for issue where label was being constrained to `""`.
// Reported by @FloRadical on Discord, see https://discord.com/channels/732325252788387980/793933527065690184/1268262811063287869.
new foundry.data.fields.BooleanField({
  label: "foo",
});

stringField.toInput({ value: "foo" });

// @ts-expect-error values passed to `toInput` MUST be valid for the field
stringField.toInput({ value: 200 });

// Inputs generated from a StringField should accept additional config properties for possible use in `createSelectInput`.
stringField.toInput({ blank: "blank option", choices: ["option1"] });
stringField.toInput({ blank: "blank option", options: [{ value: "option2", label: "Option 2" }] });

// @ts-expect-error - `blank` is not valid by itself when the field doesn't have choices set.
stringField.toInput({ blank: "blank option" });

// Because this `StringField` has options it doesn't need to be passed in to `toInput` anymore.
withChoices.toInput({ blank: "blank option" });
