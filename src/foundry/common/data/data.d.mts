import type { DatabaseBackend } from "../abstract/module.d.mts";
import type { DataModel } from "../abstract/data.d.mts";
import type { fields } from "./module.d.mts";
import type * as documents from "../documents/_module.mjs";
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

  interface Schema extends DataSchema {
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
  }
}

declare class LightData extends DataModel<LightData.Schema> {
  static defineSchema(): LightData.Schema;

  static migrateData(source: object): object;
}

declare namespace ShapeData {
  interface Schema extends DataSchema {
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
  }

  type TYPES = {
    RECTANGLE: "r";
    CIRCLE: "c";
    ELLIPSE: "e";
    POLYGON: "p";
  };
}

declare class ShapeData extends DataModel<ShapeData.Schema> {
  static defineSchema(): ShapeData.Schema;

  static TYPES: ShapeData.TYPES;
}

declare namespace TextureData {
  type DefaultOptions = {
    categories: ["IMAGE", "VIDEO"];
    // initial: null;
    wildcard: false;
    label: "";
  };

  type Schema<SrcOptions extends FilePathFieldOptions> = {
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

declare class TextureData<
  SrcOptions extends FilePathFieldOptions = TextureData.DefaultOptions,
  SchemaOptions extends fields.SchemaField.Options<TextureData.Schema<SrcOptions>> = {},
> extends fields.SchemaField<TextureData.Schema<SrcOptions>, SchemaOptions> {
  constructor(options?: SchemaOptions, srcOptions?: SrcOptions);
}

declare namespace PrototypeToken {
  // Not otherwise used
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

  interface Schema extends foundry.documents.BaseToken.SharedProtoSchema {
    // Name is technically redefined but with the same options so it's ignored here
    // name: fields.StringField<{ required: true; blank: true }>;

    /**
     * Does the prototype token use a random wildcard image?
     */
    randomImg: fields.BooleanField;
  }

  type ConstructorData = fields.SchemaField.InnerAssignmentType<Schema>;
}

declare class PrototypeToken extends DataModel<PrototypeToken.Schema, documents.BaseActor> {
  constructor(data?: PrototypeToken.ConstructorData, options?: DataModel.ConstructorOptions);

  /** @defaultValue `{}` */
  apps: Record<string, Application>;

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): this["parent"];

  override toObject(source: true): this["_source"] & { actorId: string | undefined };
  override toObject(source?: boolean): ReturnType<this["schema"]["toObject"]>;

  static get database(): DatabaseBackend;

  static override migrateData(source: object): object;

  static override shimData(
    data: object,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): object;

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
    user: documents.BaseUser,
    permission: unknown,
    { exact }: { exact: boolean },
  ): ReturnType<this["actor"]["testUserPermission"]>;

  /**
   * @see foundry.abstract.Document#isOwner
   */
  get isOwner(): boolean;

  // Monkey patched in from `token.js`, put here due to issues with the merge process
  /**
   * @see TokenDocument#getBarAttribute
   */
  getBarAttribute: TokenDocument["getBarAttribute"];
}

declare namespace TombstoneData {
  interface Schema extends DataSchema {
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
  }
}

declare class TombstoneData extends DataModel<TombstoneData.Schema> {
  static defineSchema(): TombstoneData.Schema;
}

export {
  LightData,
  PrototypeToken,
  // PrototypeTokenData,
  ShapeData,
  TextureData,
  TombstoneData,
};
