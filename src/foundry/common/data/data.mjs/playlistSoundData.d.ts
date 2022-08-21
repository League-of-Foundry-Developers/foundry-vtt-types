import type { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import type DocumentData from "../../abstract/data.mjs";
import type { documents } from "../../module.mjs";
import * as fields from "../fields.mjs";

interface PlaylistSoundDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  description: fields.BlankString;
  path: fields.AudioField;
  playing: fields.BooleanField;
  pausedTime: FieldReturnType<fields.NumericField, { default: null }>;
  repeat: fields.BooleanField;
  volume: FieldReturnType<fields.AlphaField, { default: 0.5 }>;
  fade: fields.IntegerField;
  sort: fields.IntegerSortField;
  flags: fields.ObjectField;
}

interface PlaylistSoundDataProperties {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this sound track
   */
  name: string;

  /**
   * The description of this sound track
   * @defaultValue `""`
   */
  description: string;

  /**
   * The audio file path that is played by this sound
   */
  path: string | null | undefined;

  /**
   * Is this sound currently playing?
   * @defaultValue `false`
   */
  playing: boolean;

  /**
   * The time in seconds at which playback was paused
   * @defaultValue `null`
   */
  pausedTime: number | null;

  /**
   * Does this sound loop?
   * @defaultValue `false`
   */
  repeat: boolean;

  /**
   * The audio volume of the sound, from 0 to 1
   * @defaultValue `0.5`
   */
  volume: number;

  /** A duration in milliseconds to fade volume transition */
  fade: number | undefined;

  /** @defaultValue `0` */
  sort: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"PlaylistSound">;
}

interface PlaylistSoundDataConstructorData {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this sound track
   */
  name: string;

  /**
   * The description of this sound track
   * @defaultValue `""`
   */
  description?: string | null | undefined;

  /**
   * The audio file path that is played by this sound
   */
  path?: string | null | undefined;

  /**
   * Is this sound currently playing?
   * @defaultValue `false`
   */
  playing?: boolean | null | undefined;

  /**
   * The time in seconds at which playback was paused
   * @defaultValue `null`
   */
  pausedTime?: number | null | undefined;

  /**
   * Does this sound loop?
   * @defaultValue `false`
   */
  repeat?: boolean | null | undefined;

  /**
   * The audio volume of the sound, from 0 to 1
   * @defaultValue `0.5`
   */
  volume?: number | null | undefined;

  /** A duration in milliseconds to fade volume transition */
  fade?: number | null | undefined;

  /** @defaultValue `0` */
  sort: number | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"PlaylistSound"> | null | undefined;
}

type PlaylistSoundDataSource = PropertiesToSource<PlaylistSoundDataProperties>;

/**
 * The data schema for a PlaylistSound embedded document.
 * @see BasePlaylistSound
 */
export class PlaylistSoundData extends DocumentData<
  PlaylistSoundDataSchema,
  PlaylistSoundDataProperties,
  PlaylistSoundDataSource,
  PlaylistSoundDataConstructorData,
  documents.BasePlaylistSound
> {
  static override defineSchema(): PlaylistSoundDataSchema;

  protected override _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistSoundData extends PlaylistSoundDataProperties {}
