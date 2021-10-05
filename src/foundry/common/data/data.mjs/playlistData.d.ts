import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

import type { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from '../../../../types/helperTypes';
import type EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import type DocumentData from '../../abstract/data.mjs';

interface PlaylistDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  description: typeof fields.BLANK_STRING;
  sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound>;
  mode: DocumentField<foundry.CONST.PlaylistMode> & {
    type: typeof Number;
    required: true;
    default: typeof CONST.PLAYLIST_MODES.SEQUENTIAL;
    validate: (m: unknown) => m is foundry.CONST.PlaylistMode;
    validationError: 'Invalid {name} {field} provided which must be a value from CONST.PLAYLIST_MODES';
  };
  playing: typeof fields.BOOLEAN_FIELD;
  fade: typeof fields.INTEGER_FIELD;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  seed: typeof fields.NONNEGATIVE_INTEGER_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.OBJECT_FIELD;
}

interface PlaylistDataProperties {
  /**
   * The _id which uniquely identifies this Playlist document
   */
  _id: string | null;

  /**
   * The name of this playlist
   */
  name: string;

  /**
   * @defaultValue `''`
   */
  description: string;

  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   */
  sounds: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BasePlaylistSound>, PlaylistData>;

  /**
   * The playback mode for sounds in this playlist
   * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
   */
  mode: foundry.CONST.PlaylistMode;

  /**
   * Is this playlist currently playing?
   * @defaultValue `false`
   */
  playing: boolean;

  fade: number | undefined;

  /**
   * The _id of a Folder which contains this playlist
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  seed: number | undefined;

  /**
   * An object which configures user permissions to this playlist
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Record<string, foundry.CONST.EntityPermission>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Playlist'>;
}

interface PlaylistDataConstructorData {
  /**
   * The _id which uniquely identifies this Playlist document
   */
  _id?: string | null | undefined;

  /**
   * The name of this playlist
   */
  name: string;

  /**
   * @defaultValue `''`
   */
  description?: string | null | undefined;

  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   */
  sounds?:
    | EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BasePlaylistSound>, PlaylistData>
    | null
    | undefined;

  /**
   * The playback mode for sounds in this playlist
   * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
   */
  mode?: foundry.CONST.PlaylistMode | null | undefined;

  /**
   * Is this playlist currently playing?
   * @defaultValue `false`
   */
  playing?: boolean | null | undefined;

  fade?: number | undefined | null;

  /**
   * The _id of a Folder which contains this playlist
   * @defaultValue `null`
   */
  folder?: string | null | undefined;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  seed?: number | undefined | null;

  /**
   * An object which configures user permissions to this playlist
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Record<string, foundry.CONST.EntityPermission> | undefined | null;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'Playlist'> | null | undefined;
}

/**
 * The data schema for a Playlist document.
 * @see BasePlaylist
 */
export declare class PlaylistData extends DocumentData<
  PlaylistDataSchema,
  PlaylistDataProperties,
  PropertiesToSource<PlaylistDataProperties>,
  PlaylistDataConstructorData,
  documents.BasePlaylist
> {
  static defineSchema(): PlaylistDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistData extends PlaylistDataProperties {}
