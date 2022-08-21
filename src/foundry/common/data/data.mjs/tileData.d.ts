import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { TileOcclusion, TileOcclusionConstructorData } from "./tileOcclusion";
import { VideoData, VideoDataConstructorData } from "./videoData";

interface TileDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  img: fields.VideoField;
  width: fields.RequiredNumber;
  height: fields.RequiredNumber;
  x: fields.RequiredNumber;
  y: fields.RequiredNumber;
  z: FieldReturnType<fields.IntegerField, { required: true; default: 100 }>;
  rotation: FieldReturnType<fields.AngleField, { default: 0 }>;
  alpha: fields.AlphaField;
  tint: fields.ColorField;
  hidden: fields.BooleanField;
  locked: fields.BooleanField;
  overhead: FieldReturnType<fields.BooleanField, { default: false }>;
  occlusion: DocumentField<TileOcclusion> & {
    type: typeof TileOcclusion;
    required: false;
    default: Record<string, never>;
  };
  video: DocumentField<VideoData> & {
    type: typeof VideoData;
    required: false;
    default: Record<string, never>;
  };
  flags: fields.ObjectField;
}

interface TileDataProperties {
  /**
   * The _id which uniquely identifies this Tile embedded document
   * @defaultValue `null`
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
   * @defaultValue `new TileOcclusion({})`
   */
  occlusion: TileOcclusion;

  /**
   * The tile's video settings
   * @defaultValue `new VideoData({})`
   */
  video: VideoData;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Tile">;
}

interface TileDataConstructorData {
  /**
   * The _id which uniquely identifies this Tile embedded document
   * @defaultValue `null`
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
   * @defaultValue `new TileOcclusion({})`
   */
  occlusion?: TileOcclusionConstructorData | null | undefined;

  /**
   * The tile's video settings
   * @defaultValue `new VideoData({})`
   */
  video?: VideoDataConstructorData | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Tile"> | null | undefined;
}

type TileDataSource = PropertiesToSource<TileDataProperties>;

/**
 * The data schema for a Tile embedded document.
 * @see BaseTile
 */
export class TileData extends DocumentData<
  TileDataSchema,
  TileDataProperties,
  TileDataSource,
  TileDataConstructorData,
  documents.BaseTile
> {
  static override defineSchema(): TileDataSchema;

  override _initializeSource(data: TileDataConstructorData): TileDataSource;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TileData extends TileDataProperties {}
