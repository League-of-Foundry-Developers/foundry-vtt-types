import type { AnyObject, Identity, SimpleMerge } from "#utils";
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

  override resolve(value: AssignmentType, references: AnyObject): InitializedType;

  #VFXPointSourcePolygonField: true;
}

declare namespace VFXPointSourcePolygonField {
  interface Any extends AnyVFXPointSourcePolygonField {}
  interface AnyConstructor extends Identity<typeof AnyVFXPointSourcePolygonField> {}

  interface PolygonConfigSchema extends foundry.data.fields.DataSchema {
    type: foundry.data.fields.StringField<{
      required: true;
      blank: false;
      initial: "move";
      choices: typeof CONST.EDGE_RESTRICTION_TYPES;
    }>;

    x: foundry.data.fields.NumberField<{ required: true; nullable: false }>;

    y: foundry.data.fields.NumberField<{ required: true; nullable: false }>;

    elevation: foundry.data.fields.NumberField<{ required: false; nullable: true; initial: undefined }>;

    level: foundry.data.fields.DocumentIdField<{ readonly: false; initial: null }>;

    radius: foundry.data.fields.NumberField<{ required: false; nullable: true; initial: null; positive: true }>;

    angle: foundry.data.fields.AngleField<{ required: false; initial: undefined }>;

    rotation: foundry.data.fields.AngleField<{ required: false; initial: undefined }>;
  }

  /** The schema field used to validate the serializable polygon config. */
  type PolygonConfigField = foundry.data.fields.SchemaField<
    PolygonConfigSchema,
    { required: false; nullable: true; initial: null }
  >;

  interface Options extends VFXReferenceField.Options {}

  type DefaultOptions = VFXReferenceField.DefaultOptions;

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<Opts extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    PointSourcePolygon | VFXReferenceField.AssignmentType<PolygonConfigField, Opts>;

  /**
   * @remarks Always a `PointSourcePolygon` once initialized — the field computes the polygon from its
   * serialized config during initialization — or `undefined` while the reference is unresolved.
   */
  type InitializedType<Opts extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions> =
    | DataField.DerivedInitializedType<PointSourcePolygon, SimpleMerge<DefaultOptions, Opts>>
    | undefined;

  type PersistedType<Opts extends VFXPointSourcePolygonField.Options = VFXPointSourcePolygonField.DefaultOptions> =
    VFXReferenceField.PersistedType<PolygonConfigField, Opts>;
}

export default VFXPointSourcePolygonField;

declare abstract class AnyVFXPointSourcePolygonField extends VFXPointSourcePolygonField {
  constructor(...args: never);
}
