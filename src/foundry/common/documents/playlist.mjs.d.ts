import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as documents from './module.mjs';
import * as fields from '../data/fields.mjs';
import { DocumentStatsSchema } from '../data/data.mjs';
import DataModel, { DataSchema } from '../abstract/data.mjs';
import type { FlagsField } from '../data/flagsField.js';

interface BasePlaylistSchema extends DataSchema {
  /**
   * The _id which uniquely identifies this Playlist document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The name of this playlist
   */
  name: fields.StringField<{ required: true; blank: false }>;

  /**
   * The description of this playlist
   */
  description: fields.StringField<{}>;

  // TODO causes circularly references in Playlist
  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   */
  //   sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound, {}>;

  /**
   * The playback mode for sounds in this playlist
   * (default: `0`)
   */
  mode: fields.NumberField<{
    required: true;
    choices: ValueOf<typeof CONST.PLAYLIST_MODES>[];
    initial: typeof CONST.PLAYLIST_MODES.SEQUENTIAL;
    validationError: 'must be a value in CONST.PLAYLIST_MODES';
  }>;

  /**
   * Is this playlist currently playing?
   * (default: `false`)
   */
  playing: fields.BooleanField<{}>;

  /**
   * A duration in milliseconds to fade volume transition
   */
  fade: fields.NumberField<{ positive: true }>;

  /**
   * The _id of a Folder which contains this playlist
   */
  folder: fields.ForeignDocumentField<typeof documents.BaseFolder, {}>;

  /**
   * The sorting mode used for this playlist.
   */
  sorting: fields.StringField<{
    required: true;
    choices: ValueOf<typeof CONST.PLAYLIST_SORT_MODES>[];
    initial: typeof CONST.PLAYLIST_SORT_MODES.ALPHABETICAL;
    validationError: 'must be a value in CONST.PLAYLIST_SORTING_MODES';
  }>;

  /**
   * A seed used for playlist randomization to guarantee that all clients generate the same random order.
   */
  seed: fields.NumberField<{ integer: true; min: 0 }>;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   */
  sort: typeof documents.BaseFolder.SORT_FIELD;

  /**
   * An object which configures ownership of this Playlist
   */
  ownership: fields.DocumentOwnershipField<{}>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Playlist', {}>;

  /**
   * An object of creation and access information
   */
  _stats: typeof DocumentStatsSchema;
}

type BasePlaylistMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Playlist';
    collection: 'playlists';
    compendiumIndexFields: ['_id', 'name', 'sort'];
    embedded: { PlaylistSound: 'sounds' };
    label: 'DOCUMENT.Playlist';
    labelPlural: 'DOCUMENT.Playlists';
  }
>;

type BasePlaylistShims = {
  /**
   * Rename permission to ownership
   * @deprecated since v10
   */
  permission: BasePlaylist['ownership'];
};

/**
 * The Document definition for a Playlist.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
declare class BasePlaylist extends Document<BasePlaylistSchema, null, BasePlaylistMetadata, BasePlaylistShims> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BasePlaylistMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BasePlaylistSchema;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override migrateData(data: Record<string, unknown>): Record<string, unknown>;

  /* ---------------------------------------- */

  /** {@inheritdoc} */
  static override shimData(data: Record<string, unknown>, options: DataModel.ShimDataOptions): Record<string, unknown>;
}

export default BasePlaylist;
