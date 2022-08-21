import { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import { documents } from "../../module.mjs";
import * as fields from "../fields.mjs";

interface VideoDataSchema extends DocumentSchema {
  loop: FieldReturnType<fields.BooleanField, { default: true }>;
  autoplay: FieldReturnType<fields.BooleanField, { default: true }>;
  volume: FieldReturnType<fields.AlphaField, { default: 0 }>;
}

interface VideoDataProperties {
  /**
   * Automatically loop the video?
   * @defaultValue `true`
   */
  loop: boolean;

  /**
   * Should the video play automatically?
   * @defaultValue `true`
   */
  autoplay: boolean;

  /**
   * The volume level of any audio that the video file contains
   * @defaultValue `0`
   */
  volume: number;
}

interface VideoDataConstructorData {
  /**
   * Automatically loop the video?
   * @defaultValue `true`
   */
  loop?: boolean | null | undefined;

  /**
   * Should the video play automatically?
   * @defaultValue `true`
   */
  autoplay?: boolean | null | undefined;

  /**
   * The volume level of any audio that the video file contains
   * @defaultValue `0`
   */
  volume?: number | null | undefined;
}

type VideoDataSource = PropertiesToSource<VideoDataProperties>;

/**
 * An inner-object which defines the schema for how Tile video backgrounds are managed
 */
export class VideoData extends DocumentData<
  VideoDataSchema,
  VideoDataProperties,
  VideoDataSource,
  VideoDataConstructorData,
  documents.BaseTile
> {
  static override defineSchema(): VideoDataSchema;

  protected override _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VideoData extends VideoDataProperties {}
