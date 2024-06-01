import { expectTypeOf } from "vitest";
import type { ConfiguredDocumentClassForName } from "../../../../src/types/helperTypes.d.mts";

// TypeDataField
declare const JEPCoreTypes: foundry.data.fields.TypeDataField.CoreTypeNames<typeof JournalEntryPage>;
declare const JEPSystemTypes: foundry.data.fields.TypeDataField.SystemTypeNames<typeof JournalEntryPage>;

expectTypeOf(JEPCoreTypes).toEqualTypeOf<"image" | "pdf" | "text" | "video">();
expectTypeOf(JEPSystemTypes).toEqualTypeOf<string>();

declare const effectsField: foundry.data.fields.EmbeddedCollectionField<
  typeof foundry.documents.BaseActiveEffect,
  InstanceType<ConfiguredDocumentClassForName<"Actor">>
>;

expectTypeOf(effectsField.hint).toEqualTypeOf<string>();

declare const ElementFieldType: typeof foundry.documents.BaseActiveEffect;
declare const ParentDataModel: InstanceType<ConfiguredDocumentClassForName<"Actor">>;
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
