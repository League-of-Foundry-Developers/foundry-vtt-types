import type { Identity, SimpleMerge, AnyObject } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";

/**
 * A specialized subclass of SchemaField that specifically deals with points.
 * Accepts plain objects with `{x, y}` structure or PIXI.Point-like objects.
 *
 * @template Options - Options for this field instance
 */
declare class VFXPointField<
  Options extends VFXPointField.Options = VFXPointField.DefaultOptions,
  AssignmentType = foundry.data.fields.SchemaField.Internal.InitializedType<
    VFXPointField.PointSchema,
    VFXPointField.MergedOptions<Options>
  >,
  InitializedType = foundry.data.fields.SchemaField.Internal.InitializedType<
    VFXPointField.PointSchema,
    VFXPointField.MergedOptions<Options>
  >,
  PersistedType extends AnyObject | null | undefined = foundry.data.fields.SchemaField.Internal.PersistedType<
    VFXPointField.PointSchema,
    VFXPointField.MergedOptions<Options>
  >,
> extends foundry.data.fields.SchemaField<
  VFXPointField.PointSchema,
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

  protected override _cast(value: unknown): AssignmentType;

  #VFXPointField: true;
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
}

export default VFXPointField;

declare abstract class AnyVFXPointField extends VFXPointField {
  constructor(...args: never);
}
