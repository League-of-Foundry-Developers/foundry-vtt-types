import type { Identity, SimpleMerge, AnyObject } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";

/**
 * A specialized subclass of SchemaField that specifically deals with points.
 * This data structure accepts plain objects with \{x, y\} structure or PIXI.Point objects.
 */
declare class VFXPointField<
  Options extends VFXPointField.Options = VFXPointField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXPointField.AssignmentType<Options>,
  InitializedType = VFXPointField.InitializedType<Options>,
  PersistedType extends AnyObject | null | undefined = VFXPointField.PersistedType<Options>,
> extends foundry.data.fields.SchemaField<
  VFXPointField.PointSchema,
  Options,
  AssignmentType,
  InitializedType,
  PersistedType
> {
  constructor(options?: Options, context?: DataField.ConstructionContext);

  protected override _cast(value: unknown): AssignmentType;
}

declare namespace VFXPointField {
  interface Any extends AnyVFXPointField {}
  interface AnyConstructor extends Identity<typeof AnyVFXPointField> {}

  interface PointSchema extends foundry.data.fields.DataSchema {
    x: foundry.data.fields.NumberField<{ required: true; nullable: false }>;

    y: foundry.data.fields.NumberField<{ required: true; nullable: false }>;
  }

  interface Options extends foundry.data.fields.SchemaField.Options<PointSchema> {}

  type DefaultOptions = SimpleMerge<
    foundry.data.fields.SchemaField.DefaultOptions,
    {
      required: true;
      nullable: false;
    }
  >;

  type MergedOptions<Options extends VFXPointField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<Opts extends VFXPointField.Options = VFXPointField.DefaultOptions> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    foundry.data.fields.SchemaField.Internal.AssignmentType<PointSchema, MergedOptions<Opts>>;

  type InitializedType<Opts extends VFXPointField.Options = VFXPointField.DefaultOptions> =
    foundry.data.fields.SchemaField.Internal.InitializedType<PointSchema, MergedOptions<Opts>>;

  type PersistedType<Opts extends VFXPointField.Options = VFXPointField.DefaultOptions> =
    foundry.data.fields.SchemaField.Internal.PersistedType<PointSchema, MergedOptions<Opts>>;
}

export default VFXPointField;

declare abstract class AnyVFXPointField extends VFXPointField {
  constructor(...args: never);
}
