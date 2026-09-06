import type { AnyObject, Identity, SimpleMerge } from "#utils";
import type { DataField, DataSchema } from "#common/data/fields.d.mts";
import type VFXReferenceField from "./vfx-reference-field.d.mts";

import fields = foundry.data.fields;

/**
 * A subclass of VFXReferenceField which is used to target an entire object.
 * This allows applying deltas to multiple properties of that object.
 *
 * @example
 * ```js
 * const dimensions = new VFXReferenceObjectField(new SchemaField({
 *   width: new NumberField(),
 *   height: new NumberField()
 * }));
 * const unresolvedValue = {reference: "target", deltas: {width: 1, height: -1}};
 * const references = {target: tokenDocument}; // Suppose tokenDocument width=4 and tokenDocument height=4
 * const resolvedObject = dimensions.resolve(unresolvedValue, references); // {width: 5, height: 3}
 * ```
 */
declare class VFXReferenceObjectField<
  ValueField extends DataField.Any = DataField.Any,
  Options extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions<ValueField>,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXReferenceObjectField.AssignmentType<ValueField, Options>,
  InitializedType = VFXReferenceObjectField.InitializedType<ValueField, Options>,
  PersistedType = VFXReferenceObjectField.PersistedType<ValueField, Options>,
> extends VFXReferenceField<ValueField, Options, AssignmentType, InitializedType, PersistedType> {
  constructor(schema: ValueField, options?: Options, context?: DataField.ConstructionContext);

  static override referenceField: VFXReferenceObjectField.ReferenceField;

  override resolve(value: AssignmentType, references: AnyObject): InitializedType;

  static override isReference(value: unknown): value is VFXReferenceObjectField.ReferenceData;
}

declare namespace VFXReferenceObjectField {
  interface Any extends AnyVFXReferenceObjectField {}
  interface AnyConstructor extends Identity<typeof AnyVFXReferenceObjectField> {}

  interface Options extends VFXReferenceField.Options {}

  type DefaultOptions<ValueField extends DataField.Any = DataField.Any> = VFXReferenceField.DefaultOptions<ValueField>;

  type MergedOptions<ValueField extends DataField.Any, Opts extends VFXReferenceObjectField.Options> = SimpleMerge<
    DefaultOptions<ValueField>,
    Opts
  >;

  interface ReferenceSchema extends DataSchema {
    reference: fields.StringField<{ required: true; nullable: false }>;

    property: fields.StringField<{ required: false; nullable: true }>;

    deltas: fields.TypedObjectField<fields.NumberField<{ required: true; nullable: false }>>;
  }

  type ReferenceField = fields.SchemaField<ReferenceSchema, { required: true; nullable: false }>;

  /**
   * Serialized reference pointing to a named object in the effect's reference map.
   */
  interface ReferenceData extends fields.SchemaField.CreateData<ReferenceSchema> {}

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions<ValueField>,
    // eslint-disable-next-line @typescript-eslint/no-deprecated
  > = DataField.DerivedAssignmentType<
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    ReferenceData | DataField.AssignmentTypeFor<ValueField>,
    MergedOptions<ValueField, Opts>
  >;

  type InitializedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions<ValueField>,
  > = VFXReferenceField.InitializedType<ValueField, Opts>;

  type PersistedType<
    ValueField extends DataField.Any,
    Opts extends VFXReferenceObjectField.Options = VFXReferenceObjectField.DefaultOptions<ValueField>,
  > = DataField.DerivedInitializedType<
    ReferenceData | DataField.PersistedTypeFor<ValueField>,
    MergedOptions<ValueField, Opts>
  >;
}

export default VFXReferenceObjectField;

declare abstract class AnyVFXReferenceObjectField extends VFXReferenceObjectField {
  constructor(...args: never);
}
