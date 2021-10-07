import * as fields from '../fields.mjs';
import type { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import type DocumentData from '../../abstract/data.mjs';
import type { documents } from '../../module.mjs';

interface PlaylistSoundDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  description: typeof fields.BLANK_STRING;
  path: typeof fields.AUDIO_FIELD;
  playing: typeof fields.BOOLEAN_FIELD;
  pausedTime: FieldReturnType<typeof fields.NUMERIC_FIELD, { default: null }>;
  repeat: typeof fields.BOOLEAN_FIELD;
  volume: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.5 }>;
  fade: typeof fields.INTEGER_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface PlaylistSoundDataProperties {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   */
  _id: string | null;

  /**
   * The name of this sound track
   */
  name: string;

  /**
   * @defaultValue `''`
   */
  description: string;

  /**
   * The audio file path that is played by this sound
   */
  path: string | undefined | null;

  /**
   * Is this sound currently playing?
   * @defaultValue `false`
   */
  playing: boolean;

  /**
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

  fade: number | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'PlaylistSound'>;
}

interface PlaylistSoundDataConstructorData {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   */
  _id?: string | null | undefined;

  /**
   * The name of this sound track
   */
  name: string;

  /**
   * @defaultValue `''`
   */
  description?: string | null | undefined;

  /**
   * The audio file path that is played by this sound
   */
  path?: string | undefined | null;

  /**
   * Is this sound currently playing?
   * @defaultValue `false`
   */
  playing?: boolean | null | undefined;

  /**
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

  fade?: number | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'PlaylistSound'> | null | undefined;
}

/**
 * The data schema for a PlaylistSound embedded document.
 * @see BasePlaylistSound
 */
export declare class PlaylistSoundData extends DocumentData<
  PlaylistSoundDataSchema,
  PlaylistSoundDataProperties,
  PropertiesToSource<PlaylistSoundDataProperties>,
  PlaylistSoundDataConstructorData,
  documents.BasePlaylistSound
> {
  static defineSchema(): PlaylistSoundDataSchema;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistSoundData extends PlaylistSoundDataProperties {}
