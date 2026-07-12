import type { Identity } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { DataModelValidationFailure } from "#common/data/validation-failure.d.mts";
import type PointSourcePolygon from "#client/canvas/geometry/shapes/source-polygon.d.mts";
import type VFXReferenceField from "./vfx-reference-field.d.mts";

/**
 * A specialized VFX reference field that accepts either a pre-computed PointSourcePolygon instance
 * or a serializable configuration object `{x, y, type, radius}` sufficient to create one.
 *
 * In the serialized path, the field stores a plain config object and automatically computes the
 * polygon during field initialization. In the reference path, the field resolves to a live
 * PointSourcePolygon at runtime, allowing multiple components to share a single pre-computed polygon
 * without redundant computation.
 *
 * In both cases the initialized value accessed by the component is always a PointSourcePolygon
 * instance (or null/undefined if not configured).
 */
declare class VFXPointSourcePolygonField<
  Options extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions,
  AssignmentType = VFXPointSourcePolygonField.AssignmentType<Options>,
  InitializedType = VFXPointSourcePolygonField.InitializedType<Options>,
  PersistedType = VFXPointSourcePolygonField.PersistedType<Options>,
> extends VFXReferenceField<
  VFXPointSourcePolygonField.PolygonConfigField,
  Options,
  AssignmentType,
  InitializedType,
  PersistedType
> {
  /**
   * @param options - Options which configure the behavior of the field
   * @param context - Additional context which describes the field
   */
  constructor(options?: Options, context?: DataField.ConstructionContext);

  protected override _cleanType(value: InitializedType, options?: DataField.CleanOptions): InitializedType;

  override initialize(
    value: PersistedType,
    model: DataModel.Any,
    options?: DataField.InitializeOptions,
  ): InitializedType | (() => InitializedType | null);

  protected override _validateType(
    value: InitializedType,
    options?: DataField.ValidateOptions<this>,
  ): boolean | DataModelValidationFailure | void;

  override resolve(value: AssignmentType, references: Record<string, unknown>): InitializedType;

  #VFXPointSourcePolygonField: true;
}

declare namespace VFXPointSourcePolygonField {
  interface Any extends AnyVFXPointSourcePolygonField {}
  interface AnyConstructor extends Identity<typeof AnyVFXPointSourcePolygonField> {}

  /** The schema field used to validate the serializable polygon config. */
  type PolygonConfigField = foundry.data.fields.SchemaField<{
    type: foundry.data.fields.StringField<{ required: true; blank: false }>;
    x: foundry.data.fields.NumberField<{ required: true; nullable: false }>;
    y: foundry.data.fields.NumberField<{ required: true; nullable: false }>;
    elevation: foundry.data.fields.NumberField<{ required: false; nullable: true }>;
    level: foundry.data.fields.DocumentIdField<{ readonly: false; initial: null }>;
    radius: foundry.data.fields.NumberField<{ required: false; nullable: true; positive: true }>;
    angle: foundry.data.fields.AngleField<{ required: false }>;
    rotation: foundry.data.fields.AngleField<{ required: false }>;
  }>;

  interface Options extends VFXReferenceField.Options {}

  type DefaultOptions = VFXReferenceField.DefaultOptions;

  /** Assignment type: polygon config, reference data, PointSourcePolygon instance, or null/undefined. */
  type AssignmentType<_Options extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions> =
    PointSourcePolygon | VFXReferenceField.AssignmentType<PolygonConfigField>;

  /** Initialized type: PointSourcePolygon or null/undefined. */
  type InitializedType<
    _Options extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions,
  > = PointSourcePolygon | null | undefined;

  /** Persisted type: serializable config object, reference data, or null/undefined. */
  type PersistedType<_Options extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions> =
    VFXReferenceField.PersistedType<PolygonConfigField>;
}

export default VFXPointSourcePolygonField;

declare abstract class AnyVFXPointSourcePolygonField extends VFXPointSourcePolygonField {
  constructor(...args: never);
}
