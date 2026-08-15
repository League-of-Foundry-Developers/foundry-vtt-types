import { expectTypeOf } from "vitest";
import type { GetKey } from "fvtt-types/utils";

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
// class' construct signature pinned at its default `Schema` (see `ActiveEffect.CoreEffects`), so compare
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

// `ForeignDocumentField` inherits from `StringField` for serialization but holds documents; the concrete
// field constraint rejects it.
interface DocumentTypedChangeSchema extends fields.DataSchema {
  type: fields.ForeignDocumentField<typeof foundry.documents.BaseActiveEffect>;
  phase: fields.StringField<{ required: true; blank: false; initial: "initial" }>;
  priority: fields.NumberField;
}

interface DocumentTypedSchema extends fields.DataSchema {
  changes: fields.ArrayField<fields.SchemaField<DocumentTypedChangeSchema>>;
}

// @ts-expect-error `type` must be the core string field, not merely something descended from `StringField`.
declare class _DocumentTypedModel extends ActiveEffectTypeDataModel<DocumentTypedSchema> {}

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

declare class _MissingChangesModel extends ActiveEffectTypeDataModel<MissingChangesSchema> {}

expectTypeOf<ConformingSchema>().not.toExtend<ActiveEffectTypeDataModel.LegacySchema>();
expectTypeOf<MissingChangesSchema>().toExtend<ActiveEffectTypeDataModel.LegacySchema>();

// Constructing a model whose schema omits `changes` hits the deprecated overload.
// eslint-disable-next-line @typescript-eslint/no-deprecated
new _MissingChangesModel();

// A model which defines its own `changes` is not deprecated to construct.
new _ConformingModel();

// `tsc` cannot see which overload is deprecated, but it can see that the trailing one stays usable:
// `ConstructorParameters` reads the last overload, so making it conditional resolves it to `never` for
// conforming models and breaks generic construction, without changing any deprecation behavior.
declare function construct<T extends abstract new (...args: never) => unknown>(
  cls: T,
  ...args: ConstructorParameters<T>
): InstanceType<T>;

construct(_ConformingModel, { enabled: true });
expectTypeOf<ConstructorParameters<typeof _ConformingModel>>().not.toEqualTypeOf<never>();
expectTypeOf<ConstructorParameters<typeof _MissingChangesModel>>().not.toEqualTypeOf<never>();

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

interface BadTypedChanges {
  [type: string]: fields.SchemaField<MissingPhaseChangeSchema>;
  custom: fields.SchemaField<MissingPhaseChangeSchema>;
}

interface BadTypedSchema extends fields.DataSchema {
  changes: fields.ArrayField<fields.TypedSchemaField<BadTypedChanges>>;
}

// @ts-expect-error Each type of a `TypedSchemaField` changes element must define `phase` too.
declare class _BadTypedModel extends ActiveEffectTypeDataModel<BadTypedSchema> {}

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
expectTypeOf<_MissingChangesModel>().toExtend<ActiveEffectTypeDataModel.Any>();
expectTypeOf<typeof _MissingChangesModel>().toExtend<ActiveEffectTypeDataModel.AnyConstructor>();
expectTypeOf<typeof _ConformingRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _TypedRegistrableModel>().toExtend<ActiveEffectTypeDataModel.RegistrableClass>();
expectTypeOf<typeof _NonConformingModel>().not.toExtend<ActiveEffectTypeDataModel.RegistrableClass>();

// `defineSchema` alone is not enough — a registrable model must actually be a `TypeDataModel`.
declare const _schemaShapedObject: { defineSchema(): ConformingSchema };
expectTypeOf(_schemaShapedObject).not.toExtend<ActiveEffectTypeDataModel.RegistrableClass>();

type CompatibilityModels = Document._ConstrainModels<"ActiveEffect", { testCompatibility: typeof _CompatibilityModel }>;
expectTypeOf<CompatibilityModels["testCompatibility"]>().toEqualTypeOf<typeof _CompatibilityModel>();

// A Document with no entry in `_ModelConstraints` is passed through untouched, optional modifiers included.
type UnconstrainedModels = Document._ConstrainModels<"Actor", { a: typeof _CompatibilityModel; b?: undefined }>;
expectTypeOf<UnconstrainedModels>().toEqualTypeOf<{ a: typeof _CompatibilityModel; b?: undefined }>();
// A model which declares no `changes` falls back to `ChangeData[]`, the shape the runtime patches in.
expectTypeOf<GetKey<_CompatibilityModel, "changes", ActiveEffect.ChangeData[]>>().toEqualTypeOf<
  ActiveEffect.ChangeData[]
>();

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
