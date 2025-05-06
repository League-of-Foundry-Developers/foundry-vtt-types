import type { DataModel } from "../abstract/data.d.mts";
import type {
  AnyMutableObject,
  EmptyObject,
  GetKey,
  NullishCoalesce,
  RemoveIndexSignatures,
  ToMethod,
  ValueOf,
} from "fvtt-types/utils";
import fields = foundry.data.fields;
import documents = foundry.documents;
import Document = foundry.abstract.Document;
import type { SchemaField } from "./fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

declare namespace LightData {
  type Parent = TokenDocument.Implementation | AmbientLightDocument.Implementation;

  interface LightAnimationDataSchema extends DataSchema {
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

  interface DarknessSchema extends DataSchema {
    /**
     * @defaultValue `0`
     */
    min: fields.AlphaField<{ initial: 0 }>;

    /**
     * @defaultValue `1`
     */
    max: fields.AlphaField<{ initial: 1 }>;
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
     * @remarks This should match the `id` of the desired property of {@link AdaptiveLightingShader.SHADER_TECHNIQUES | `AdaptiveLightingShader.SHADER_TECHNIQUES`}
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
   * - negative `luminosity`s to `1 - luminosity` and setting `negative` true
   */
  static override migrateData(source: AnyMutableObject): AnyMutableObject;
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
  interface Schema<ShapeType extends ShapeTypes = ShapeTypes> extends DataSchema {
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
declare abstract class BaseShapeData<
  ShapeSchema extends BaseShapeData.Schema = BaseShapeData.Schema,
> extends DataModel<ShapeSchema> {
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
}

/**
 * The data model for a rectangular shape.
 */
declare class RectangleShapeData extends BaseShapeData<RectangleShapeData.Schema> {
  static override TYPE: "rectangle";

  static override defineSchema(): RectangleShapeData.Schema;
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
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData extends BaseShapeData<CircleShapeData.Schema> {
  static override TYPE: "circle";

  static override defineSchema(): CircleShapeData.Schema;
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
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData extends BaseShapeData<EllipseShapeData.Schema> {
  static override TYPE: "ellipse";

  static override defineSchema(): EllipseShapeData.Schema;
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
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData extends BaseShapeData<PolygonShapeData.Schema> {
  static override TYPE: "polygon";

  static override defineSchema(): PolygonShapeData.Schema;
}

declare namespace TextureData {
  /** The parameter defaults for `srcOptions` in the {@link TextureData} constructor */
  interface DefaultOptions {
    categories: ["IMAGE", "VIDEO"];
    initial: EmptyObject;
    wildcard: false;
    label: "";
  }

  /**
   * @internal
   * The `initial` property of the `srcOptions` parameter of the {@link TextureData | `TextureData`} constructor
   * is not the `initial` for any one field, but instead is an object that gets parcelled out by key to the
   * fields of the schema
   */
  type _SrcOptionsInitial<T> = {
    [K in keyof T]: fields.DataField.Options.InitialType<T[K]>;
  };

  /** @remarks The keys picked directly are passed on to the `src: FilePathField` field, but `initial` is an object of initial values for potentially every field in the schema */
  interface SrcOptions extends Pick<fields.FilePathField.Options, "categories" | "wildcard" | "label"> {
    initial: _SrcOptionsInitial<fields.SchemaField.AssignmentData<Schema<DefaultOptions>>>;
  }

  interface Schema<Options extends SrcOptions = DefaultOptions> extends DataSchema {
    /**
     * The URL of the texture source.
     * @defaultValue `initial.src ?? null`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    src: fields.FilePathField<{
      categories: NullishCoalesce<Options["categories"], DefaultOptions["categories"]>;
      initial: NullishCoalesce<GetKey<Options["initial"], "src", null>, null>;
      wildcard: NullishCoalesce<Options["wildcard"], DefaultOptions["wildcard"]>;
      label: NullishCoalesce<Options["label"], DefaultOptions["label"]>;
    }>;

    /**
     * The X coordinate of the texture anchor.
     * @defaultValue `initial.anchorX ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    anchorX: fields.NumberField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "anchorX", 0>, 0>;
    }>;

    /**
     * The Y coordinate of the texture anchor.
     * @defaultValue `initial.anchorY ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    anchorY: fields.NumberField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "anchorY", 0>, 0>;
    }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetX ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    offsetX: fields.NumberField<{
      nullable: false;
      integer: true;
      initial: NullishCoalesce<GetKey<Options["initial"], "offsetX", 0>, 0>;
    }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     * @defaultValue `initial.offsetY ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    offsetY: fields.NumberField<{
      nullable: false;
      integer: true;
      initial: NullishCoalesce<GetKey<Options["initial"], "offsetY", 0>, 0>;
    }>;

    /**
     * @defaultValue `initial.fit ?? "fill"`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    fit: fields.StringField<
      {
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
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    scaleX: fields.NumberField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "scaleX", 1>, 1>;
    }>;

    /**
     * The scale of the texture in the Y dimension.
     * @defaultValue `initial.scaleY ?? 1`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    scaleY: fields.NumberField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "scaleY", 1>, 1>;
    }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     * @defaultValue `initial.rotation ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    rotation: fields.AngleField<{
      initial: NullishCoalesce<GetKey<Options["initial"], "rotation", 0>, 0>;
    }>;

    /**
     * The tint applied to the texture.
     * @defaultValue `initial.tint ?? "#ffffff"`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    tint: fields.ColorField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "tint", "#ffffff">, "#ffffff">;
    }>;
    /**
     * Only pixels with an alpha value at or above this value are consider solid
     * w.r.t. to occlusion testing and light/weather blocking.
     * @defaultValue `initial.alphaThreshold ?? 0`
     * @remarks The `initial` in the above default value is the property from the `srcOptions`
     * parameter of the {@link TextureData | `TextureData`} constructor
     */
    alphaThreshold: fields.AlphaField<{
      nullable: false;
      initial: NullishCoalesce<GetKey<Options["initial"], "alphaThreshold", 0>, 0>;
    }>;
  }
}

/**
 * A {@link fields.SchemaField | `fields.SchemaField`} subclass used to represent texture data.
 */
declare class TextureData<
  SrcOptions extends TextureData.SrcOptions = TextureData.DefaultOptions,
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

  /**
   * @internal
   * The fields foundry omits from the BaseToken schema. Not used, left as reference
   */
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

  /**
   * @remarks This has `PrototypeToken.#applyDefaultTokenSettings` run on it before actually being returned, so `initial`
   * values may not be exactly accurate as typed
   * @privateRemarks Since the {@link TokenDocument.Schema | `TokenDocument` schema} also extends `SharedProtoSchema`,
   * overrides & extensions specific to {@link PrototypeToken | `PrototypeToken`} must go here
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
  }

  /**
   * {@link PrototypeToken.CreateData | `PrototypeToken.CreateData`}
   */
  type ConstructorData = CreateData;

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 */
declare class PrototypeToken extends DataModel<PrototypeToken.Schema, PrototypeToken.Parent> {
  // options: not null (destructured when passed to super)
  constructor(
    data?: PrototypeToken.ConstructorData | null,
    options?: DataModel.ConstructionContext<PrototypeToken.Parent>,
  );

  /**
   * @defaultValue `{}`
   * @remarks Created via `defineProperty` in constructor
   */
  apps: Record<string, Application.Any | foundry.applications.api.ApplicationV2.Any>;

  static override defineSchema(): PrototypeToken.Schema;

  /**
   * @defaultValue `["TOKEN"]`
   */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): this["parent"];

  override toObject(
    source?: boolean | null,
  ): SchemaField.SourceData<PrototypeToken.Schema> & { actorId: string | undefined };

  static get database(): CONFIG["DatabaseBackend"];

  /**
   * Apply configured default token settings to the schema.
   * @param schema - The schema to apply the settings to.
   */
  static #applyDefaultTokenSettings(schema: DataSchema): void;

  /**
   * @see {@link foundry.abstract.Document.update | `foundry.abstract.Document#update`}
   * @remarks Despite the above `@see`, forwards to {@link Actor.update | `this.actor.update`} after wrapping `data`
   * in `{prototypeToken: data}`
   */
  update(
    data: PrototypeToken.UpdateData | undefined,
    operation?: Actor.Database.UpdateOperation,
  ): Promise<Actor.Implementation | undefined>;

  // TODO: Type PrototypeToken flags separately from TokenDocument flags?
  /**
   * @see {@link foundry.abstract.Document.getFlag | `foundry.abstract.Document#getFlag`}
   */
  getFlag<Scope extends TokenDocument.Flags.Scope, Key extends TokenDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Document.GetFlag<TokenDocument.Name, Scope, Key>;

  /**
   * @see {@link foundry.abstract.Document.setFlag | `foundry.abstract.Document#setFlag`}
   */
  setFlag<
    Scope extends TokenDocument.Flags.Scope,
    Key extends TokenDocument.Flags.Key<Scope>,
    Value extends Document.GetFlag<TokenDocument.Name, Scope, Key>,
  >(scope: Scope, key: Key, value: Value): Promise<this>;

  /**
   * @see {@link foundry.abstract.Document.unsetFlag | `foundry.abstract.Document#unsetFlag`}
   */
  unsetFlag<Scope extends TokenDocument.Flags.Scope, Key extends TokenDocument.Flags.Key<Scope>>(
    scope: Scope,
    key: Key,
  ): Promise<this>;

  /**
   * @see {@link Document.testUserPermission | `Document#testUserPermission`}
   * @remarks Forwards to {@link Actor.testUserPermission | `this.actor.testUserPermission`}. Core's `Actor` implementation
   * doesn't override this method, so without further extension, that's equivalent to `Document#testUserPermission`
   */
  // options: not null (destructured)
  testUserPermission(
    user: User.Implementation,
    permission: Document.TestableOwnershipLevel,
    options?: Document.TestUserPermissionOptions,
  ): boolean;

  /**
   * @see {@link foundry.abstract.Document.isOwner | `foundry.abstract.Document#isOwner`}
   */
  get isOwner(): boolean;

  /**
   * @see {@link TokenDocument.getBarAttribute | `TokenDocument#getBarAttribute`}
   *
   * @remarks This is monkey patched in from `token.js`, put here due to issues with the merge process
   */
  getBarAttribute: ToMethod<TokenDocument.Implementation["getBarAttribute"]>;
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
      validate: (v: unknown) => boolean;
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
