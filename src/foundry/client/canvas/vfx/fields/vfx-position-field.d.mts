import type { Identity, SimpleMerge, AnyObject } from "#utils";
import type { DataField } from "#common/data/fields.d.mts";
import type VFXPointField from "./vfx-point-field.d.mts";

/**
 * A specialized subclass of SchemaField which positions a sprite.
 * More than just a point; contains elevation, sort, rotation, and scale behaviors needed to define transforms.
 * Each control point of a VFXPath is a position, and along a path an omitted value holds the prior point's value.
 */
declare class VFXPositionField<
  Options extends VFXPositionField.Options = VFXPositionField.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  AssignmentType = VFXPositionField.AssignmentType<Options>,
  InitializedType = VFXPositionField.InitializedType<Options>,
  PersistedType extends AnyObject | null | undefined = VFXPositionField.PersistedType<Options>,
> extends foundry.data.fields.SchemaField<
  VFXPositionField.PositionSchema,
  Options,
  AssignmentType,
  InitializedType,
  PersistedType
> {
  constructor(options?: Options, context?: DataField.ConstructionContext);
}

declare namespace VFXPositionField {
  interface Any extends AnyVFXPositionField {}
  interface AnyConstructor extends Identity<typeof AnyVFXPositionField> {}

  interface PositionSchema extends foundry.data.fields.DataSchema {
    x: foundry.data.fields.NumberField<{ required: true; nullable: false }>;

    y: foundry.data.fields.NumberField<{ required: true; nullable: false }>;

    elevation: foundry.data.fields.NumberField<{ required: false; nullable: false }>;

    rotation: foundry.data.fields.NumberField<{ required: false; nullable: false }>;

    scale: VFXPointField<{ required: false }>;

    sort: foundry.data.fields.NumberField<{ required: false; nullable: false }>;

    sortLayer: foundry.data.fields.NumberField<{ required: false; nullable: false }>;
  }

  interface Options extends foundry.data.fields.SchemaField.Options<PositionSchema> {}

  type DefaultOptions = SimpleMerge<
    foundry.data.fields.SchemaField.DefaultOptions,
    {
      required: true;
      nullable: false;
    }
  >;

  type MergedOptions<Options extends VFXPositionField.Options> = SimpleMerge<DefaultOptions, Options>;

  /**
   * @deprecated AssignmentData is being phased out. See {@linkcode foundry.data.fields.SchemaField.AssignmentData}
   * for more details.
   */
  type AssignmentType<Opts extends VFXPositionField.Options = VFXPositionField.DefaultOptions> =
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    foundry.data.fields.SchemaField.Internal.AssignmentType<PositionSchema, MergedOptions<Opts>>;

  type InitializedType<Opts extends VFXPositionField.Options = VFXPositionField.DefaultOptions> =
    foundry.data.fields.SchemaField.Internal.InitializedType<PositionSchema, MergedOptions<Opts>>;

  type PersistedType<Opts extends VFXPositionField.Options = VFXPositionField.DefaultOptions> =
    foundry.data.fields.SchemaField.Internal.PersistedType<PositionSchema, MergedOptions<Opts>>;
}

export default VFXPositionField;

declare abstract class AnyVFXPositionField extends VFXPositionField {
  constructor(...args: never);
}
