import type { GetKey, NullishCoalesce, RemoveIndexSignatures, ToMethod, ValueOf } from "#utils";
import type { DataModel, Document } from "#common/abstract/_module.d.mts";
import type { fields } from "#client/data/_module.d.mts";

declare namespace LightData {
  type Parent = TokenDocument.Implementation | AmbientLightDocument.Implementation;

  interface AnimationData extends fields.SchemaField.InitializedData<LightAnimationDataSchema> {}

  interface LightAnimationDataSchema extends fields.DataSchema {
    /**
     * The animation type which is applied
     * @defaultValue `null`
     * @remarks While not enforced by the data model, this should be in `keyof CONFIG.Canvas.lightAnimations`
     * (or `.darknessAnimations` as appropriate) or the animation will be ignored
     */
    type: fields.StringField<{ nullable: true; blank: false; initial: null }>;

    /**
     * The speed of the animation, a number between 0 and 10
     * @defaultValue `5`
     */
    speed: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: 5;
      min: 0;
      max: 10;
      validationError: "Light animation speed must be an integer between 0 and 10";
    }>;

    /**
     * The intensity of the animation, a number between 1 and 10
     * @defaultValue `5`
     */
    intensity: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: 5;
      min: 1;
      max: 10;
      validationError: "Light animation intensity must be an integer between 1 and 10";
    }>;

    /**
     * Reverse the direction of animation.
     * @defaultValue `false`
     */
    reverse: fields.BooleanField;
  }

  interface DarknessSchema extends fields.DataSchema {
    /**
     * @defaultValue `0`
     */
    min: fields.AlphaField<{ initial: 0 }>;

    /**
     * @defaultValue `1`
     */
    max: fields.AlphaField<{ initial: 1 }>;
  }

  interface Schema extends fields.DataSchema {
    /**
     * Is this light source a negative source? (i.e. darkness source)
     * @defaultValue `false`
     */
    negative: fields.BooleanField;

    /**
     * The priority of this source
     * @defaultValue `0`
     */
    priority: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0; min: 0 }>;

    /**
     * An opacity for the emitted light, if any
     * @defaultValue `0.5`
     */
    alpha: fields.AlphaField<{ initial: 0.5 }>;

    /**
     * The angle of emission for this point source
     * @defaultValue `0`
     */
    angle: fields.AngleField<{ initial: 360; normalize: false }>;

    /**
     * The allowed radius of bright vision or illumination
     * @defaultValue `0`
     */
    bright: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; step: 0.01 }>;

    /**
     * A tint color for the emitted light, if any
     * @defaultValue `null`
     */
    color: fields.ColorField;

    /**
     * The coloration technique applied in the shader
     * @defaultValue `1`
     * @remarks This should match the `id` of the desired property of {@linkcode AdaptiveLightingShader.SHADER_TECHNIQUES}
     */
    coloration: fields.NumberField<{ required: true; integer: true; initial: 1 }>;

    /**
     * The allowed radius of dim vision or illumination
     * @defaultValue `0`
     */
    dim: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; step: 0.01 }>;

    /**
     * Fade the difference between bright, dim, and dark gradually?
     * @defaultValue `0.5`
     */
    attenuation: fields.AlphaField<{ initial: 0.5 }>;

    /**
     * The luminosity applied in the shader
     * @defaultValue `0.5`
     */
    luminosity: fields.NumberField<{ required: true; nullable: false; initial: 0.5; min: 0; max: 1 }>;

    /**
     * The amount of color saturation this light applies to the background texture
     * @defaultValue `0`
     */
    saturation: fields.NumberField<{ required: true; nullable: false; initial: 0; min: -1; max: 1 }>;

    /**
     * The amount of contrast this light applies to the background texture
     * @defaultValue `0`
     */
    contrast: fields.NumberField<{ required: true; nullable: false; initial: 0; min: -1; max: 1 }>;

    /**
     * The depth of shadows this light applies to the background texture
     * @defaultValue `0`
     */
    shadows: fields.NumberField<{ required: true; nullable: false; initial: 0; min: 0; max: 1 }>;

    /**
     * An animation configuration for the source
     * @defaultValue see properties
     */
    animation: fields.SchemaField<LightAnimationDataSchema>;

    /**
     * A darkness range (min and max) for which the source should be active
     * @defaultValue see properties
     */
    darkness: fields.SchemaField<
      DarknessSchema,
      {
        validate: (d: unknown) => boolean;
        validationError: "darkness.max may not be less than darkness.min";
      }
    >;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
declare class LightData extends DataModel<LightData.Schema, LightData.Parent> {
  static override defineSchema(): LightData.Schema;

  /** @defaultValue `["LIGHT"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * @remarks
   * Migrations:
   * - negative `luminosity`s to `1 - luminosity` and setting `negative` true (since v12)
   */
  static override migrateData(source: object): object;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<LightData.Schema>;

  static override get schema(): fields.SchemaField<LightData.Schema>;

  static override validateJoint(data: LightData.Source): void;

  static override fromSource(source: LightData.CreateData, context?: DataModel.FromSourceOptions): LightData;

  static override fromJSON(json: string): LightData;
}

declare namespace ShapeData {
  interface Schema extends fields.DataSchema {
    /**
     * The type of shape, a value in ShapeData.TYPES.
     * For rectangles, the x/y coordinates are the top-left corner.
     * For circles, the x/y coordinates are the center of the circle.
     * For polygons, the x/y coordinates are the first point of the polygon.
     * @defaultValue `"r"`
     */
    type: fields.StringField<{ required: true; blank: false; choices: ValueOf<TYPES>[]; initial: "r" }>;

    /**
     * For rectangles, the pixel width of the shape.
     * @defaultValue `null`
     */
    width: fields.NumberField<{ required: true; integer: true; min: 0; label: "Width" }>;

    /**
     * For rectangles, the pixel width of the shape.
     * @defaultValue `null`
     */
    height: fields.NumberField<{ required: true; integer: true; min: 0; label: "Height" }>;

    /**
     * For circles, the pixel radius of the shape.
     * @defaultValue `null`
     */
    radius: fields.NumberField<{ required: true; integer: true; positive: true }>;

    /**
     * For polygons, the array of polygon coordinates which comprise the shape.
     * @defaultValue `[]`
     */
    points: fields.ArrayField<fields.NumberField<{ required: true; nullable: false }>>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface TYPES {
    RECTANGLE: "r";
    CIRCLE: "c";
    ELLIPSE: "e";
    POLYGON: "p";
  }
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
declare class ShapeData extends DataModel<ShapeData.Schema> {
  static override defineSchema(): ShapeData.Schema;

  static TYPES: ShapeData.TYPES;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<ShapeData.Schema>;

  static override get schema(): fields.SchemaField<ShapeData.Schema>;

  static override validateJoint(data: ShapeData.Source): void;

  static override fromSource(source: ShapeData.CreateData, context?: DataModel.FromSourceOptions): ShapeData;

  static override fromJSON(json: string): ShapeData;
}

declare namespace BaseShapeData {
  interface Source extends fields.SchemaField.SourceData<Schema> {}
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Schema<ShapeType extends ShapeTypes = ShapeTypes> extends fields.DataSchema {
    /**
     * The type of shape, a value in BaseShapeData.TYPES.
     * @defaultValue `this.TYPE`
     * @remarks `this.TYPE` is `""` in `BaseShapeData`, and must be defined by subclasses
     */
    type: fields.StringField<{
      required: true;
      blank: false;
      initial: ShapeType;
      validate: (value: unknown) => value is ShapeType;
      // TODO: The following `choices` does not exist in Foundry, it's a type hack to get this field to report as the only valid value it can have
      // TODO: The validation function enough might be able to be made to sufficiently limit the value
      choices: [ShapeType];
      validationError: `must be equal to "${ShapeType}"`;
    }>;

    /**
     * Is this shape a hole?
     * @defaultValue `false`
     */
    hole: fields.BooleanField;
  }

  type ShapeTypes = keyof RemoveIndexSignatures<BaseShapeData.Types>;

  interface Types extends fields.TypedSchemaField.Types {
    rectangle: typeof RectangleShapeData;
    circle: typeof CircleShapeData;
    ellipse: typeof EllipseShapeData;
    polygon: typeof PolygonShapeData;
  }
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
declare abstract class BaseShapeData<
  ShapeSchema extends BaseShapeData.Schema = BaseShapeData.Schema,
> extends DataModel<ShapeSchema> {
  /**
   * The possible shape types.
   */
  static get TYPES(): Readonly<BaseShapeData.Types>;

  /**
   * The type of this shape.
   */
  static TYPE: string;

  static override defineSchema(): BaseShapeData.Schema;

  /**
   * The index of this shape within the array of shapes in its parent.
   * @remarks Foundry marks this `@internal`, but it is read externally by
   * {@linkcode foundry.applications.apps.ShapeConfig | ShapeConfig}, which is not a subclass, so it must be public
   * here.
   */
  _index: number | undefined;

  static #BaseShapeData: true;
}

declare namespace RectangleShapeData {
  interface Schema extends BaseShapeData.Schema<"rectangle"> {
    /**
     * The top-left x-coordinate in pixels before rotation.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The top-left y-coordinate in pixels before rotation.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The width of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: undefined; positive: true }>;

    /**
     * The height of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; initial: undefined; positive: true }>;

    /**
     * The rotation around the center of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a rectangular shape.
 */
declare class RectangleShapeData extends BaseShapeData<RectangleShapeData.Schema> {
  // Defined by `Object.defineProperty` in a static initialization block; despite no options being passed, and the base class defining
  // `static TYPE = ""`, because the SIB runs first, this is readonly.
  static override readonly TYPE: "rectangle";

  static override defineSchema(): RectangleShapeData.Schema;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<RectangleShapeData.Schema>;

  static override get schema(): fields.SchemaField<RectangleShapeData.Schema>;

  static override validateJoint(data: RectangleShapeData.Source): void;

  static override fromSource(
    source: RectangleShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RectangleShapeData;

  static override fromJSON(json: string): RectangleShapeData;
}

declare namespace CircleShapeData {
  interface Schema extends BaseShapeData.Schema<"circle"> {
    /**
     * The x-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; positive: true }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData extends BaseShapeData<CircleShapeData.Schema> {
  // Defined by `Object.defineProperty` in a static initialization block; despite no options being passed, and the base class defining
  // `static TYPE = ""`, because the SIB runs first, this is readonly.
  static override readonly TYPE: "circle";

  static override defineSchema(): CircleShapeData.Schema;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<CircleShapeData.Schema>;

  static override get schema(): fields.SchemaField<CircleShapeData.Schema>;

  static override validateJoint(data: CircleShapeData.Source): void;

  static override fromSource(
    source: CircleShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): CircleShapeData;

  static override fromJSON(json: string): CircleShapeData;
}

declare namespace EllipseShapeData {
  interface Schema extends BaseShapeData.Schema<"ellipse"> {
    /**
     * The x-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the center point in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The x-radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radiusX: fields.NumberField<{ required: true; nullable: false; initial: undefined; positive: true }>;

    /**
     * The y-radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radiusY: fields.NumberField<{ required: true; nullable: false; initial: undefined; positive: true }>;

    /**
     * The rotation around the center of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData extends BaseShapeData<EllipseShapeData.Schema> {
  // Defined by `Object.defineProperty` in a static initialization block; despite no options being passed, and the base class defining
  // `static TYPE = ""`, because the SIB runs first, this is readonly.
  static override readonly TYPE: "ellipse";

  static override defineSchema(): EllipseShapeData.Schema;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<EllipseShapeData.Schema>;

  static override get schema(): fields.SchemaField<EllipseShapeData.Schema>;

  static override validateJoint(data: EllipseShapeData.Source): void;

  static override fromSource(
    source: EllipseShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): EllipseShapeData;

  static override fromJSON(json: string): EllipseShapeData;
}

declare namespace PolygonShapeData {
  interface Schema extends BaseShapeData.Schema<"polygon"> {
    /**
     * The points of the polygon ([x0, y0, x1, y1, ...]).
     * The polygon must not be self-intersecting.
     * @defaultValue `[]`
     */
    points: fields.ArrayField<
      fields.NumberField<{ required: true; nullable: false; initial: undefined }>,
      { validate: (value: []) => void }
    >;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData extends BaseShapeData<PolygonShapeData.Schema> {
  // Defined by `Object.defineProperty` in a static initialization block; despite no options being passed, and the base class defining
  // `static TYPE = ""`, because the SIB runs first, this is readonly.
  static override readonly TYPE: "polygon";

  static override defineSchema(): PolygonShapeData.Schema;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<PolygonShapeData.Schema>;

  static override get schema(): fields.SchemaField<PolygonShapeData.Schema>;

  static override validateJoint(data: PolygonShapeData.Source): void;

  static override fromSource(
    source: PolygonShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): PolygonShapeData;

  static override fromJSON(json: string): PolygonShapeData;
}

declare namespace TextureData {
  /** The parameter defaults for `srcOptions` in the {@link TextureData} constructor */
  interface DefaultOptions {
    categories: ["IMAGE", "VIDEO"];
    // Avoid using `EmptyObject` as that creates a broken index signature.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    initial: {};
    wildcard: false;
    label: "";
  }

  /**
   * The `initial` property of the `srcOptions` parameter of the {@linkcode TextureData} constructor
   * is not the `initial` for any one field, but instead is an object that gets parcelled out by key to the
   * fields of the schema
   *
   * @internal
   */
  type _SrcOptionsInitial<T> = {
    [K in keyof T]: fields.DataField.Options.InitialType<T[K]>;
  };

  /**
   * @remarks The keys picked directly are passed on to the `src: FilePathField` field, but `initial` is an object of initial values for
   * potentially every field in the schema.
   */
  interface SrcOptions extends Pick<fields.FilePathField.Options, "categories" | "wildcard" | "label"> {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    initial: _SrcOptionsInitial<fields.SchemaField.AssignmentData<Schema<DefaultOptions>>>;
  }

  interface Schema<Options extends SrcOptions = DefaultOptions> extends fields.DataSchema {
    /**
     * The URL of the texture source.
     * @defaultValue `initial.src ?? null`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    src: fields.FilePathField<{
      required: true;
      categories: NullishCoalesce<Options["categories"], DefaultOptions["categories"]>;
      initial: NullishCoalesce<GetKey<Options["initial"], "src", null>, null>;
      wildcard: NullishCoalesce<Options["wildcard"], DefaultOptions["wildcard"]>;
      virtual: _Not<NullishCoalesce<Options["wildcard"], DefaultOptions["wildcard"]>>;
      label: NullishCoalesce<Options["label"], DefaultOptions["label"]>;
    }>;

    /**
     * The X coordinate of the texture anchor.
     * @defaultValue `initial.anchorX ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    anchorX: fields.NumberField<{
      required: true;
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "anchorX", 0>, 0>;
    }>;

    /**
     * The Y coordinate of the texture anchor.
     * @defaultValue `initial.anchorY ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    anchorY: fields.NumberField<{
      required: true;
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "anchorY", 0>, 0>;
    }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetX ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    offsetX: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: NullishCoalesce<GetKey<Options["initial"], "offsetX", 0>, 0>;
    }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetY ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    offsetY: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: NullishCoalesce<GetKey<Options["initial"], "offsetY", 0>, 0>;
    }>;

    /**
     * @defaultValue `initial.fit ?? "fill"`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    fit: fields.StringField<
      {
        required: true;
        initial: NullishCoalesce<GetKey<Options["initial"], "fit", "fill">, "fill">;
        choices: typeof CONST.TEXTURE_DATA_FIT_MODES;
      },
      ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES> | null | undefined,
      ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES>,
      ValueOf<typeof CONST.TEXTURE_DATA_FIT_MODES>
    >;

    /**
     * The scale of the texture in the X dimension.
     * @defaultValue `initial.scaleX ?? 1`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    scaleX: fields.NumberField<{
      required: true;
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "scaleX", 1>, 1>;
    }>;

    /**
     * The scale of the texture in the Y dimension.
     * @defaultValue `initial.scaleY ?? 1`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    scaleY: fields.NumberField<{
      required: true;
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "scaleY", 1>, 1>;
    }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     * @defaultValue `initial.rotation ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    rotation: fields.AngleField<{
      initial: NullishCoalesce<GetKey<Options["initial"], "rotation", 0>, 0>;
    }>;

    /**
     * The tint applied to the texture.
     * @defaultValue `initial.tint ?? "#ffffff"`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    tint: fields.ColorField<{
      required: true;
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "tint", "#ffffff">, "#ffffff">;
    }>;

    /**
     * Only pixels with an alpha value at or above this value are consider solid
     * w.r.t. to occlusion testing and light/weather blocking.
     * @defaultValue `initial.alphaThreshold ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@linkcode TextureData} constructor
     */
    alphaThreshold: fields.AlphaField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "alphaThreshold", 0>, 0>;
    }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * A {@linkcode fields.SchemaField} subclass used to represent texture data.
 */
declare class TextureData<
  const SrcOptions extends TextureData.SrcOptions = TextureData.DefaultOptions,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const SchemaOptions extends fields.SchemaField.Options<TextureData.Schema<SrcOptions>> = {},
> extends fields.SchemaField<TextureData.Schema<SrcOptions>, SchemaOptions> {
  /**
   * @param options    - Options which are forwarded to the SchemaField constructor
   * @param srcOptions - Additional options for the src field
   */
  constructor(options?: SchemaOptions, srcOptions?: SrcOptions);
}

declare namespace PrototypeToken {
  type Parent = Actor.Implementation | null;

  /**
   * The fields foundry omits from the BaseToken schema. Not used, left as reference
   *
   * @internal
   */
  type ExcludedProperties =
    | "_id"
    | "actorId"
    | "delta"
    | "x"
    | "y"
    | "elevation"
    | "shape"
    | "sort"
    | "hidden"
    | "locked"
    | "_movementHistory"
    | "_regions";

  /**
   * @remarks This has `PrototypeToken.#applyDefaultTokenSettings` run on it before actually being returned, so `initial`
   * values may not be exactly accurate as typed
   * @privateRemarks Since the {@link TokenDocument.Schema | `TokenDocument` schema} also extends `SharedProtoSchema`,
   * overrides & extensions specific to {@linkcode PrototypeToken} must go here
   */
  interface Schema extends TokenDocument.SharedProtoSchema {
    /**
     * The name used to describe the Token
     * @defaultValue `""`
     * @privateRemarks Only change from parent schema is `textSearch: false`
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: false }>;

    /**
     * Does the prototype token use a random wildcard image?
     * @defaultValue `false`
     * @privateRemarks New field, not in parent schema
     */
    randomImg: fields.BooleanField;

    appendNumber: fields.BooleanField;

    prependAdjective: fields.BooleanField;
  }

  /**
   * @deprecated Replace with {@linkcode PrototypeToken.CreateData}.
   */
  type ConstructorData = CreateData;

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  export import Flags = TokenDocument.Flags;
}

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 */
declare class PrototypeToken extends DataModel<PrototypeToken.Schema, PrototypeToken.Parent> {
  constructor(...args: DataModel.ConstructorArgs<PrototypeToken.Schema, PrototypeToken.Parent>);

  /**
   * @defaultValue `{}`
   * @remarks Created via `defineProperty` in constructor without options.
   * Since it isn't defined in the class body, it's readonly.
   */
  readonly apps: Record<string, foundry.appv1.api.Application.Any | foundry.applications.api.ApplicationV2.Any>;

  static override defineSchema(): PrototypeToken.Schema;

  /** @defaultValue `["DOCUMENT", "TOKEN"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): this["parent"];

  override toObject(source?: boolean): PrototypeToken.Source & { actorId: string | null | undefined };

  static get database(): CONFIG["DatabaseBackend"];

  override _initializeSource(
    data: PrototypeToken.CreateData | PrototypeToken,
    options?: DataModel.InitializeSourceOptions,
  ): PrototypeToken.Source;

  /**
   * @see {@linkcode Document.update | foundry.abstract.Document#update}
   * @remarks Forwards to {@linkcode Actor.update | this.actor.update} after wrapping `data` in `{prototypeToken: data}`
   */
  update(
    data: PrototypeToken.UpdateData | undefined,
    operation?: Actor.Database.UpdateOneDocumentOperation,
  ): Promise<Actor.Implementation | undefined>;

  /**
   * @see {@linkcode Document.getFlag | foundry.abstract.Document#getFlag}
   */
  getFlag<Scope extends PrototypeToken.Flags.Scope, Key extends PrototypeToken.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): PrototypeToken.Flags.Get<Scope, Key>;

  /**
   * @see {@linkcode Document.setFlag | foundry.abstract.Document#setFlag}
   */
  setFlag<
    Scope extends PrototypeToken.Flags.Scope,
    Key extends PrototypeToken.Flags.Key<Scope>,
    Value extends PrototypeToken.Flags.Get<Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  /**
   * @see {@linkcode Document.unsetFlag | foundry.abstract.Document#unsetFlag}
   */
  unsetFlag<Scope extends PrototypeToken.Flags.Scope, Key extends PrototypeToken.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  /**
   * @see {@linkcode Document.testUserPermission | foundry.abstract.Document#testUserPermission}
   * @remarks Forwards to {@linkcode Actor.testUserPermission | this.actor.testUserPermission}. Core's `Actor` implementation
   * doesn't override this method, so without further extension, that's equivalent to `Document#testUserPermission`
   */
  testUserPermission(
    user: User.Implementation,
    permission: Document.ActionPermission,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * @see {@linkcode Document.isOwner | foundry.abstract.Document#isOwner}
   */
  get isOwner(): boolean;

  /**
   * @remarks This is monkey patched in from `client/client.mjs`, put here due to issues with the merge process.
   * See {@linkcode TokenDocument.getBarAttribute | TokenDocument#getBarAttribute}.
   */
  getBarAttribute: ToMethod<TokenDocument.Implementation["getBarAttribute"]>;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<PrototypeToken.Schema>;

  static override get schema(): fields.SchemaField<PrototypeToken.Schema>;

  static override validateJoint(data: PrototypeToken.Source): void;

  static override fromSource(source: PrototypeToken.CreateData, context?: DataModel.FromSourceOptions): PrototypeToken;

  static override fromJSON(json: string): PrototypeToken;
}

declare class PrototypeTokenOverrides extends DataModel<PrototypeTokenOverrides.Schema> {
  static override defineSchema(): PrototypeTokenOverrides.Schema;

  /**
   * Localize all non-recursive data fields on first load of the application.
   * @param fields - Subfields of a recursive field
   * @param cache  - A running cache of localization results (default: `{}`)
   * @remarks `fields` defaults to all the fields of the various {@linkcode PrototypeTokenOverrides.ActorSubTypeSchema}s
   */
  static localizeFields(fields?: fields.DataField[], cache?: Record<string, string>): void;

  /** @defaultValue `["TOKEN"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**The named of the world setting that stores the prototype token overrides */
  static SETTING: PrototypeTokenOverrides.SETTING;

  /** A cached copy of the currently-configured overrides */
  static get overrides(): PrototypeTokenOverrides;

  /**
   * Set or clear the cached overrides.
   * @remarks If passing `null`, the next access of the getter will pull a fresh instance from the setting.
   */
  static set overrides(value: PrototypeTokenOverrides | null);

  /**
   * Apply configured overrides to prototype token data.
   * @param source    - The prototype token source data on which to operate
   * @param actorType - The prototype parent's actor type: used to retrieve type-specific overrides
   */
  static applyOverrides(source: PrototypeToken.CreateData, actorType: Actor.SubType): void;

  /** Apply configured overrides to all Actor documents within the World. */
  static applyAll(): void;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<PrototypeToken.Schema>;

  static override get schema(): fields.SchemaField<PrototypeToken.Schema>;

  static override validateJoint(data: PrototypeToken.Source): void;

  static override fromSource(source: PrototypeToken.CreateData, context?: DataModel.FromSourceOptions): PrototypeToken;

  static override fromJSON(json: string): PrototypeToken;

  static #PrototypeTokenOverrides: true;
}

declare namespace PrototypeTokenOverrides {
  interface Schema extends fields.DataSchema, Record<Actor.SubType, fields.SchemaField<ActorSubTypeSchema>> {}

  interface ActorSubTypeSchema extends fields.DataSchema {
    sight: fields.SchemaField<SightSchema>;

    ring: fields.SchemaField<RingSchema>;

    /** @privateRemarks See {@linkcode TurnMarkerSchema} */
    turnMarker: fields.SchemaField<TurnMarkerSchema>;

    // at runtime this field is copied from PrototypeToken.Schema then edited
    displayName: fields.NumberField<
      {
        required: false;
        initial: undefined;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
        label: "TOKEN.FIELDS.displayName.label";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    // at runtime this field is copied from PrototypeToken.Schema then edited
    displayBars: fields.NumberField<
      {
        required: false;
        choices: CONST.TOKEN_DISPLAY_MODES[];
        initial: undefined;
        validationError: "must be a value in CONST.TOKEN_DISPLAY_MODES";
        label: "TOKEN.FIELDS.displayBars.label";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPLAY_MODES | null | undefined,
      CONST.TOKEN_DISPLAY_MODES,
      CONST.TOKEN_DISPLAY_MODES
    >;

    // at runtime this field is copied from PrototypeToken.Schema then edited
    disposition: fields.NumberField<
      {
        required: false;
        choices: CONST.TOKEN_DISPOSITIONS[];
        initial: undefined;
        validationError: "must be a value in CONST.TOKEN_DISPOSITIONS";
        label: "TOKEN.FIELDS.disposition.label";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_DISPOSITIONS | null | undefined,
      CONST.TOKEN_DISPOSITIONS,
      CONST.TOKEN_DISPOSITIONS
    >;

    // at runtime this field is copied from PrototypeToken.Schema then edited
    lockRotation: fields.BooleanField<{
      required: false;
      initial: undefined;
      label: "TOKEN.FIELDS.lockRotation.label";
    }>;
  }

  /**
   * @privateRemarks At runtime, these fields are copied from {@linkcode TokenDocument.TurnMarkerSchema} then edited.
   */
  interface TurnMarkerSchema extends fields.DataSchema {
    mode: fields.NumberField<
      {
        required: false;
        choices: CONST.TOKEN_TURN_MARKER_MODES[];
        initial: undefined;
        validationError: "must be a value in CONST.TOKEN_TURN_MARKER_MODES";
        label: "TOKEN.FIELDS.turnMarker.mode.label";
      },
      // FIXME: Without these overrides, the branded type from `choices` is not respected, and the field types as `number`
      CONST.TOKEN_TURN_MARKER_MODES | null | undefined,
      CONST.TOKEN_TURN_MARKER_MODES,
      CONST.TOKEN_TURN_MARKER_MODES
    >;

    animation: fields.StringField<{
      required: false;
      blank: false;
      nullable: true;
      initial: undefined;
      label: "TOKEN.FIELDS.turnMarker.animation.label";
    }>;

    src: fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      required: false;
      initial: undefined;
      label: "TOKEN.FIELDS.turnMarker.src.label";
    }>;

    disposition: fields.BooleanField<{
      required: false;
      initial: undefined;
      label: "TOKEN.FIELDS.turnMarker.disposition.label";
    }>;
  }

  interface SightSchema extends fields.DataSchema {
    enabled: fields.BooleanField<{ required: false; initial: undefined; label: "TOKEN.FIELDS.sight.enabled.label" }>;
  }

  interface RingSchema extends fields.DataSchema {
    enabled: fields.BooleanField<{ required: false; initial: undefined; label: "TOKEN.FIELDS.ring.enabled.label" }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}

  type SETTING = "prototypeTokenOverrides";
}

declare namespace TombstoneData {
  interface Schema extends fields.DataSchema {
    /**
     * The _id of the base Document that this tombstone represents.
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * A property that identifies this entry as a tombstone.
     * @defaultValue `true`
     */
    _tombstone: fields.BooleanField<{
      initial: true;
      validate: (v: unknown) => boolean;
      validationError: "must be true";
    }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * A minimal data model used to represent a tombstone entry inside an EmbeddedCollectionDelta.
 */
declare class TombstoneData extends DataModel<TombstoneData.Schema> {
  static override defineSchema(): TombstoneData.Schema;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<TombstoneData.Schema>;

  static override get schema(): fields.SchemaField<TombstoneData.Schema>;

  static override validateJoint(data: TombstoneData.Source): void;

  static override fromSource(source: TombstoneData.CreateData, context?: DataModel.FromSourceOptions): TombstoneData;

  static override fromJSON(json: string): TombstoneData;
}

export {
  LightData,
  PrototypeToken,
  PrototypeTokenOverrides,
  ShapeData,
  BaseShapeData,
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  PolygonShapeData,
  TextureData,
  TombstoneData,
};

type _Not<T extends boolean> = T extends true ? false : true;
