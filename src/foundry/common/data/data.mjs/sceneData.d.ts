import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import * as CONST from '../../constants.mjs';

interface SceneDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  active: typeof fields.BOOLEAN_FIELD;
  navigation: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  navOrder: typeof fields.INTEGER_SORT_FIELD;
  navName: typeof fields.BLANK_STRING;
  img: typeof fields.VIDEO_FIELD;
  foreground: typeof fields.VIDEO_FIELD;
  thumb: typeof fields.IMAGE_FIELD;
  width: FieldReturnType<typeof fields.POSITIVE_INTEGER_FIELD, { required: true; default: 4000 }>;
  height: FieldReturnType<typeof fields.POSITIVE_INTEGER_FIELD, { required: true; default: 3000 }>;
  padding: {
    type: typeof Number;
    required: true;
    default: 0.25;
    validate: (p: unknown) => boolean;
    validation: 'Invalid {name} {field} which must be a number between 0 and 0.5';
  };
  initial: {
    type: typeof Object;
    required: false;
    nullable: true;
    default: null;
    validate: typeof _validateInitialViewPosition;
    validationError: 'Invalid initial view position object provided for Scene';
  };
  backgroundColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#999999' }>;
  gridType: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.GRID_TYPES.SQUARE;
      validate: (t: unknown) => t is CONST.GridType;
      validationError: 'Invalid {name } {field} which must be a value in CONST.GRID_TYPES';
    }
  >;
  grid: {
    type: typeof Number;
    required: true;
    default: 100;
    validate: (n: unknown) => boolean;
    validationError: `Invalid {name} {field} which must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
  };
  shiftX: FieldReturnType<typeof fields.INTEGER_FIELD, { required: true; default: 0 }>;
  shiftY: FieldReturnType<typeof fields.INTEGER_FIELD, { required: true; default: 0 }>;
  gridColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#000000' }>;
  gridAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { required: true; default: 0.2 }>;
  gridDistance: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: () => number }>;
  gridUnits: FieldReturnType<typeof fields.BLANK_STRING, { default: () => string }>;
  tokenVision: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  fogExploration: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  fogReset: typeof fields.TIMESTAMP_FIELD;
  globalLight: typeof fields.BOOLEAN_FIELD;
  globalLightThreshold: {
    type: typeof Number;
    required: true;
    nullable: true;
    default: null;
    validate: (n: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be null, or a number between 0 and 1';
  };
  darkness: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing>;
  tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken>;
  lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight>;
  notes: fields.EmbeddedCollectionField<typeof documents.BaseNote>;
  sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound>;
  templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate>;
  tiles: fields.EmbeddedCollectionField<typeof documents.BaseToken>;
  walls: fields.EmbeddedCollectionField<typeof documents.BaseWall>;
  playlist: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylist; required: false }>;
  playlistSound: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylistSound; required: false }>;
  journal: fields.ForeignDocumentField<{ type: typeof documents.BaseJournalEntry; required: false }>;
  weather: typeof fields.BLANK_STRING;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.BLANK_STRING;
}

interface SceneDataProperties {
  _id: string | null;
}

interface SceneDataConstructorData {
  _id?: string | null;
}

export declare class SceneData extends DocumentData<
  SceneDataSchema,
  SceneDataProperties,
  PropertiesToSource<SceneDataProperties>,
  SceneDataConstructorData,
  documents.BaseScene
> {
  static defineSchema(): SceneDataSchema;

  /** @override */
  _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface SceneData extends SceneDataProperties {}

/**
 * Verify that the initial view position for a Scene is valid
 * @param pos - The scene position object, or null
 * @returns Is the position valid?
 */
declare function _validateInitialViewPosition(pos: unknown): pos is { x: number; y: number; scale: number } | null;
