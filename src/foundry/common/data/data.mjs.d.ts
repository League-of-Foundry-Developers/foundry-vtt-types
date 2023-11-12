/**
 * The collection of data schema and document definitions for primary documents which are shared between the both the
 * client and the server.
 */

import { DataModel, DataSchema } from '../abstract/module.mjs';
import * as fields from './fields.mjs';
import * as documents from '../documents/module.mjs';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';

interface LightDataSchema extends DataSchema {
  /**
   * An opacity for the emitted light, if any
   */
  alpha: fields.AlphaField<{ initial: 0.5; label: 'LIGHT.Alpha' }>;

  /**
   * The angle of emission for this point source
   */
  angle: fields.AngleField<{ initial: 360; base: 360; label: 'LIGHT.Angle' }>;

  /**
   * The allowed radius of bright vision or illumination
   */
  bright: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: 'LIGHT.Bright' }>;

  /**
   * A tint color for the emitted light, if any
   */
  color: fields.ColorField<{ label: 'LIGHT.Color' }>;

  /**
   * The coloration technique applied in the shader
   */
  coloration: fields.NumberField<{
    required: true;
    integer: true;
    initial: 1;
    label: 'LIGHT.ColorationTechnique';
    hint: 'LIGHT.ColorationTechniqueHint';
  }>;

  /**
   * The allowed radius of dim vision or illumination
   */
  dim: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: 'LIGHT.Dim' }>;

  /**
   * Fade the difference between bright, dim, and dark gradually?
   */
  attenuation: fields.AlphaField<{ initial: 0.5; label: 'LIGHT.Attenuation'; hint: 'LIGHT.AttenuationHint' }>;

  /**
   * The luminosity applied in the shader
   */
  luminosity: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0.5;
    min: -1;
    max: 1;
    label: 'LIGHT.Luminosity';
    hint: 'LIGHT.LuminosityHint';
  }>;

  /**
   * The amount of color saturation this light applies to the background texture
   */
  saturation: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: -1;
    max: 1;
    label: 'LIGHT.Saturation';
    hint: 'LIGHT.SaturationHint';
  }>;

  /**
   * The amount of contrast this light applies to the background texture
   */
  contrast: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: -1;
    max: 1;
    label: 'LIGHT.Contrast';
    hint: 'LIGHT.ContrastHint';
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
    label: 'LIGHT.Shadows';
    hint: 'LIGHT.ShadowsHint';
  }>;

  /**
   * An animation configuration for the source
   */
  animation: fields.SchemaField<
    {
      /**
       * The animation type which is applied
       */
      type: fields.StringField<{ nullable: true; blank: false; initial: null; label: 'LIGHT.AnimationType' }>;

      /**
       * The speed of the animation, a number between 0 and 10
       */
      speed: fields.NumberField<{
        required: true;
        integer: true;
        initial: 5;
        min: 0;
        max: 10;
        label: 'LIGHT.AnimationSpeed';
        validationError: 'Light animation speed must be an integer between 0 and 10';
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
        label: 'LIGHT.AnimationIntensity';
        validationError: 'Light animation intensity must be an integer between 1 and 10';
      }>;

      /**
       * Reverse the direction of animation.
       */
      reverse: fields.BooleanField<{ label: 'LIGHT.Animation/' }>;
    },
    {}
  >;

  /**
   * A darkness range (min and max) for which the source should be active
   */
  darkness: fields.SchemaField<
    {
      min: fields.AlphaField<{ initial: 0 }>;
      max: fields.AlphaField<{ initial: 1 }>;
    },
    {
      label: 'LIGHT.DarknessRange';
      hint: 'LIGHT.DarknessRangeHint';
      validate: (d: InexactPartial<{ min: number; max: number }>) => boolean;
      validationError: 'darkness.max may not be less than darkness.min';
    }
  >;
}

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
declare class LightData extends DataModel<null, LightDataSchema> {
  static override defineSchema(): LightDataSchema;

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;
}

/* ---------------------------------------- */

interface ShapeDataSchema extends DataSchema {
  /**
   * The type of shape, a value in ShapeData.TYPES.
   * For rectangles, the x/y coordinates are the top-left corner.
   * For circles, the x/y coordinates are the center of the circle.
   * For polygons, the x/y coordinates are the first point of the polygon.
   */
  type: fields.StringField<{
    required: true;
    blank: false;
    choices: ValueOf<ShapeData.TYPES>[];
    initial: 'r';
  }>;

  /**
   * For rectangles, the pixel width of the shape.
   */
  width: fields.NumberField<{ required: false; integer: true; positive: true }>;

  /**
   * For rectangles, the pixel width of the shape.
   */
  height: fields.NumberField<{ required: false; integer: true; positive: true }>;

  /**
   * For circles, the pixel radius of the shape.
   */
  radius: fields.NumberField<{ required: false; integer: true; positive: true }>;

  /**
   * For polygons, the array of polygon coordinates which comprise the shape.
   */
  points: fields.ArrayField<fields.NumberField<{ nullable: false; integer: true }>, {}>;
}

declare namespace ShapeData {
  export type TYPES = {
    RECTANGLE: 'r';
    CIRCLE: 'c';
    ELLIPSE: 'e';
    POLYGON: 'p';
  };
}

/**
 * A data model intended to be used as an inner EmbeddedDataField which defines a geometric shape.
 */
declare class ShapeData extends DataModel<null, ShapeDataSchema> {
  static override defineSchema(): ShapeDataSchema;

  /**
   * The primitive shape types which are supported
   */
  static TYPES: ShapeData.TYPES;
}

/* ---------------------------------------- */

type BaseOptions = Pick<fields.DataField.OptionsFor<typeof fields.FilePathField>, 'categories' | 'initial' | 'label'>;

export type TextureDataOptions = {
  /** (default: `["IMAGE", "VIDEO"]`) */
  categories?: BaseOptions['categories'];

  /** (default: `null`) */
  initial?: BaseOptions['initial'];

  label: Exclude<BaseOptions['label'], undefined>;
};

export type TextureDataField<Options extends TextureDataOptions> = fields.SchemaField<
  {
    /**
     * The URL of the texture source.
     */
    src: fields.FilePathField<{
      categories: Coalesce<Options['categories'], undefined, ['IMAGE', 'VIDEO']>;
      initial: Options['initial'];
      label: Options['label'];
    }>;

    /**
     * The scale of the texture in the X dimension.
     * (default: `1`)
     */
    scaleX: fields.NumberField<{ nullable: false; initial: 1 }>;

    /**
     * The scale of the texture in the Y dimension.
     * (default: `1`)
     */
    scaleY: fields.NumberField<{ nullable: false; initial: 1 }>;

    /**
     * The X offset of the texture with (0,0) in the top left.
     * (default: `0`)
     */
    offsetX: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * The Y offset of the texture with (0,0) in the top left.
     * (default: `0`)
     */
    offsetY: fields.NumberField<{ nullable: false; integer: true; initial: 0 }>;

    /**
     * An angle of rotation by which this texture is rotated around its center.
     */
    rotation: fields.AngleField<{}>;

    /**
     * An optional color string used to tint the texture.
     * (default: `null`)
     */
    tint: fields.ColorField<{}>;
  },
  {}
>;

/**
 * A function that returns a configured SchemaField to represent texture data.
 *
 * @param options - (default: `{}`)
 */
declare const TextureData: (
  options?: TextureDataOptions
) => TextureDataField<NullishCoalesce<typeof options, TextureDataOptions>>;

/* ---------------------------------------- */

type PrototypeTokenExcludedProperties = [
  '_id',
  'actorId',
  'actorData',
  'x',
  'y',
  'elevation',
  'effects',
  'overlayEffect',
  'hidden'
];
type PrototypeTokenSchema = Omit<
  ReturnType<typeof documents.BaseToken.defineSchema>,
  ValueOf<PrototypeTokenExcludedProperties>
> & {
  name: fields.StringField<{ required: true; blank: true }>;

  /**
   * Does the prototype token use a random wildcard image?
   */
  randomImg: fields.BooleanField<{}>;
};

type PrototypeTokenToObject<Token extends PrototypeToken> = {
  //   actorId: Token['document']['id'];
};

/**
 * Extend the base TokenData to define a PrototypeToken which exists within a parent Actor.
 */
declare class PrototypeToken extends DataModel<
  InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseToken>>,
  PrototypeTokenSchema
> {
  static override defineSchema(): PrototypeTokenSchema;

  /**
   * The Actor which owns this Prototype Token
   */
  get actor(): this['parent'];

  /** {@inheritdoc} */
  override toObject(source?: true): this['_source'] & PrototypeTokenToObject<this>;

  override toObject(source: false): {
    [K in keyof this['schema']]: ReturnType<this['schema'][K]['toObject']>;
  } & PrototypeTokenToObject<this>;

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;

  /**
   * @see abstract.Document#testUserPermission
   */
  testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /**
   * @see documents.BaseActor#isOwner
   */
  get isOwner(): this['actor']['isOwner'];
}

/* -------------------------------------------- */

/**
 * A field that tracks creation and access data for a Document.
 */
declare const DocumentStatsSchema: fields.SchemaField<
  {
    /**
     * The package name of the system the Document was created in.
     */
    systemId: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The version of the system the Document was created in.
     */
    systemVersion: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * The core version the Document was created in.
     */
    coreVersion: fields.StringField<{ required: true; blank: false; nullable: true; initial: null }>;

    /**
     * A timestamp of when the Document was created.
     */
    createdTime: fields.NumberField<{}>;

    /**
     * A timestamp of when the Document was last modified.
     */
    modifiedTime: fields.NumberField<{}>;
    lastModifiedBy: fields.ForeignDocumentField<typeof documents.BaseUser, { idOnly: true }>;
  },
  {}
>;

/* -------------------------------------------- */

/**
 * A field for denoting version compatibility for a Package
 */
declare const CompatibilitySchema: fields.SchemaField<
  {
    /**
     * The Package will not function before this version
     */
    minimum: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * Verified compatible up to this version
     */
    verified: fields.StringField<{ required: false; blank: false; initial: undefined }>;

    /**
     * The Package will not function after this version
     */
    maximum: fields.StringField<{ required: false; blank: false; initial: undefined }>;
  },
  {}
>;

/* -------------------------------------------- */

/**
 * @deprecated since v10
 * @see PrototypeToken
 */
declare class PrototypeTokenData extends PrototypeToken {
  constructor(...args: ConstructorParameters<typeof PrototypeToken>);
}

// Exports need to be at the bottom so that class names appear correctly in JSDoc
export {
  DocumentStatsSchema,
  CompatibilitySchema,
  LightData,
  PrototypeToken,
  PrototypeTokenData,
  ShapeData,
  TextureData
};
