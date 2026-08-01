import { expectTypeOf } from "vitest";

import ActiveEffectTypeDataModel = foundry.data.ActiveEffectTypeDataModel;
import Document = foundry.abstract.Document;
import fields = foundry.data.fields;

declare const model: ActiveEffectTypeDataModel;

expectTypeOf(ActiveEffectTypeDataModel.defineSchema()).toEqualTypeOf<ActiveEffectTypeDataModel.Schema>();

expectTypeOf(model.changes).toEqualTypeOf<
  fields.SchemaField.InitializedData<ActiveEffectTypeDataModel.ChangeSchema>[]
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
  label: fields.StringField;
}

interface ConformingSchema extends ActiveEffectTypeDataModel.MinimalSchema {
  changes: fields.ArrayField<fields.SchemaField<ExtraChangeSchema>>;
  enabled: fields.BooleanField;
}

declare class _ConformingModel extends ActiveEffectTypeDataModel<ConformingSchema> {}

interface MissingPhaseChangeSchema extends fields.DataSchema {
  type: fields.StringField;
  priority: fields.NumberField;
}

interface MissingPhaseSchema extends fields.DataSchema {
  changes: fields.ArrayField<fields.SchemaField<MissingPhaseChangeSchema>>;
}

// @ts-expect-error ActiveEffect changes must define `phase`.
declare class _MissingPhaseModel extends ActiveEffectTypeDataModel<MissingPhaseSchema> {}

interface MissingPriorityChangeSchema extends fields.DataSchema {
  type: fields.StringField;
  phase: fields.StringField;
}

interface MissingPrioritySchema extends fields.DataSchema {
  changes: fields.ArrayField<fields.SchemaField<MissingPriorityChangeSchema>>;
}

// @ts-expect-error ActiveEffect changes must define `priority`.
declare class _MissingPriorityModel extends ActiveEffectTypeDataModel<MissingPrioritySchema> {}

interface MissingChangesSchema extends fields.DataSchema {
  enabled: fields.BooleanField;
}

// @ts-expect-error ActiveEffect models must define `changes`.
declare class _MissingChangesModel extends ActiveEffectTypeDataModel<MissingChangesSchema> {}

interface TypedChangeSchema extends ActiveEffectTypeDataModel.MinimalChangeSchema {
  value: fields.StringField;
}

interface TypedChanges {
  [type: string]: fields.SchemaField<TypedChangeSchema>;
  custom: fields.SchemaField<TypedChangeSchema>;
}

interface TypedSchema extends ActiveEffectTypeDataModel.MinimalSchema {
  changes: fields.ArrayField<fields.TypedSchemaField<TypedChanges>>;
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

declare class _CompatibilityModel extends foundry.abstract.TypeDataModel<
  MissingChangesSchema,
  ActiveEffect.Implementation
> {
  static override defineSchema(): MissingChangesSchema;
}

expectTypeOf<_ConformingModel>().toExtend<ActiveEffectTypeDataModel.Any>();
expectTypeOf<typeof _ConformingModel>().toExtend<ActiveEffectTypeDataModel.AnyConstructor>();
expectTypeOf<typeof _ConformingRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _TypedRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _NonConformingModel>().not.toExtend<ActiveEffectTypeDataModel.RegistrableClass>();

type CompatibilityModels = Document._ConstrainModels<"ActiveEffect", { testCompatibility: typeof _CompatibilityModel }>;
expectTypeOf<CompatibilityModels["testCompatibility"]>().toEqualTypeOf<typeof _CompatibilityModel>();
expectTypeOf<ActiveEffect._ChangesFor<_CompatibilityModel>>().toEqualTypeOf<ActiveEffect.ChangeData[]>();

declare global {
  namespace CONFIG.ActiveEffect {
    interface ChangeTypes {
      "test.change": foundry.documents.ActiveEffect.ChangeTypeConfig;
    }

    interface Phases {
      "test.phase": foundry.documents.ActiveEffect.ChangePhaseConfig;
    }

    interface ExpiryEvents {
      "test.expiry": string;
    }
  }
}

expectTypeOf<ActiveEffect.ChangeTypes["test.change"]>().toEqualTypeOf<ActiveEffect.ChangeTypeConfig>();
expectTypeOf<ActiveEffect.ChangePhases["test.phase"]>().toEqualTypeOf<ActiveEffect.ChangePhaseConfig>();
expectTypeOf<ActiveEffect.ExpiryEvents["test.expiry"]>().toBeString();
expectTypeOf<"test.phase">().toExtend<ActiveEffect.ChangePhase>();
expectTypeOf<Actor.Implementation["applyActiveEffects"]>().toBeCallableWith("test.phase");
// @ts-expect-error Only core and package-registered phases are accepted.
expectTypeOf<Actor.Implementation["applyActiveEffects"]>().toBeCallableWith("test.typo");
