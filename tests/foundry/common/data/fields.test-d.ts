import { expectTypeOf } from "vitest";
import type { ConstructorOf } from "../../../../src/types/utils.d.mts";

// TypeDataField
declare const JEPCoreTypes: foundry.data.fields.TypeDataField.CoreTypeNames<typeof JournalEntryPage>;
declare const JEPSystemTypes: foundry.data.fields.TypeDataField.SystemTypeNames<typeof JournalEntryPage>;

expectTypeOf(JEPCoreTypes).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(JEPSystemTypes).toEqualTypeOf<string>();

/** EmbeddedDataField */

declare const embeddedModel: foundry.data.LightData;
declare const embeddedOptions: foundry.data.fields.EmbeddedDataField.Options<typeof embeddedModel>;
declare const embeddedAssignment: foundry.data.fields.EmbeddedDataField.AssignmentType<
  typeof embeddedModel,
  typeof embeddedOptions
>;
declare const embeddedInitialized: foundry.data.fields.EmbeddedDataField.InitializedType<
  typeof embeddedModel,
  typeof embeddedOptions
>;
declare const embeddedPersisted: foundry.data.fields.EmbeddedDataField.PersistedType<
  typeof embeddedModel,
  typeof embeddedOptions
>;

expectTypeOf(embeddedAssignment?.alpha).toEqualTypeOf<number | undefined | null>();
expectTypeOf(embeddedInitialized?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(embeddedPersisted?.alpha).toEqualTypeOf<number | undefined>();
expectTypeOf(embeddedModel["schema"]["fields"]["color"]).toEqualTypeOf<
  foundry.data.fields.ColorField<{ label: "LIGHT.Color" }>
>();

declare const embeddedLightField: foundry.data.fields.EmbeddedDataField<foundry.data.LightData>;
expectTypeOf(embeddedLightField.model).toEqualTypeOf<ConstructorOf<foundry.data.LightData>>();

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
declare const EmbeddedCollectionOptions: foundry.data.fields.EmbeddedCollectionField.DefaultOptions<
  typeof AssignmentElementType
>;
declare const InitializedType: foundry.data.fields.EmbeddedCollectionField.InitializedType<
  typeof AssignmentElementType,
  typeof InitializedElementType,
  typeof ParentDataModel,
  typeof EmbeddedCollectionOptions
>;

expectTypeOf(ElementFieldType.hasTypeData).toEqualTypeOf<boolean>();
expectTypeOf(ParentDataModel.name).toEqualTypeOf<string>();
expectTypeOf(AssignmentElementType.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(InitializedElementType.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(InitializedType.get("", { strict: true })).toEqualTypeOf<ActiveEffect>();
