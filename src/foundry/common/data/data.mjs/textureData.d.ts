import type * as fields from "../fields.mjs";

interface SourceOptions {
  categories?: Exclude<FilePathFieldOptions["categories"], undefined>;

  initial?: fields.InitialType<string | null | undefined>;

  wildcard?: boolean;

  label?: string | undefined;
}

/**
 * A {@link fields.SchemaField} subclass used to represent texture data.
 */
export class TextureData<Options extends DataFieldOptions, SourceOpts extends SourceOptions> extends fields.SchemaField<
  TextureData.Schema<SourceOpts>,
  Options
> {
  /**
   * @param options    - Options which are forwarded to the SchemaField constructor
   * @param srcOptions - Additional options for the src field
   */
  constructor(options?: Options, srcOptions?: SourceOpts);
}

declare namespace TextureData {
  type ConstructorData<SourceOpts extends SourceOptions> = fields.SchemaField.AssignmentType<Schema<SourceOpts>>;
  type Properties<SourceOpts extends SourceOptions> = fields.SchemaField.InitializedType<Schema<SourceOpts>>;
  type Source<SourceOpts extends SourceOptions> = fields.SchemaField.PersistedType<Schema<SourceOpts>>;

  interface Schema<SourceOpts extends SourceOptions> extends DataSchema {
    /**
     * The URL of the texture source.
     * @defaultValue `Initial`
     */
    // @ts-expect-error DataField's contract says `label` should be `string` only
    // https://github.com/foundryvtt/foundryvtt/issues/8838
    src: fields.FilePathField<SourceOpts>;

    /**
     * The scale of the texture in the X dimension.
     * @defaultValue `1`
     */
    scaleX: fields.NumberField<
      { nullable: false; initial: 1 },
      fields.NumberField.DefaultAssignmentType,
      Exclude<fields.NumberField.DefaultInitializedType, null>,
      Exclude<fields.NumberField.DefaultPersistedType, null>
    >;

    /**
     * The scale of the texture in the Y dimension.
     * @defaultValue `1`
     */
    scaleY: fields.NumberField<{ nullable: false; initial: 1 }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     * @defaultValue `0`
     */
    offsetX: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     * @defaultValue `0`
     */
    offsetY: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * An optional color string used to tint the texture.
     * @defaultValue `null`
     */
    tint: fields.ColorField;
  }
}
