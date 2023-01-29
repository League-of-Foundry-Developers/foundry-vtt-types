import * as fields from "../fields.mjs";

interface TextureDataSchema<
  Categories extends Exclude<FilePathFieldOptions["categories"], undefined>,
  Initial extends string | null | undefined,
  Wildcard extends boolean,
  Label extends string | undefined
> extends DataSchema {
  /**
   * The URL of the texture source.
   * @defaultValue `Initial`
   */
  src: fields.FilePathField<
    Label extends string
      ? { categories: Categories; initial: Initial; label: Label; wildcard: Wildcard }
      : { categories: Categories; initial: Initial; wildcard: Wildcard }
  >;

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

/**
 * A {@link fields.SchemaField} subclass used to represent texture data.
 */
export class TextureData<
  Options extends DataFieldOptions,
  Categories extends Exclude<FilePathFieldOptions["categories"], undefined> = ("IMAGE" | "VIDEO")[],
  Initial extends string | null | undefined = null,
  Wildcard extends boolean = false,
  Label extends string | undefined = undefined
> extends fields.SchemaField<TextureDataSchema<Categories, Initial, Wildcard, Label>, Options> {
  /**
   * @param options    - Options which are forwarded to the SchemaField constructor
   * @param srcOptions - Additional options for the src field
   */
  constructor(
    options?: Options,
    srcOptions?: { categories?: Categories; initial?: Initial; wildcard?: Wildcard; label?: Label }
  );
}
