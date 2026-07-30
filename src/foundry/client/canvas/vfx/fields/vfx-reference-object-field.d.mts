import type { AnyObject, Identity, SimpleMerge } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type VFXReferenceField from "./vfx-reference-field.d.mts";

/**
 * A subclass of VFXReferenceField which is used to target an entire object.
 * This allows applying deltas to multiple properties of that object.
 *
 * @example Resolve a relative point into an absolute coordinate.
 * ```js
 * const dimensions = new VFXReferenceObjectField(new SchemaField({
 *   width: new NumberField(),
 *   height: new NumberField()
 * }));
 * const unresolvedValue = {reference: "target", deltas: {width: 1, height: -1}};
 * const references = {target: tokenDocument}; // tokenDocument width=4, height=4
 * const resolvedObject = dimensions.resolve(unresolvedValue, references); // {width: 5, height: 3}
 * ```
 *
 * @template ValueField - The inner schema/object field this reference field wraps
 * @template Options    - Options for this field instance
 */
declare class VFXReferenceObjectField<
  ValueField extends DataField.Any = DataField.Any,
  Options extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXReferenceObjectField.AssignmentType<ValueField, Options>,
  InitializedType = VFXReferenceObjectField.InitializedType<ValueField, Options>,
  PersistedType = VFXReferenceObjectField.PersistedType<ValueField, Options>,
> extends VFXReferenceField<ValueField, Options, AssignmentType, InitializedType, PersistedType> {
  /**
   * @param schema  - The inner schema field this object reference field wraps
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(schema: ValueField, options?: Options, context?: DataField.ConstructionContext);

  /**
   * The schema of a reference object (extends base with a `deltas` map).
   * Overrides the base field's schema to replace `delta` with `deltas`.
   */
  static override referenceField: foundry.data.fields.SchemaField.Any;

  override resolve(value: AssignmentType, references: AnyObject): InitializedType;

  static override isReference(value: unknown): value is VFXReferenceObjectField.ReferenceData;

  #VFXReferenceObjectField: true;
}

declare namespace VFXReferenceObjectField {
  interface Any extends AnyVFXReferenceObjectField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferenceObjectField> {}

  interface Options extends VFXReferenceField.Options {}

  type DefaultOptions = VFXReferenceField.DefaultOptions;

  type MergedOptions<Opts extends VFXReferenceObjectField.Options> = SimpleMerge<DefaultOptions, Opts>;

  /**
   * Serialized reference pointing to a named object in the effect's reference map.
   */
  interface ReferenceData {
    reference: string;

    property?: string | undefined;

    deltas?: Record<string, number> | undefined;
  }

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReferenceData | DataField.AssignmentTypeFor<ValueField>,
    MergedOptions<Opts>
  >;

  type InitializedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  > = VFXReferenceField.InitializedType<ValueField, Opts>;

  type PersistedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  > = DataField.DerivedInitializedType<ReferenceData | DataField.PersistedTypeFor<ValueField>, MergedOptions<Opts>>;
}

export default VFXReferenceObjectField;

declare abstract class AnyVFXReferenceObjectField extends VFXReferenceObjectField {
  constructor(...args: never);
}
