import type { DatabaseBackend } from "../abstract/module.d.mts";
import type { DataModel } from "../abstract/data.d.mts";
import type { fields } from "./module.d.mts";
import type * as documents from "../documents/_module.d.mts";
import type { AnyObject, EmptyObject, ToMethod, ValueOf } from "../../../utils/index.d.mts";
import type { FilePathField } from "./fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

// TODO: Implement all of the necessary options

declare global {
  type LightAnimationData = fields.SchemaField.InitializedData<LightData.LightAnimationDataSchema>;
}

declare namespace LightData {
  type Parent = TokenDocument | AmbientLightDocument;

  interface LightAnimationDataSchema extends DataSchema {
    /**
     * The animation type which is applied
     * @defaultValue `null`
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

  interface DarknessSchema extends DataSchema {
    /**
     * @defaultValue `0`
     */
    min: fields.NumberField<{ initial: 0 }>;

    /**
     * @defaultValue `1`
     */
    max: fields.NumberField<{ initial: 1 }>;
  }

  interface Schema extends DataSchema {
    /**
     * Is this light source a negative source? (i.e. darkness source)
     * @defaultValue `false`
     */
    negative: fields.BooleanField;

    /**
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
        validate: (d: fields.SchemaField.AssignmentData<DarknessSchema>) => boolean;
        validationError: "darkness.max may not be less than darkness.min";
      }
    >;
  }
}

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
declare class LightData extends DataModel<LightData.Schema, LightData.Parent> {
  static override defineSchema(): LightData.Schema;

  /**
   * @defaultValue `["LIGHT"]`
   */
  static override LOCALIZATION_PREFIXES: string[];

  static migrateData(source: AnyObject): AnyObject;
}

declare namespace ShapeData {
  interface Schema extends DataSchema {
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
    width: fields.NumberField<{ required: false; integer: true; min: 0 }>;

    /**
     * For rectangles, the pixel width of the shape.
     * @defaultValue `null`
     */
    height: fields.NumberField<{ required: false; integer: true; min: 0 }>;

    /**
     * For circles, the pixel radius of the shape.
     * @defaultValue `null`
     */
    radius: fields.NumberField<{ required: false; integer: true; positive: true }>;

    /**
     * For polygons, the array of polygon coordinates which comprise the shape.
     * @defaultValue `[]`
     */
    points: fields.ArrayField<fields.NumberField<{ nullable: false }>>;
  }

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
}

declare namespace BaseShapeData {
  interface Schema extends DataSchema {
    /**
     * The type of shape, a value in BaseShapeData.TYPES.
     * @defaultValue `this.TYPE`
     */
    type: fields.StringField<{
      required: true;
      blank: false;
      initial: string;
      validate: (value: string) => boolean;
      validationError: `must be equal to "${string}"`;
    }>;

    /**
     * Is this shape a hole?
     * @defaultValue `false`
     */
    hole: fields.BooleanField;
  }

  interface Types extends foundry.data.fields.TypedSchemaField.Types {
    rectangle: typeof RectangleShapeData;
    circle: typeof CircleShapeData;
    ellipse: typeof EllipseShapeData;
    polygon: typeof PolygonShapeData;
  }
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
declare abstract class BaseShapeData extends DataModel<BaseShapeData.Schema> {
  /**
   * The possible shape types.
   */
  static get TYPES(): Readonly<BaseShapeData.Types>;

  static #TYPES: Readonly<BaseShapeData.Types>;

  /**
   * The type of this shape.
   */
  static TYPE: string;

  static override defineSchema(): BaseShapeData.Schema;
}

declare namespace RectangleShapeData {
  interface Schema extends BaseShapeData.Schema {
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
}

/**
 * The data model for a rectangular shape.
 */
declare class RectangleShapeData extends BaseShapeData {
  /**
   * @defaultValue `"rectangle"`
   */
  static override TYPE: string;

  static override defineSchema(): RectangleShapeData.Schema;
}

declare namespace CircleShapeData {
  interface Schema extends BaseShapeData.Schema {
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
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData extends BaseShapeData {
  /**
   * @defaultValue `"circle"`
   */
  static override TYPE: string;

  static override defineSchema(): CircleShapeData.Schema;
}

declare namespace EllipseShapeData {
  interface Schema extends BaseShapeData.Schema {
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
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData extends BaseShapeData {
  /**
   * @defaultValue `"ellipse"`
   */
  static override TYPE: string;

  static override defineSchema(): EllipseShapeData.Schema;
}

declare namespace PolygonShapeData {
  interface Schema extends BaseShapeData.Schema {
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
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData extends BaseShapeData {
  /**
   * @defaultValue `"polygon"`
   */
  static override TYPE: string;

  static override defineSchema(): PolygonShapeData.Schema;
}

declare namespace TextureData {
  interface DefaultOptions {
    categories: ["IMAGE", "VIDEO"];
    // initial: {};
    wildcard: false;
    label: "";
  }

  interface Schema<SrcOptions extends FilePathField.Options> extends DataSchema {
    /**
     * The URL of the texture source.
     * @defaultValue `initial.src ?? null`
     */
    src: fields.FilePathField<SrcOptions>;

    /**
     * The X coordinate of the texture anchor.
     * @defaultValue `initial.anchorX ?? 0`
     */
    anchorX: fields.NumberField<{ nullable: false; initial: number }>;

    /**
     * The Y coordinate of the texture anchor.
     * @defaultValue `initial.anchorY ?? 0`
     */
    anchorY: fields.NumberField<{ nullable: false; initial: number }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetX ?? 0`
     */
    offsetX: fields.NumberField<{ nullable: false; integer: true; initial: number }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetY ?? 0`
     */
    offsetY: fields.NumberField<{ nullable: false; integer: true; initial: number }>;

    /**
     * @defaultValue `initial.fit ?? "fill"`
     */
    fit: fields.StringField<{ initial: string; choices: typeof CONST.TEXTURE_DATA_FIT_MODES }>;

    /**
     * The scale of the texture in the X dimension.
     * @defaultValue `initial.scaleX ?? 1`
     */
    scaleX: fields.NumberField<{ nullable: false; initial: number }>;

    /**
     * The scale of the texture in the Y dimension.
     * @defaultValue `initial.scaleY ?? 1`
     */
    scaleY: fields.NumberField<{ nullable: false; initial: number }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     * @defaultValue `initial.rotation ?? 0`
     */
    rotation: fields.AngleField<{ initial: number }>;

    /**
     * The tint applied to the texture.
     * @defaultValue `initial.tint ?? "#ffffff"`
     */
    tint: fields.ColorField<{ nullable: false; initial: string }>;

    /**
     * Only pixels with an alpha value at or above this value are consider solid
     * w.r.t. to occlusion testing and light/weather blocking.
     * @defaultValue `initial.alphaThreshold ?? 0`
     */
    alphaThreshold: fields.AlphaField<{ nullable: false; initial: number }>;
  }
}

/**
 * A {@link fields.SchemaField} subclass used to represent texture data.
 */
declare class TextureData<
  SrcOptions extends FilePathField.Options = TextureData.DefaultOptions,
  SchemaOptions extends fields.SchemaField.Options<TextureData.Schema<SrcOptions>> = EmptyObject,
> extends fields.SchemaField<TextureData.Schema<SrcOptions>, SchemaOptions> {
  /**
   * @param options    - Options which are forwarded to the SchemaField constructor
   * @param srcOptions - Additional options for the src field
   */
  constructor(options?: SchemaOptions, srcOptions?: SrcOptions);
}

declare namespace PrototypeToken {
  type Parent = documents.BaseActor;

  // Not otherwise used
  type ExcludedProperties =
    | "_id"
    | "actorId"
    | "delta"
    | "x"
    | "y"
    | "elevation"
    | "sort"
    | "hidden"
    | "locked"
    | "_regions";

  interface Schema extends TokenDocument.SharedProtoSchema {
    name: fields.StringField<{ required: true; blank: true; textSearch: boolean }>;

    /**
     * Does the prototype token use a random wildcard image?
     * @defaultValue `false`
     */
    randomImg: fields.BooleanField;
  }

  type ConstructorData = fields.SchemaField.AssignmentData<Schema>;
}

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 */
declare class PrototypeToken extends DataModel<PrototypeToken.Schema, any> {
  constructor(data?: PrototypeToken.ConstructorData, options?: DataModel.DataValidationOptions<PrototypeToken.Parent>);

  declare parent: PrototypeToken.Parent;

  /** @defaultValue `{}` */
  apps: Record<string, Application.Any>;

  static override defineSchema(): PrototypeToken.Schema;

  /**
   * @defaultValue `["TOKEN"]`
   */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): this["parent"];

  override toObject(source: true): this["_source"] & { actorId: string | undefined };
  override toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

  static get database(): DatabaseBackend;

  /**
   * Apply configured default token settings to the schema.
   * @param schema - The schema to apply the settings to.
   */
  static #applyDefaultTokenSettings(schema: DataSchema): void;

  /**
   * @see foundry.abstract.Document#update
   */
  update(data: unknown, options: unknown): unknown;

  /**
   * @see foundry.abstract.Document#getFlag
   */
  getFlag(args: unknown): unknown;

  /**
   * @see foundry.abstract.Document#setFlag
   */
  setFlag(args: unknown): unknown;

  /**
   * @see foundry.abstract.Document#unsetFlag
   */
  unsetFlag(args: unknown): Promise<unknown>;

  /**
   * @see foundry.abstract.Document#testUserPermission
   */
  testUserPermission(
    user: User.Implementation,
    permission: unknown,
    { exact }: { exact: boolean },
  ): ReturnType<this["actor"]["testUserPermission"]>;

  /**
   * @see foundry.abstract.Document#isOwner
   */
  get isOwner(): boolean;

  /**
   * @see TokenDocument#getBarAttribute
   *
   * @remarks This is monkey patched in from `token.js`, put here due to issues with the merge process
   */
  getBarAttribute: ToMethod<TokenDocument["getBarAttribute"]>;
}

declare namespace TombstoneData {
  interface Schema extends DataSchema {
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
      validate: (v: boolean) => boolean;
      validationError: "must be true";
    }>;
  }
}

/**
 * A minimal data model used to represent a tombstone entry inside an EmbeddedCollectionDelta.
 */
declare class TombstoneData extends DataModel<TombstoneData.Schema> {
  static override defineSchema(): TombstoneData.Schema;
}

export {
  LightData,
  PrototypeToken,
  ShapeData,
  BaseShapeData,
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  PolygonShapeData,
  TextureData,
  TombstoneData,
};
