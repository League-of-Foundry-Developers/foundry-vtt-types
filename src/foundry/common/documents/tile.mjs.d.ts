import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as fields from '../data/fields.mjs';
import { TextureData } from '../data/data.mjs';
import type { DataModel, DataSchema } from '../abstract/data.mjs.js';
import type { FlagsField } from '../data/flagsField.js';

interface BaseTileSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Tile embedded document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * An image or video texture which this tile displays.
   */
  texture: ReturnType<typeof TextureData>;

  /**
   * The pixel width of the tile
   * (default: `0`)
   */
  width: fields.NumberField<{ required: true; nullable: false; step: 0.1 }>;

  /**
   * The pixel height of the tile
   * (default: `0`)
   */
  height: fields.NumberField<{ required: true; nullable: false; step: 0.1 }>;

  /**
   * The x-coordinate position of the top-left corner of the tile
   * (default: `0`)
   */
  x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'XCoord' }>;

  /**
   * The y-coordinate position of the top-left corner of the tile
   * (default: `0`)
   */
  y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: 'YCoord' }>;

  /**
   * The z-index ordering of this tile relative to its siblings
   * (default: `100`)
   */
  z: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 100 }>;

  /**
   * The angle of rotation for the tile between 0 and 360
   * (default: `0`)
   */
  rotation: fields.AngleField<{}>;

  /**
   * The tile opacity
   * (default: `1`)
   */
  alpha: fields.AlphaField<{}>;

  /**
   * Is the tile currently hidden?
   * (default: `false`)
   */
  hidden: fields.BooleanField<{}>;

  /**
   * Is the tile currently locked?
   * (default: `false`)
   */
  locked: fields.BooleanField<{}>;

  /**
   * Is the tile an overhead tile?
   * (default: `false`)
   */
  overhead: fields.BooleanField<{}>;

  /**
   * The tile's occlusion settings
   * (default: `false`)
   */
  occlusion: fields.SchemaField<
    {
      /**
       * The occlusion mode from CONST.TILE_OCCLUSION_MODES
       */
      mode: fields.NumberField<{
        choices: CONST.TILE_OCCLUSION_MODES[];
        initial: typeof CONST.TILE_OCCLUSION_MODES.FADE;
        validationError: 'must be a value in CONST.TILE_OCCLUSION_MODES';
      }>;

      /**
       * The occlusion alpha between 0 and 1
       */
      alpha: fields.AlphaField<{ initial: 0 }>;

      /**
       * An optional radius of occlusion used for RADIAL mode
       */
      radius: fields.NumberField<{ positive: true }>;
    },
    {}
  >;

  /**
   * The tile's video settings
   */
  video: fields.SchemaField<
    {
      /**
       * Automatically loop the video?
       */
      loop: fields.BooleanField<{ initial: true }>;

      /**
       * Should the video play automatically?
       */
      autoplay: fields.BooleanField<{ initial: true }>;

      /**
       * The volume level of any audio that the video file contains
       */
      volume: fields.AlphaField<{ initial: 0; step: 0.01 }>;
    },
    {}
  >;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Tile', {}>;
}

type BaseTileMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Tile';
    collection: 'tiles';
    label: 'DOCUMENT.Tile';
    labelPlural: 'DOCUMENT.Tiles';
  }
>;

type BaseTileShims = {
  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  img: BaseTile['texture']['src'];

  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  tint: BaseTile['texture']['tint'];
};

/**
 * The Document definition for a Tile.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 */
declare class BaseTile extends Document<
  BaseTileSchema,
  InstanceType<ConfiguredScene>,
  BaseTileMetadata,
  BaseTileShims
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseTileMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseTileSchema;

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseTile;
