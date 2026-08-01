import { expectTypeOf } from "vitest";
import ActiveEffectTypeDataModel = foundry.data.ActiveEffectTypeDataModel;

declare const model: ActiveEffectTypeDataModel;

expectTypeOf(ActiveEffectTypeDataModel.defineSchema()).toEqualTypeOf<ActiveEffectTypeDataModel.Schema>();

expectTypeOf(model.changes).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<ActiveEffectTypeDataModel.ChangeSchema>[]
>();

const change = model.changes[0]!;
expectTypeOf(change.key).toBeString();
expectTypeOf(change.type).toBeString();
expectTypeOf(change.value).toEqualTypeOf<unknown>();
expectTypeOf(change.phase).toBeString();
expectTypeOf(change.priority).toEqualTypeOf<number | null | undefined>();

// Foundry registers this model for the `base` subtype, so `system.changes` is available without any
// `DataModelConfig` declaration merging on the consumer's part.
declare const baseEffect: ActiveEffect.OfType<"base">;
expectTypeOf(baseEffect.system).toEqualTypeOf<ActiveEffectTypeDataModel>();
expectTypeOf(baseEffect.system.changes).toEqualTypeOf<typeof model.changes>();

// ...and it is what `CONFIG.ActiveEffect.dataModels.base` is typed as. The config entry carries the
// class' construct signature pinned at its default `Schema` (see `ActiveEffect.CoreTypes`), so compare
// at the instance level rather than against the raw generic constructor.
expectTypeOf(new CONFIG.ActiveEffect.dataModels.base()).toEqualTypeOf<ActiveEffectTypeDataModel>();
expectTypeOf(CONFIG.ActiveEffect.dataModels.base.defineSchema()).toEqualTypeOf<ActiveEffectTypeDataModel.Schema>();

interface ExtraChangeSchema extends ActiveEffectTypeDataModel.MinimalChangeSchema {
  label: foundry.data.fields.StringField;
}

interface ConformingSchema extends ActiveEffectTypeDataModel.MinimalSchema {
  changes: foundry.data.fields.ArrayField<foundry.data.fields.SchemaField<ExtraChangeSchema>>;
  enabled: foundry.data.fields.BooleanField;
}

declare class _ConformingModel extends ActiveEffectTypeDataModel<ConformingSchema> {}

interface MissingPhaseChangeSchema extends foundry.data.fields.DataSchema {
  type: foundry.data.fields.StringField;
  priority: foundry.data.fields.NumberField;
}

interface MissingPhaseSchema extends foundry.data.fields.DataSchema {
  changes: foundry.data.fields.ArrayField<foundry.data.fields.SchemaField<MissingPhaseChangeSchema>>;
}

// @ts-expect-error ActiveEffect changes must define `phase`.
declare class _MissingPhaseModel extends ActiveEffectTypeDataModel<MissingPhaseSchema> {}

interface MissingPriorityChangeSchema extends foundry.data.fields.DataSchema {
  type: foundry.data.fields.StringField;
  phase: foundry.data.fields.StringField;
}

interface MissingPrioritySchema extends foundry.data.fields.DataSchema {
  changes: foundry.data.fields.ArrayField<foundry.data.fields.SchemaField<MissingPriorityChangeSchema>>;
}

// @ts-expect-error ActiveEffect changes must define `priority`.
declare class _MissingPriorityModel extends ActiveEffectTypeDataModel<MissingPrioritySchema> {}

interface MissingChangesSchema extends foundry.data.fields.DataSchema {
  enabled: foundry.data.fields.BooleanField;
}

// @ts-expect-error ActiveEffect models must define `changes`.
declare class _MissingChangesModel extends ActiveEffectTypeDataModel<MissingChangesSchema> {}

interface TypedChangeSchema extends ActiveEffectTypeDataModel.MinimalChangeSchema {
  value: foundry.data.fields.StringField;
}

interface TypedChanges {
  [type: string]: foundry.data.fields.SchemaField<TypedChangeSchema>;
  custom: foundry.data.fields.SchemaField<TypedChangeSchema>;
}

interface TypedSchema extends ActiveEffectTypeDataModel.MinimalSchema {
  changes: foundry.data.fields.ArrayField<foundry.data.fields.TypedSchemaField<TypedChanges>>;
}

declare class _TypedModel extends ActiveEffectTypeDataModel<TypedSchema> {}

declare class _ConformingRegistrableModel extends foundry.abstract.TypeDataModel<
  ConformingSchema,
  ActiveEffect.Implementation
> {
  static override defineSchema(): ConformingSchema;
}

declare class _TypedRegistrableModel extends foundry.abstract.TypeDataModel<TypedSchema, ActiveEffect.Implementation> {
  static override defineSchema(): TypedSchema;
}

declare class _NonConformingModel extends foundry.abstract.TypeDataModel<
  MissingPhaseSchema,
  ActiveEffect.Implementation
> {
  static override defineSchema(): MissingPhaseSchema;
}

expectTypeOf<typeof _ConformingRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _TypedRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _NonConformingModel>().not.toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
