import type { AnyObject, Identity, SimpleMerge } from "#utils";
import type { DataField, DataSchema } from "#common/data/fields.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { DataModelValidationFailure } from "#common/data/validation-failure.d.mts";

import fields = foundry.data.fields;

/**
 * This specialized data field allows storing a data structure that will be later dynamically resolved.
 * This field can be used for a value type that is a single property.
 * If that property is numeric, the reference field can store a relative delta.
 */
declare class VFXReferenceField<
  ValueField extends DataField.Any = DataField.Any,
  Options extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions<ValueField>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXReferenceField.AssignmentType<ValueField, Options>,
  InitializedType = VFXReferenceField.InitializedType<ValueField, Options>,
  PersistedType = VFXReferenceField.PersistedType<ValueField, Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * Construct a VFXReferenceField by providing the inner field schema that it wraps.
   */
  constructor(valueField: ValueField, options?: Options, context?: DataField.ConstructionContext);

  /**
   * The schema of a reference object.
   */
  static referenceField:
    | VFXReferenceField.ReferenceField
    | foundry.canvas.vfx.fields.VFXReferenceObjectField.ReferenceField;

  valueField: ValueField;

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  /**
   * Resolve the value of a VFXReferenceObjectField
   * @param value      - The initial value of the field which may contain a reference
   * @param references - Provided references
   * @returns The resulting resolved value with references applied, if possible
   */
  resolve(value: AssignmentType, references: AnyObject): InitializedType;

  /**
   * Test whether a value is a reference.
   */
  static isReference(value: unknown): value is VFXReferenceField.ReferenceData;

  #VFXReferenceField: true;
}

declare namespace VFXReferenceField {
  interface Any extends AnyVFXReferenceField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferenceField> {}

  interface Options extends DataField.Options.Any {}

  type DefaultOptions<ValueField extends DataField.Any = DataField.Any> = SimpleMerge<
    DataField.DefaultOptions,
    ValueField["options"]
  >;

  type MergedOptions<ValueField extends DataField.Any, Opts extends VFXReferenceField.Options> = SimpleMerge<
    DefaultOptions<ValueField>,
    Opts
  >;

  interface ReferenceSchema extends DataSchema {
    reference: fields.StringField<{ required: true; nullable: false }>;

    property: fields.StringField<{ required: false; nullable: true }>;

    delta: fields.NumberField<{ required: false; nullable: false }>;
  }

  type ReferenceField = fields.SchemaField<ReferenceSchema, { required: true; nullable: false }>;

  /**
   * Serialized reference pointing to a named value in the effect's reference map.
   */
  interface ReferenceData extends fields.SchemaField.CreateData<ReferenceSchema> {}

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions<ValueField>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReferenceData | DataField.AssignmentTypeFor<ValueField>,
    MergedOptions<ValueField, Opts>
  >;

  /**
   * @remarks `undefined` is always in the union: {@linkcode VFXReferenceField.initialize} returns
   * `undefined` for a value which is still an unresolved reference, regardless of the field's options.
   */
  type InitializedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions<ValueField>,
  > =
    | DataField.DerivedInitializedType<DataField.InitializedTypeFor<ValueField>, MergedOptions<ValueField, Opts>>
    | undefined;

  type PersistedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions<ValueField>,
  > = DataField.DerivedInitializedType<
    ReferenceData | DataField.PersistedTypeFor<ValueField>,
    MergedOptions<ValueField, Opts>
  >;
}

export default VFXReferenceField;

declare abstract class AnyVFXReferenceField extends VFXReferenceField {
  constructor(...args: never);
}
