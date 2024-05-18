import type { DataModel, DatabaseBackend } from "../abstract/module.d.mts";
import type { fields } from "./module.d.mts";
import type * as documents from "../documents/module.mjs";
import type { ValueOf } from "../../../types/utils.d.mts";

// TODO: Implement all of the necessary options

declare global {
  type LightAnimationData = fields.SchemaField.InnerInitializedType<LightData.LightAnimationDataSchema>;
}

declare namespace LightData {
  type LightAnimationDataSchema = {
    /**
     * The animation type which is applied
     */
    type: fields.StringField<{ nullable: true; blank: false; initial: null; label: "LIGHT.AnimationType" }>;

    /**
     * The speed of the animation, a number between 0 and 10
     */
    speed: fields.NumberField<{
      required: true;
      integer: true;
      initial: 5;
      min: 0;
      max: 10;
      label: "LIGHT.AnimationSpeed";
      validationError: "Light animation speed must be an integer between 0 and 10";
    }>;

    /**
     * The intensity of the animation, a number between 1 and 10
     */
    intensity: fields.NumberField<{
      required: true;
      integer: true;
      initial: 5;
      min: 0;
      max: 10;
      label: "LIGHT.AnimationIntensity";
      validationError: "Light animation intensity must be an integer between 1 and 10";
    }>;

    /**
     * Reverse the direction of animation.
     */
    reverse: fields.BooleanField<{ label: "LIGHT.AnimationReverse" }>;
  };

  type DarknessSchema = {
    min: fields.NumberField<{ initial: 0 }>;
    max: fields.NumberField<{ initial: 1 }>;
  };

  type Schema = {
    /**
     * An opacity for the emitted light, if any
     */
    alpha: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Alpha" }>;

    /**
     * The angle of emission for this point source
     */
    angle: fields.AngleField<{ initial: 360; base: 360; label: "LIGHT.Angle" }>;

    /**
     * The allowed radius of bright vision or illumination
     */
    bright: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Bright" }>;

    /**
     * A tint color for the emitted light, if any
     */
    color: fields.ColorField<{ label: "LIGHT.Color" }>;

    /**
     * The coloration technique applied in the shader
     */
    coloration: fields.NumberField<{
      required: true;
      integer: true;
      initial: 1;
      label: "LIGHT.ColorationTechnique";
      hint: "LIGHT.ColorationTechniqueHint";
    }>;

    /**
     * The amount of contrast this light applies to the background texture
     */
    dim: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Dim" }>;

    /**
     * The allowed radius of dim vision or illumination
     */
    attenuation: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Attenuation"; hint: "LIGHT.AttenuationHint" }>;

    /**
     * Fade the difference between bright, dim, and dark gradually?
     */
    luminosity: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0.5;
      min: -1;
      max: 1;
      label: "LIGHT.Luminosity";
      hint: "LIGHT.LuminosityHint";
    }>;

    /**
     * The luminosity applied in the shader
     */
    saturation: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: -1;
      max: 1;
      label: "LIGHT.Saturation";
      hint: "LIGHT.SaturationHint";
    }>;

    /**
     * The amount of color saturation this light applies to the background texture
     */
    contrast: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: -1;
      max: 1;
      label: "LIGHT.Contrast";
      hint: "LIGHT.ContrastHint";
    }>;

    /**
     * The depth of shadows this light applies to the background texture
     */
    shadows: fields.NumberField<{
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
      max: 1;
      label: "LIGHT.Shadows";
      hint: "LIGHT.ShadowsHint";
    }>;

    /**
     * An animation configuration for the source
     */
    animation: fields.SchemaField<LightAnimationDataSchema>;

    /**
     * A darkness range (min and max) for which the source should be active
     */
    darkness: fields.SchemaField<
      DarknessSchema,
      {
        label: "LIGHT.DarknessRange";
        hint: "LIGHT.DarknessRangeHint";
        validate: (d: fields.SchemaField.InnerAssignmentType<DarknessSchema>) => boolean;
        validationError: "darkness.max may not be less than darkness.min";
      }
    >;
  };
}

interface LightData extends fields.SchemaField.InnerInitializedType<LightData.Schema> {}

export class LightData extends DataModel<fields.SchemaField<LightData.Schema>> {
  static defineSchema(): LightData.Schema;

  static migrateData(source: object): object;
}

declare namespace ShapeData {
  type Schema = {
    /**
     * The type of shape, a value in ShapeData.TYPES.
     * For rectangles, the x/y coordinates are the top-left corner.
     * For circles, the x/y coordinates are the center of the circle.
     * For polygons, the x/y coordinates are the first point of the polygon.
     */
    type: fields.StringField<{ required: true; blank: false; choices: ValueOf<TYPES>[]; initial: "r" }>;

    /**
     * For rectangles, the pixel width of the shape.
     */
    width: fields.NumberField<{ required: false; integer: true; min: 0 }>;

    /**
     * For rectangles, the pixel width of the shape.
     */
    height: fields.NumberField<{ required: false; integer: true; min: 0 }>;

    /**
     * For circles, the pixel radius of the shape.
     */
    radius: fields.NumberField<{ required: false; integer: true; positive: true }>;

    /**
     * For polygons, the array of polygon coordinates which comprise the shape.
     */
    points: fields.ArrayField<fields.NumberField<{ nullable: false }>>;
  };

  type TYPES = {
    RECTANGLE: "r";
    CIRCLE: "c";
    ELLIPSE: "e";
    POLYGON: "p";
  };
}

interface ShapeData extends fields.SchemaField.InnerInitializedType<ShapeData.Schema> {}

export class ShapeData extends DataModel<fields.SchemaField<ShapeData.Schema>> {
  static defineSchema(): ShapeData.Schema;

  static TYPES: ShapeData.TYPES;
}

declare namespace TextureData {
  type DefaultOptions = {
    categories: ["IMAGE", "VIDEO"];
    initial: null;
    wildcard: false;
    label: "";
  };

  type Schema<SrcOptions extends fields.FilePathField.Options = DefaultOptions> = {
    /**
     * The URL of the texture source.
     */
    src: fields.FilePathField<SrcOptions>;

    /**
     * The scale of the texture in the X dimension.
     */
    scaleX: fields.NumberField<{ nullable: false; initial: 1 }>;

    /**
     * The scale of the texture in the Y dimension.
     */
    scaleY: fields.NumberField<{ nullable: false; initial: 1 }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     */
    offsetX: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     */
    offsetY: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     */
    rotation: fields.AngleField;

    /**
     * An optional color string used to tint the texture.
     */
    tint: fields.ColorField;
  };
}

interface TextureData<
  SchemaOptions extends fields.SchemaField.Options<TextureData.Schema> = fields.SchemaField.DefaultOptions,
  // SrcOptions extends fields.FilePathField.Options = TextureData.DefaultOptions,
> extends fields.SchemaField.InnerInitializedType<TextureData.Schema, SchemaOptions> {}

export class TextureData<
  SchemaOptions extends fields.SchemaField.Options<TextureData.Schema> = fields.SchemaField.DefaultOptions,
  SrcOptions extends fields.FilePathField.Options = TextureData.DefaultOptions,
> extends fields.SchemaField<TextureData.Schema<SrcOptions>, SchemaOptions> {
  constructor(
    options?: SchemaOptions,
    // TODO: Figure out this configuration after FilePathField is defined
    srcOptions?: SrcOptions,
  );
}

declare namespace PrototypeToken {
  type ExcludedProperties =
    | "_id"
    | "actorId"
    | "delta"
    | "x"
    | "y"
    | "elevation"
    | "effects"
    | "overlayEffect"
    | "hidden";

  type Schema = Omit<documents.BaseToken.Schema, ExcludedProperties> & {
    name: fields.StringField<{ required: true; blank: true }>;

    /**
     * Does the prototype token use a random wildcard image?
     */
    randomImg: fields.BooleanField;
  };
}

interface PrototypeToken extends fields.SchemaField.InnerInitializedType<PrototypeToken.Schema> {}

export class PrototypeToken extends DataModel<fields.SchemaField<PrototypeToken.Schema>, documents.BaseActor> {
  constructor(data: unknown, options: unknown);

  /** @defaultValue `{}` */
  apps: Record<string, Application>;

  get actor(): this["parent"];

  toObject(source: true): this["_source"] & { actorId: string | undefined };
  toObject(source?: boolean | undefined): ReturnType<this["schema"]["toObject"]>;

  static get database(): DatabaseBackend;

  static migrateData(source: object): object;

  static shimData(data: object, options?: { embedded?: boolean } | undefined): object;

  update(data: unknown, options: unknown): unknown;

  getFlag(args: unknown): unknown;

  setFlag(args: unknown): unknown;

  unsetFlag(args: unknown): Promise<unknown>;

  testUserPermission(
    user: documents.BaseUser,
    permission: unknown,
    { exact }: { exact: boolean },
  ): ReturnType<this["actor"]["testUserPermission"]>;

  get isOwner(): boolean;
}

declare namespace TombstoneData {
  type Schema = {
    /**
     * The _id of the base Document that this tombstone represents.
     */
    _id: fields.DocumentIdField;

    /**
     * A property that identifies this entry as a tombstone.
     */
    _tombstone: fields.BooleanField;

    /**
     * An object of creation and access information.
     */
    _stats: fields.DocumentStatsField;
  };
}

interface TombstoneData extends fields.SchemaField.InnerInitializedType<TombstoneData.Schema> {}

export class TombstoneData extends DataModel<fields.SchemaField<TombstoneData.Schema>> {
  static defineSchema(): TombstoneData.Schema;
}
