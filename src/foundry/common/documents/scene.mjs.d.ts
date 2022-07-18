import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { TextureData, DocumentStatsSchema } from '../data/data.mjs';
import { DataModel, DataSchema } from '../abstract/module.mjs';
import type { FlagsField } from '../data/flagsField.js';
import type { JSOr } from '../../../types/helperTypes.js';

interface BaseSceneSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Scene document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * Is this scene currently active? Only one scene may be active at a given time
   * (default: `false`)
   */
  active: fields.BooleanField<{}>;

  /**
   * Is this scene displayed in the top navigation bar?
   * (default: `true`)
   */
  navigation: fields.BooleanField<{ initial: true }>;

  /**
   * The name of this scene
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The sorting order of this Scene in the navigation bar relative to siblings
   */
  navOrder: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

  /**
   * A string which overrides Scene name for display in the navigation bar
   */
  navName: fields.HTMLField<{}>;

  /**
   * An image or video file that provides the background texture for the scene.
   */
  background: ReturnType<typeof TextureData>;

  /**
   * An image or video file path providing foreground media for the scene
   */
  foreground: fields.FilePathField<{ categories: ['IMAGE', 'VIDEO'] }>;

  foregroundElevation: fields.NumberField<{ required: false; positive: true; integer: true }>;

  /**
   * A thumbnail image which depicts the scene at lower resolution
   */
  thumb: fields.FilePathField<{ categories: ['IMAGE'] }>;

  /**
   * The width of the scene canvas, normally the width of the background media
   * (default: `4000`)
   */
  width: fields.NumberField<{ integer: true; positive: true; initial: 4000 }>;

  /**
   * The height of the scene canvas, normally the height of the background media
   * (default: `3000`)
   */
  height: fields.NumberField<{ integer: true; positive: true; initial: 3000 }>;

  /**
   * The proportion of canvas padding applied around the outside of the scene dimensions to provide additional buffer space
   * (default: `0.25`)
   */
  padding: fields.NumberField<{ required: true; nullable: false; min: 0; max: 0.5; step: 0.05; initial: 0.25 }>;

  /**
   * The initial view coordinates for the scene
   * (default: `null`)
   */
  initial: fields.SchemaField<
    {
      x: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
      y: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
      scale: fields.NumberField<{ nullable: true; min: 0.25; max: 3; initial: undefined }>;
    },
    {}
  >;

  /**
   * The color of the canvas displayed behind the scene background
   * (default: `'#999999'`)
   */
  backgroundColor: fields.ColorField<{ initial: '#999999' }>;

  /**
   * Grid configuration for the scene
   */
  grid: fields.SchemaField<
    {
      /**
       * The type of grid, a number from CONST.GRID_TYPES.
       * (default: `1`)
       */
      type: fields.NumberField<{
        required: true;
        choices: CONST.GRID_TYPES[];
        initial: typeof CONST.GRID_TYPES.SQUARE;
        validationError: 'must be a value in CONST.GRID_TYPES';
      }>;

      /**
       * The grid size which represents the width (or height) of a single grid space.
       * (default: `100`)
       */
      size: fields.NumberField<{
        required: true;
        nullable: false;
        integer: true;
        min: typeof CONST.GRID_MIN_SIZE;
        initial: 100;
        validationError: `must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
      }>;

      /**
       * A string representing the color used to render the grid lines.
       * (default: `'#000000'`)
       */
      color: fields.ColorField<{ required: true; nullable: false; initial: '#000000' }>;

      /**
       * A number between 0 and 1 for the opacity of the grid lines.
       * (default: `0.2`)
       */
      alpha: fields.AlphaField<{ initial: 0.2 }>;

      /**
       * The number of distance units which are represented by a single grid space.
       */
      distance: fields.NumberField<{
        required: true;
        nullable: false;
        positive: true;
        // TODO fix the circular reference here.
        initial: () => number; // JSOr<OptionalChaining<OptionalChaining<typeof game, 'system'>, 'gridDistance'>, 1>;
      }>;

      /**
       * A label for the units of measure which are used for grid distance.
       */
      units: fields.StringField<{
        // TODO fix the circular reference here.
        initial: () => string; // NullishCoalesce<OptionalChaining<OptionalChaining<typeof game, 'system'>, 'gridUnits'>, ''>;
      }>;
    },
    {}
  >;

  /**
   * Do Tokens require vision in order to see the Scene environment?
   * (default: `true`)
   */
  tokenVision: fields.BooleanField<{ initial: true }>;

  /**
   * Should fog exploration progress be tracked for this Scene?
   * (default: `true`)
   */
  fogExploration: fields.BooleanField<{ initial: true }>;

  /**
   * The timestamp at which fog of war was last reset for this Scene.
   */
  fogReset: fields.NumberField<{ nullable: false; initial: typeof Date.now }>;

  /**
   * Does this Scene benefit from global illumination which provides bright light everywhere?
   * (default: `false`)
   */
  globalLight: fields.BooleanField<{}>;

  /**
   * A darkness level between 0 and 1, beyond which point global illumination is temporarily disabled if globalLight is true.
   */
  globalLightThreshold: fields.AlphaField<{ nullable: true; initial: null }>;

  /**
   * The ambient darkness level in this Scene, where 0 represents midday (maximum illumination) and 1 represents midnight (maximum darkness)
   * (default: `0`)
   */
  darkness: fields.AlphaField<{ initial: 0 }>;

  // TODO, causes circular reference in Scene
  /**
   * A collection of embedded Drawing objects.
   * (default: `[]`)
   */
  //   drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing, {}>;

  // TODO, causes circular reference in Scene
  /**
   * A collection of embedded Token objects.
   * (default: `[]`)
   */
  //   tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken, {}>;

  // TODO, causes circular reference in Scene
  /**
   * A collection of embedded AmbientLight objects.
   * (default: `[]`)
   */
  //   lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight, {}>;

  // TODO Causes circularly references on Sound
  /**
   * A collection of embedded Note objects.
   * (default: `[]`)
   */
  //   notes: fields.EmbeddedCollectionField<typeof documents.BaseNote, {}>;

  // TODO Causes circularly references on Scene
  /**
   * A collection of embedded AmbientSound objects.
   * (default: `[]`)
   */
  //   sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound, {}>;

  // TODO causes circularly references in Scene
  /**
   * A collection of embedded MeasuredTemplate objects.
   * (default: `[]`)
   */
  //   templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate, {}>;

  // TODO causes circularly references in Scene
  /**
   * A collection of embedded Tile objects.
   * (default: `[]`)
   */
  //   tiles: fields.EmbeddedCollectionField<typeof documents.BaseTile, {}>;

  // TODO circularly references
  /**
   * A collection of embedded Wall objects
   * (default: `[]`)
   */
  //   walls: fields.EmbeddedCollectionField<typeof documents.BaseWall, {}>;

  /**
   * A linked Playlist document which should begin automatically playing when this Scene becomes active.
   */
  playlist: fields.ForeignDocumentField<typeof documents.BasePlaylist, {}>;

  /**
   * A linked PlaylistSound document from the selected playlist that will begin automatically playing when this Scene becomes active
   */
  playlistSound: fields.ForeignDocumentField<typeof documents.BasePlaylistSound, { idOnly: true }>;

  /**
   * A JournalEntry document which provides narrative details about this Scene
   */
  journal: fields.ForeignDocumentField<typeof documents.BaseJournalEntry, {}>;

  /**
   * A named weather effect which should be rendered in this Scene.
   */
  weather: fields.StringField<{}>;

  /**
   * The _id of a Folder which contains this Actor
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this Scene
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Scene', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BaseSceneMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Scene';
    collection: 'scenes';
    compendiumIndexFields: ['_id', 'name', 'thumb', 'sort'];
    embedded: {
      AmbientLight: 'lights';
      AmbientSound: 'sounds';
      Drawing: 'drawings';
      MeasuredTemplate: 'templates';
      Note: 'notes';
      Tile: 'tiles';
      Token: 'tokens';
      Wall: 'walls';
    };
    label: 'DOCUMENT.Scene';
    labelPlural: 'DOCUMENT.Scenes';
  }
>;

type BaseSceneShims = {
  /**
   * Migration to inner grid schema.
   * @deprecated since v10
   */
  gridType: BaseScene['grid']['type'];

  /**
   * Migration to inner grid schema.
   * @deprecated since v10
   */
  gridColor: BaseScene['grid']['color'];

  /**
   * Migration to inner grid schema.
   * @deprecated since v10
   */
  gridAlpha: BaseScene['grid']['alpha'];

  /**
   * Migration to inner grid schema.
   * @deprecated since v10
   */
  gridDistance: BaseScene['grid']['distance'];

  /**
   * Migration to inner grid schema.
   * @deprecated since v10
   */
  gridUnits: BaseScene['grid']['units'];

  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  img: BaseScene['background']['src'];

  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  shiftX: BaseScene['background']['offsetX'];

  /**
   * Migration to TextureData.
   * @deprecated since v10
   */
  shiftY: BaseScene['background']['offsetY'];

  /**
   * Rename permission to ownership.
   * @deprecated since v10
   */
  permission: BaseScene['ownership'];
};

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
declare class BaseScene extends Document<BaseSceneSchema, null, BaseSceneMetadata, BaseSceneShims> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseSceneMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseSceneSchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BaseScene;
