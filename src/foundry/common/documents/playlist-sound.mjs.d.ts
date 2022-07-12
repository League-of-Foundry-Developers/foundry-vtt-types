import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DataSchema } from '../abstract/module.mjs.js';
import type { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import type { FlagsField } from '../data/flagsField.js';

interface BasePlaylistSoundSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this PlaylistSound document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this sound
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The description of this sound
   */
  description: fields.StringField<{}>;

  /**
   * The audio file path that is played by this sound
   */
  path: fields.FilePathField<{ categories: ['AUDIO'] }>;

  /**
   * Is this sound currently playing?
   * (default: `false`)
   */
  playing: fields.BooleanField<{}>;

  /**
   * The time in seconds at which playback was paused
   * (default: `null`)
   */
  pausedTime: fields.NumberField<{ min: 0 }>;

  /**
   * Does this sound loop?
   * (default: `false`)
   */
  repeat: fields.BooleanField<{}>;

  /**
   * The audio volume of the sound, from 0 to 1
   * (default: `0.5`)
   */
  volume: fields.AlphaField<{ initial: 0.5; step: 0.01 }>;

  /**
   * A duration in milliseconds to fade volume transition
   */
  fade: fields.NumberField<{ integer: true; min: 0 }>;

  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'PlaylistSound', {}>;
}

type BasePlaylistSoundMetadata = Merge<
  DocumentMetadata,
  {
    name: 'PlaylistSound';
    collection: 'sounds';
    label: 'DOCUMENT.PlaylistSound';
    labelPlural: 'DOCUMENT.PlaylistSounds';
  }
>;

/**
 * The Document definition for a PlaylistSound.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 */
declare class BasePlaylistSound extends Document<
  BasePlaylistSoundSchema,
  InstanceType<ConfiguredDocumentClass<typeof documents.BasePlaylist>>,
  BasePlaylistSoundMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BasePlaylistSoundMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BasePlaylistSoundSchema;

  /* -------------------------------------------- */
  /*  Model Methods                               */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }?: { exact?: boolean }
  ): boolean;
}

export default BasePlaylistSound;
