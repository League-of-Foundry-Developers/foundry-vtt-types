import type { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import type DocumentData from '../../abstract/data.mjs';
import type { documents } from '../../module.mjs';
import * as fields from '../fields.mjs';

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
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this sound track
   */
  name: string;

  /**
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
export class PlaylistSoundData extends DocumentData<
  PlaylistSoundDataSchema,
  PlaylistSoundDataProperties,
  PropertiesToSource<PlaylistSoundDataProperties>,
  PlaylistSoundDataConstructorData,
  documents.BasePlaylistSound
> {
  /** @override */
  static defineSchema(): PlaylistSoundDataSchema;

  /** @override */
  protected _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistSoundData extends PlaylistSoundDataProperties {}
