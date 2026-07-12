import type { Identity } from "#utils";
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

  protected override _cast(value: unknown): AssignmentType;

  override resolve(value: AssignmentType, references: Record<string, unknown>): InitializedType;

  static override isReference(value: unknown): value is VFXReferenceObjectField.ReferenceData;

  #VFXReferenceObjectField: true;
}

declare namespace VFXReferenceObjectField {
  interface Any extends AnyVFXReferenceObjectField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferenceObjectField> {}

  interface Options extends VFXReferenceField.Options {}

  type DefaultOptions = VFXReferenceField.DefaultOptions;

  /**
   * Serialized reference pointing to a named object in the effect's reference map.
   */
  interface ReferenceData {
    reference: string;
    property?: string | undefined;
    deltas?: Record<string, number> | undefined;
  }

  type AssignmentType<
    ValueField extends DataField.Any,
    _Options extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  > = ReferenceData | DataField.InitializedTypeFor<ValueField> | null | undefined;

  type InitializedType<
    ValueField extends DataField.Any,
    Options extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  > = VFXReferenceField.InitializedType<ValueField, Options>;

  type PersistedType<
    ValueField extends DataField.Any,
    _Options extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions,
  > = ReferenceData | DataField.PersistedTypeFor<ValueField> | null | undefined;
}

export default VFXReferenceObjectField;

declare abstract class AnyVFXReferenceObjectField extends VFXReferenceObjectField {
  constructor(...args: never);
}
