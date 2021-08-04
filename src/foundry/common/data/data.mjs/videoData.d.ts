import { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes.js';
import { DocumentData } from '../../abstract/module.mjs';
import { documents } from '../../module.mjs';
import * as fields from '../fields.mjs';

interface VideoDataSchema extends DocumentSchema {
  loop: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  autoplay: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  volume: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
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

export interface VideoDataConstructorData {
  /**
   * Automatically loop the video?
   * @defaultValue `true`
   */
  loop?: boolean | null;

  /**
   * Should the video play automatically?
   * @defaultValue `true`
   */
  autoplay?: boolean | null;

  /**
   * The volume level of any audio that the video file contains
   * @defaultValue `0`
   */
  volume?: number | null;
}

/**
 * An inner-object which defines the schema for how Tile video backgrounds are managed
 */
export declare class VideoData extends DocumentData<
  VideoDataSchema,
  VideoDataProperties,
  PropertiesToSource<VideoDataProperties>,
  VideoDataConstructorData,
  documents.BaseTile
> {
  static defineSchema(): VideoDataSchema;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VideoData extends VideoDataProperties {}
