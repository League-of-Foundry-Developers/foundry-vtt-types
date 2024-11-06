import { expectTypeOf } from "vitest";

// #2554 Null and undefined for SchemaField and EmbeddedDataField

new foundry.documents.BaseAmbientSound({
  darkness: null,
});

new foundry.documents.BaseAmbientSound({
  darkness: undefined,
});

new foundry.documents.BaseNote({
  texture: null,
});

new foundry.documents.BaseNote({
  texture: undefined,
});

// #2555 NumberField Choices

// @ts-expect-error - A textAnchor cannot be an arbitrary number.
new foundry.documents.BaseNote({ textAnchor: 999 });

// @ts-expect-error - t cannot be an arbitrary string.
new foundry.documents.BaseMeasuredTemplate({ t: "foobar" });

// TypeDataField
declare const JEPCoreTypes: foundry.data.fields.TypeDataField.CoreTypeNames<typeof JournalEntryPage>;
declare const JEPSystemTypes: foundry.data.fields.TypeDataField.SystemTypeNames<typeof JournalEntryPage>;

declare global {
  interface DataModelConfig {
    JournalEntryPage: {
      headquarters: foundry.abstract.TypeDataModel<DataSchema, JournalEntryPage>;
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
expectTypeOf(embeddedModel["schema"]["fields"]["color"]).toEqualTypeOf<
  foundry.data.fields.ColorField<{ label: "LIGHT.Color" }>
>();

declare const embeddedLightField: foundry.data.fields.EmbeddedDataField<typeof foundry.data.LightData>;
expectTypeOf(embeddedLightField.model).toEqualTypeOf<typeof foundry.data.LightData>();

declare const schemaWithLight: foundry.data.fields.SchemaField.InnerInitializedType<{
  light: typeof embeddedLightField;
}>;
expectTypeOf(schemaWithLight.light).toEqualTypeOf<foundry.data.LightData>();

/** EmbeddedCollectionField */

declare const effectsField: foundry.data.fields.EmbeddedCollectionField<
  typeof foundry.documents.BaseActiveEffect,
  Actor.ConfiguredInstance
>;

expectTypeOf(effectsField.hint).toEqualTypeOf<string>();

declare const ElementFieldType: typeof foundry.documents.BaseActiveEffect;
declare const ParentDataModel: Actor.ConfiguredInstance;
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

new foundry.data.fields.StringField({ choices: ["a", "b", "c"] });

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

// Options never contains required elements.
const _emptyOptions = {} satisfies DataField.Options.Default<number>;

// Regression test for issue where label was being constrained to `""`.
// Reported by @FloRadical on Discord, see https://discord.com/channels/732325252788387980/793933527065690184/1268262811063287869.
new foundry.data.fields.BooleanField({
  label: "foo",
});
