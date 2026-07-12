import type { Identity, SimpleMerge } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { DataModelValidationFailure } from "#common/data/validation-failure.d.mts";

/**
 * This specialized data field allows storing a data structure that will be later dynamically resolved.
 * The field can store either a concrete value (matching the wrapped valueField) or a reference object
 * that will be resolved at playback time.
 *
 * @template ValueField - The inner data field whose value type this field wraps
 * @template Options    - Options for this field instance
 */
declare class VFXReferenceField<
  ValueField extends DataField.Any = DataField.Any,
  Options extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions,
  AssignmentType = VFXReferenceField.AssignmentType<ValueField, Options>,
  InitializedType = VFXReferenceField.InitializedType<ValueField, Options>,
  PersistedType = VFXReferenceField.PersistedType<ValueField, Options>,
> extends DataField<Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param valueField - The inner field schema that this field wraps
   * @param options    - Options which configure the behavior of the field
   * @param context    - Additional context which describes the field
   */
  constructor(valueField: ValueField, options?: Options, context?: DataField.ConstructionContext);

  /**
   * The schema of a reference object.
   */
  static referenceField: foundry.data.fields.SchemaField.Any;

  /**
   * The inner field whose value type this reference field wraps.
   */
  valueField: ValueField;

  protected override _cast(value: unknown): AssignmentType;

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
   * Resolve the value of this field against provided reference data.
   * @param value      - The initial value which may contain a reference
   * @param references - Provided references
   */
  resolve(value: AssignmentType, references: Record<string, unknown>): InitializedType;

  /**
   * Test whether a value is a reference.
   * @param value - The value to test
   */
  static isReference(value: unknown): value is VFXReferenceField.ReferenceData;

  #VFXReferenceField: true;
}

declare namespace VFXReferenceField {
  interface Any extends AnyVFXReferenceField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferenceField> {}

  interface Options extends DataField.Options.Any {}

  type DefaultOptions = SimpleMerge<DataField.DefaultOptions, Record<string, never>>;

  /**
   * Serialized reference pointing to a named value in the effect's reference map.
   */
  interface ReferenceData {
    reference: string;
    property?: string | undefined;
    delta?: number | undefined;
  }

  type AssignmentType<
    ValueField extends DataField.Any,
    _Options extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions,
  > = ReferenceData | DataField.InitializedTypeFor<ValueField> | null | undefined;

  type InitializedType<
    ValueField extends DataField.Any,
    _Options extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions,
  > = DataField.InitializedTypeFor<ValueField> | undefined;

  type PersistedType<
    ValueField extends DataField.Any,
    _Options extends VFXReferenceField.Options = VFXReferenceField.DefaultOptions,
  > = ReferenceData | DataField.PersistedTypeFor<ValueField> | null | undefined;
}

export default VFXReferenceField;

declare abstract class AnyVFXReferenceField extends VFXReferenceField {
  constructor(...args: never);
}
