import { TileOcclusion, TileOcclusionConstructorData } from './tileOcclusion';
import { VideoData, VideoDataConstructorData } from './videoData';
import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface TileDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  img: typeof fields.VIDEO_FIELD;
  width: typeof fields.REQUIRED_NUMBER;
  height: typeof fields.REQUIRED_NUMBER;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  z: FieldReturnType<typeof fields.INTEGER_FIELD, { required: true; default: 100 }>;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  alpha: typeof fields.ALPHA_FIELD;
  tint: typeof fields.COLOR_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  locked: typeof fields.BOOLEAN_FIELD;
  overhead: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: false }>;
  occlusion: DocumentField<TileOcclusion> & {
    type: typeof TileOcclusion;
    required: false;
    default: {};
  };
  video: DocumentField<VideoData> & {
    type: typeof VideoData;
    required: false;
    default: {};
  };
  flags: typeof fields.OBJECT_FIELD;
}

interface TileDataProperties {
  /**
   * The _id which uniquely identifies this Tile embedded document
   */
  _id: string | null;

  /**
   * An image or video file path which this tile displays
   */
  img: string | null | undefined;

  /**
   * The pixel width of the tile
   * @defaultValue `0`
   */
  width: number;

  /**
   * The pixel height of the tile
   * @defaultValue `0`
   */
  height: number;

  /**
   * The x-coordinate position of the top-left corner of the tile
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the top-left corner of the tile
   * @defaultValue `0`
   */
  y: number;

  /**
   * The z-index ordering of this tile relative to its siblings
   * @defaultValue `100`
   */
  z: number;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * The tile opacity
   * @defaultValue `1`
   */
  alpha: number;

  /**
   * A color to tint the tile
   */
  tint: string | null | undefined;

  /**
   * Is the tile currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * Is the tile currently locked?
   * @defaultValue `false`
   */
  locked: boolean;

  /**
   * Is the tile an overhead tile?
   * @defaultValue `false`
   */
  overhead: boolean;

  /**
   * The tile's occlusion settings
   */
  occlusion: TileOcclusion;

  /**
   * The tile's video settings
   */
  video: VideoData;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Tile'>;
}

interface TileDataConstructorData {
  /**
   * The _id which uniquely identifies this Tile embedded document
   */
  _id?: string | null | undefined;

  /**
   * An image or video file path which this tile displays
   */
  img?: string | null | undefined;

  /**
   * The pixel width of the tile
   * @defaultValue `0`
   */
  width?: number | null | undefined;

  /**
   * The pixel height of the tile
   * @defaultValue `0`
   */
  height?: number | null | undefined;

  /**
   * The x-coordinate position of the top-left corner of the tile
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the top-left corner of the tile
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The z-index ordering of this tile relative to its siblings
   * @defaultValue `100`
   */
  z?: number | null | undefined;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation?: number | null | undefined;

  /**
   * The tile opacity
   * @defaultValue `1`
   */
  alpha?: number | null | undefined;

  /**
   * A color to tint the tile
   */
  tint?: string | null | undefined;

  /**
   * Is the tile currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * Is the tile currently locked?
   * @defaultValue `false`
   */
  locked?: boolean | null | undefined;

  /**
   * Is the tile an overhead tile?
   * @defaultValue `false`
   */
  overhead?: boolean | null | undefined;

  /**
   * The tile's occlusion settings
   */
  occlusion?: TileOcclusionConstructorData | null | undefined;

  /**
   * The tile's video settings
   */
  video?: VideoDataConstructorData | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Tile'> | null | undefined;
}

/**
 * The data schema for a Tile embedded document.
 * @see BaseTile
 */
export declare class TileData extends DocumentData<
  TileDataSchema,
  TileDataProperties,
  PropertiesToSource<TileDataProperties>,
  TileDataConstructorData,
  documents.BaseTile
> {
  static defineSchema(): TileDataSchema;

  /** @override */
  _initializeSource(data: TileDataConstructorData): PropertiesToSource<TileDataProperties>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface TileData extends TileDataProperties {}
