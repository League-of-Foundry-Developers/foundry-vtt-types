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
    min: fields.AlphaField<{ initial: 0; placeholder: "0" }>;

    /**
     * @defaultValue `1`
     */
    max: fields.AlphaField<{ initial: 1; placeholder: "1" }>;
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
     * @defaultValue `360`
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

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<LightData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<LightData.Schema>;

  // fake type override
  static override validateJoint(data: LightData.Source): void;

  // fake type override
  static override fromSource(source: LightData.CreateData, context?: DataModel.FromSourceOptions): LightData;

  // fake type override
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
    width: fields.NumberField<{ required: true; integer: true; min: 0 }>;

    /**
     * For rectangles, the pixel width of the shape.
     * @defaultValue `null`
     */
    height: fields.NumberField<{ required: true; integer: true; min: 0 }>;

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

  // fake type override
  static override _schema: fields.SchemaField<ShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<ShapeData.Schema>;

  // fake type override
  static override validateJoint(data: ShapeData.Source): void;

  // fake type override
  static override fromSource(source: ShapeData.CreateData, context?: DataModel.FromSourceOptions): ShapeData;

  // fake type override
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
      // TODO: Remove `choices` once `validate` can narrow the field to `ShapeType`.
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
    emanation: typeof EmanationShapeData;
    cone: typeof ConeShapeData;
    ring: typeof RingShapeData;
    line: typeof LineShapeData;
    polygon: typeof PolygonShapeData;
    token: typeof TokenShapeData;
    grid: typeof GridShapeData;
  }

  /** @see {@linkcode EmanationShapeData.Schema.base} */
  type EmanationBaseTypes = Omit<Types, "emanation" | "ring">;
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
declare abstract class BaseShapeData<
  ShapeSchema extends BaseShapeData.Schema = BaseShapeData.Schema,
> extends DataModel<ShapeSchema> {
  /**
   * The rotation
   * @defaultValue `0`
   * @remarks Not part of the schema for shape types which don't define their own `rotation` field
   * (e.g. {@linkcode CircleShapeData}); this fallback default is applied directly in the constructor.
   */
  rotation: number;

  /** @defaultValue `["SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

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
   * See {@linkcode foundry.data.fields.ShapesField | ShapesField}.
   * @internal
   */
  _index: number | undefined;

  static #BaseShapeData: true;
}

declare namespace RectangleShapeData {
  interface Schema extends BaseShapeData.Schema<"rectangle"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The width of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The height of the rectangle in pixels.
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The x-coordinate of the anchor.
     * @defaultValue `0`
     */
    anchorX: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate of the anchor.
     * @defaultValue `0`
     */
    anchorY: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The rotation around the origin of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a rectangle shape.
 */
declare class RectangleShapeData<
  Schema extends RectangleShapeData.Schema = RectangleShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.rectangle", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "rectangle";

  static override defineSchema(): RectangleShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<RectangleShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<RectangleShapeData.Schema>;

  // fake type override
  static override validateJoint(data: RectangleShapeData.Source): void;

  // fake type override
  static override fromSource(
    source: RectangleShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): RectangleShapeData;

  // fake type override
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
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a circle shape.
 */
declare class CircleShapeData<
  Schema extends CircleShapeData.Schema = CircleShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.circle", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "circle";

  static override defineSchema(): CircleShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<CircleShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<CircleShapeData.Schema>;

  // fake type override
  static override validateJoint(data: CircleShapeData.Source): void;

  // fake type override
  static override fromSource(
    source: CircleShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): CircleShapeData;

  // fake type override
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
    radiusX: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The y-radius of the circle in pixels.
     * @defaultValue `undefined`
     */
    radiusY: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The rotation around the center of the rectangle in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for an ellipse shape.
 */
declare class EllipseShapeData<
  Schema extends EllipseShapeData.Schema = EllipseShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.ellipse", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "ellipse";

  static override defineSchema(): EllipseShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<EllipseShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<EllipseShapeData.Schema>;

  // fake type override
  static override validateJoint(data: EllipseShapeData.Source): void;

  // fake type override
  static override fromSource(
    source: EllipseShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): EllipseShapeData;

  // fake type override
  static override fromJSON(json: string): EllipseShapeData;
}

declare namespace EmanationShapeData {
  interface Schema extends BaseShapeData.Schema<"emanation"> {
    /**
     * The base shape of the emanation.
     */
    base: fields.TypedSchemaField<BaseShapeData.EmanationBaseTypes>;

    /**
     * The radius of the emanation in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for an emanation shape.
 */
declare class EmanationShapeData<
  Schema extends EmanationShapeData.Schema = EmanationShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.emanation", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "emanation";

  static override defineSchema(): EmanationShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<EmanationShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<EmanationShapeData.Schema>;

  // fake type override
  static override validateJoint(data: EmanationShapeData.Source): void;

  // fake type override
  static override fromSource(
    source: EmanationShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): EmanationShapeData;

  // fake type override
  static override fromJSON(json: string): EmanationShapeData;
}

declare namespace ConeShapeData {
  interface Schema extends BaseShapeData.Schema<"cone"> {
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
     * The radius of the cone in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The angle of the cone in degrees.
     * @defaultValue `undefined`
     */
    angle: fields.AngleField<{ initial: undefined; min: 0; normalize: false }>;

    /**
     * The direction of the cone in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The curvature.
     * @defaultValue `"round"`
     */
    curvature: fields.StringField<{
      required: true;
      initial: "round";
      choices: {
        round: "SHAPE.TYPES.cone.CURVATURES.round.label";
        flat: "SHAPE.TYPES.cone.CURVATURES.flat.label";
        semicircle: "SHAPE.TYPES.cone.CURVATURES.semicircle.label";
      };
    }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a cone shape.
 */
declare class ConeShapeData<Schema extends ConeShapeData.Schema = ConeShapeData.Schema> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.cone", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "cone";

  static override defineSchema(): ConeShapeData.Schema;

  /**
   * @throws If `data.curvature` is `"flat"` and `data.angle` is greater than `90`, or if `data.curvature` is
   * `"semicircle"` and `data.angle` is greater than `180`.
   */
  static override validateJoint(data: ConeShapeData.Source): void;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<ConeShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<ConeShapeData.Schema>;

  // fake type override
  static override fromSource(source: ConeShapeData.CreateData, context?: DataModel.FromSourceOptions): ConeShapeData;

  // fake type override
  static override fromJSON(json: string): ConeShapeData;
}

declare namespace RingShapeData {
  interface Schema extends BaseShapeData.Schema<"ring"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The radius of the ring in pixels.
     * @defaultValue `undefined`
     */
    radius: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The inner width of the ring in pixels.
     * @defaultValue `undefined`
     */
    innerWidth: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The inner width of the ring in pixels.
     * @defaultValue `undefined`
     */
    outerWidth: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a ring shape.
 */
declare class RingShapeData<Schema extends RingShapeData.Schema = RingShapeData.Schema> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.ring", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "ring";

  static override defineSchema(): RingShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<RingShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<RingShapeData.Schema>;

  // fake type override
  static override validateJoint(data: RingShapeData.Source): void;

  // fake type override
  static override fromSource(source: RingShapeData.CreateData, context?: DataModel.FromSourceOptions): RingShapeData;

  // fake type override
  static override fromJSON(json: string): RingShapeData;
}

declare namespace LineShapeData {
  interface Schema extends BaseShapeData.Schema<"line"> {
    /**
     * The x-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The y-coordinate of the origin in pixels.
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    /**
     * The length of the line in pixels.
     * @defaultValue `undefined`
     */
    length: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The width of the line in pixels.
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; initial: undefined; min: 0 }>;

    /**
     * The rotation around the origin of the line in degrees.
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * If the shape is grid-based, its dimensions are converted into grid units by dividing each by the grid size and
     * multiplying by the grid distance. The shape is then constructed using these dimensions conforming to the
     * grid's metric.
     * @defaultValue `false`
     */
    gridBased: fields.BooleanField;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a line shape.
 */
declare class LineShapeData<Schema extends LineShapeData.Schema = LineShapeData.Schema> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.line", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "line";

  static override defineSchema(): LineShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<LineShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<LineShapeData.Schema>;

  // fake type override
  static override validateJoint(data: LineShapeData.Source): void;

  // fake type override
  static override fromSource(source: LineShapeData.CreateData, context?: DataModel.FromSourceOptions): LineShapeData;

  // fake type override
  static override fromJSON(json: string): LineShapeData;
}

declare namespace PolygonShapeData {
  interface OriginSchema extends fields.DataSchema {
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;
  }

  interface Schema extends BaseShapeData.Schema<"polygon"> {
    /**
     * The points of the polygon ([x0, y0, x1, y1, ...]).
     * The polygon must not be self-intersecting if it is supposed to be filled.
     * The polygon must not contained zero-length edges except for the edge from the last to the first point.
     * @defaultValue `[]`
     */
    points: fields.ArrayField<
      fields.NumberField<{ required: true; nullable: false; initial: undefined }>,
      { min: 4; validate: (value: number[]) => void }
    >;

    /**
     * The origin of the polygon. If null, it defaults to the center-of-mass.
     * @defaultValue `null`
     */
    origin: fields.SchemaField<OriginSchema, { nullable: true }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a polygon shape.
 */
declare class PolygonShapeData<
  Schema extends PolygonShapeData.Schema = PolygonShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.polygon", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "polygon";

  static override defineSchema(): PolygonShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<PolygonShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<PolygonShapeData.Schema>;

  // fake type override
  static override validateJoint(data: PolygonShapeData.Source): void;

  // fake type override
  static override fromSource(
    source: PolygonShapeData.CreateData,
    context?: DataModel.FromSourceOptions,
  ): PolygonShapeData;

  // fake type override
  static override fromJSON(json: string): PolygonShapeData;
}

declare namespace TokenShapeData {
  interface Schema extends BaseShapeData.Schema<"token"> {
    /**
     * The top-left x-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    x: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The top-left y-coordinate in pixels (integer).
     * @defaultValue `undefined`
     */
    y: fields.NumberField<{ required: true; nullable: false; integer: true; initial: undefined }>;

    /**
     * The width in grid spaces (positive).
     * @defaultValue `undefined`
     */
    width: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The height in grid spaces (positive).
     * @defaultValue `undefined`
     */
    height: fields.NumberField<{ required: true; nullable: false; positive: true; initial: undefined }>;

    /**
     * The shape type (see {@linkcode CONST.TOKEN_SHAPES}).
     * @defaultValue `undefined`
     */
    shape: fields.NumberField<{ required: true; choices: CONST.TOKEN_SHAPES[]; initial: undefined }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a token shape.
 */
declare class TokenShapeData<
  Schema extends TokenShapeData.Schema = TokenShapeData.Schema,
> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.token", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "token";

  static override defineSchema(): TokenShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<TokenShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<TokenShapeData.Schema>;

  // fake type override
  static override validateJoint(data: TokenShapeData.Source): void;

  // fake type override
  static override fromSource(source: TokenShapeData.CreateData, context?: DataModel.FromSourceOptions): TokenShapeData;

  // fake type override
  static override fromJSON(json: string): TokenShapeData;
}

declare namespace GridShapeData {
  interface OriginSchema extends fields.DataSchema {
    x: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;

    y: fields.NumberField<{ required: true; nullable: false; initial: undefined }>;
  }

  interface Schema extends BaseShapeData.Schema<"grid"> {
    /**
     * The grid offsets covered by this shape
     * @defaultValue `[]`
     */
    offsets: fields.GridOffsetsField;

    /**
     * The optional grid space origin, which is by default the center point of the first grid space in `offsets`
     * @defaultValue `null`
     */
    origin: fields.SchemaField<OriginSchema, { nullable: true }>;
  }

  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  interface Source extends fields.SchemaField.SourceData<Schema> {}
}

/**
 * The data model for a shape that is the union of grid spaces.
 */
declare class GridShapeData<Schema extends GridShapeData.Schema = GridShapeData.Schema> extends BaseShapeData<Schema> {
  /** @defaultValue `["SHAPE.TYPES.grid", "SHAPE.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /** @privateRemarks Defined with `Object.defineProperty` without `writable: true`. */
  static override readonly TYPE: "grid";

  static override defineSchema(): GridShapeData.Schema;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<GridShapeData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<GridShapeData.Schema>;

  // fake type override
  static override validateJoint(data: GridShapeData.Source): void;

  // fake type override
  static override fromSource(source: GridShapeData.CreateData, context?: DataModel.FromSourceOptions): GridShapeData;

  // fake type override
  static override fromJSON(json: string): GridShapeData;
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
  interface SrcOptions {
    categories?: (keyof typeof CONST.FILE_CATEGORIES)[] | undefined;

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    initial?: _SrcOptionsInitial<fields.SchemaField.AssignmentData<Schema<DefaultOptions>>> | undefined;

    wildcard?: boolean | undefined;

    label?: string | undefined;
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

  // fake type override
  static override _schema: fields.SchemaField<PrototypeToken.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<PrototypeToken.Schema>;

  // fake type override
  static override validateJoint(data: PrototypeToken.Source): void;

  // fake type override
  static override fromSource(source: PrototypeToken.CreateData, context?: DataModel.FromSourceOptions): PrototypeToken;

  // fake type override
  static override fromJSON(json: string): PrototypeToken;
}

/**
 * The data model for the the core.prototypeTokenOverrides setting.
 */
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

  /** The named of the world setting that stores the prototype token overrides */
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
  static applyOverrides(source: PrototypeToken.CreateData, actorType?: Actor.SubType): void;

  /** Apply configured overrides to all Actor documents within the World. */
  static applyAll(): void;

  /* DataModel overrides */

  // fake type override
  static override _schema: fields.SchemaField<PrototypeTokenOverrides.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<PrototypeTokenOverrides.Schema>;

  // fake type override
  static override validateJoint(data: PrototypeTokenOverrides.Source): void;

  // fake type override
  static override fromSource(
    source: PrototypeTokenOverrides.CreateData,
    context?: DataModel.FromSourceOptions,
  ): PrototypeTokenOverrides;

  // fake type override
  static override fromJSON(json: string): PrototypeTokenOverrides;

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

  // fake type override
  static override _schema: fields.SchemaField<TombstoneData.Schema>;

  // fake type override
  static override get schema(): fields.SchemaField<TombstoneData.Schema>;

  // fake type override
  static override validateJoint(data: TombstoneData.Source): void;

  // fake type override
  static override fromSource(source: TombstoneData.CreateData, context?: DataModel.FromSourceOptions): TombstoneData;

  // fake type override
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
  EmanationShapeData,
  ConeShapeData,
  RingShapeData,
  LineShapeData,
  PolygonShapeData,
  TokenShapeData,
  GridShapeData,
  TextureData,
  TombstoneData,
};

export { default as ActiveEffectTypeDataModel } from "./active-effect.mjs";

type _Not<T extends boolean> = T extends true ? false : true;
