import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DocumentMetadata } from '../abstract/document.mjs';
import type DataModel from '../abstract/data.mjs';
import type { LightData } from '../data/data.mjs';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import type { FlagsField } from '../data/flagsField.js';
import type { DataSchema } from '../abstract/data.mjs';

type CanUpdate = (
  user: documents.BaseUser,
  doc: Token,
  data: DeepPartial<DataModel.SchemaToSource<BaseToken['schema']>>
) => boolean;

export interface BaseTokenBarSchema extends DataSchema {
  /** The attribute path within the Token's Actor data which should be displayed */
  attribute: fields.StringField<{
    required: true;
    nullable: true;
    blank: false;
    initial: () => null; // Exclude<GetKey<GetKey<typeof game, 'system'>, 'primaryTokenAttribute'>, undefined> | null;
  }>;
}

export interface BaseTokenSchema extends DataSchema {
  /**
   * The Token _id which uniquely identifies it within its parent Scene
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name used to describe the Token
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The display mode of the Token nameplate, from CONST.TOKEN_DISPLAY_MODES
   * (default: `0`)
   */
  displayName: fields.NumberField<{
    required: true;
    initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    choices: Array<typeof CONST.TOKEN_DISPLAY_MODES[keyof typeof CONST.TOKEN_DISPLAY_MODES]>;
    validationError: 'must be a value in CONST.TOKEN_DISPLAY_MODES';
  }>;

  /**
   * The _id of an Actor document which this Token represents
   */
  actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { idOnly: true }>;

  /**
   * Does this Token uniquely represent a singular Actor, or is it one of many?
   * (default: `false`)
   */
  actorLink: fields.BooleanField<{}>;

  /**
   * Token-level data which overrides the base data of the associated Actor
   */
  actorData: fields.ObjectField<{}>;

  /**
   * The token's texture on the canvas.
   */
  texture: /*TextureData({initial: () => this.DEFAULT_ICON});*/ any;

  /**
   * The width of the Token in grid units
   * (default: `1`)
   */
  width: fields.NumberField<{ positive: true; initial: 1; label: 'Width' }>;

  /**
   * The height of the Token in grid units
   * (default: `1`)
   */
  height: fields.NumberField<{ positive: true; initial: 1; label: 'Width' }>;

  /**
   * The x-coordinate of the top-left corner of the Token
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate of the top-left corner of the Token
   * (default: `0`)
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * The vertical elevation of the Token, in distance units
   * (default: `0`)
   */
  elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

  /**
   * Prevent the Token image from visually rotating?
   * (default: `false`)
   */
  lockRotation: fields.BooleanField<{}>;

  /**
   * The rotation of the Token in degrees, from 0 to 360. A value of 0 represents a southward-facing Token.
   * (default: `0`)
   */
  rotation: fields.AngleField<{}>;

  /**
   * An array of effect icon paths which are displayed on the Token
   */
  effects: fields.ArrayField<fields.StringField<{}>, {}>;

  /**
   * A single icon path which is displayed as an overlay on the Token
   */
  overlayEffect: fields.StringField<{}>;

  /**
   * The opacity of the token image
   * (default: `1`)
   */
  alpha: fields.AlphaField<{}>;

  /**
   * Is the Token currently hidden from player view?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{}>;

  sight: fields.SchemaField<
    {
      /**
       * Is this Token a source of vision?
       */
      enabled: fields.BooleanField<{ initial: (data: unknown) => boolean }> /* TODO Number(data?.sight?.range) > 0 */;

      range: fields.NumberField<{ required: true; min: 0; step: 0.01 }>;

      /**
       * The angle at which this Token is able to see, if it has vision
       * (default: `360`)
       */
      angle: fields.AngleField<{ initial: 360; base: 360 }>;
      color: fields.ColorField<{ label: 'TOKEN.VisionColor' }>;
      attenuation: fields.AlphaField<{
        initial: 0.1;
        label: 'TOKEN.VisionAttenuation';
        hint: 'TOKEN.VisionAttenuationHint';
      }>;
      brightness: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: 'TOKEN.VisionBrightness';
        hint: 'TOKEN.VisionBrightnessHint';
      }>;
      saturation: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: 'TOKEN.VisionSaturation';
        hint: 'TOKEN.VisionSaturationHint';
      }>;
      contrast: fields.NumberField<{
        required: true;
        nullable: false;
        initial: 0;
        min: -1;
        max: 1;
        label: 'TOKEN.VisionContrast';
        hint: 'TOKEN.VisionContrastHint';
      }>;
      visionMode: fields.StringField<{
        required: true;
        blank: false;
        initial: 'basic';
        label: 'TOKEN.VisionMode';
        hint: 'TOKEN.VisionModeHint';
      }>;
    },
    {}
  >;

  /**
   * Configuration of the light source that this Token emits, if any
   */
  light: fields.EmbeddedDataField<typeof LightData, {}>;

  /**
   * A displayed Token disposition from CONST.TOKEN_DISPOSITIONS
   * (default: `-1`)
   */
  disposition: fields.NumberField<{
    required: true;
    choices: ValueOf<typeof CONST.TOKEN_DISPOSITIONS>[];
    initial: typeof CONST.TOKEN_DISPOSITIONS.HOSTILE;
    validationError: 'must be a value in CONST.TOKEN_DISPOSITIONS';
  }>;

  /**
   * The display mode of Token resource bars, from CONST.TOKEN_DISPLAY_MODES
   * (default: `0`)
   */
  displayBars: fields.NumberField<{
    required: true;
    choices: ValueOf<typeof CONST.TOKEN_DISPLAY_MODES>[];
    initial: typeof CONST.TOKEN_DISPLAY_MODES.NONE;
    validationError: 'must be a value in CONST.TOKEN_DISPLAY_MODES';
  }>;

  /**
   * The configuration of the Token's primary resource bar
   */
  bar1: fields.SchemaField<BaseTokenBarSchema, {}>;

  /**
   * The configuration of the Token's secondary resource bar
   */
  bar2: fields.SchemaField<BaseTokenBarSchema, {}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Token', {}>;
}

export type BaseTokenMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Token';
    collection: 'tokens';
    label: 'DOCUMENT.Token';
    labelPlural: 'DOCUMENT.Tokens';
    isEmbedded: true;
    permissions: {
      create: 'TOKEN_CREATE';
      update: CanUpdate;
    };

    types: string[];
  }
>;

/**
 * The base Token model definition which defines common behavior of an Token document between both client and server.         The constructed data object for the document.
 */
declare class BaseToken extends foundry.abstract.Document<
  BaseTokenSchema,
  InstanceType<ConfiguredDocumentClass<typeof Scene>>,
  BaseTokenMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseTokenMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseTokenSchema;

  /**
   * The default icon used for newly created Token documents
   *
   * (instanciated: `typeof CONST.DEFAULT_TOKEN`)
   */
  static DEFAULT_ICON: string;

  /**
   * Is a user able to update an existing Token?
   */
  static #canUpdate: CanUpdate;

  /** @override */
  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritDoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ----------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseToken;
