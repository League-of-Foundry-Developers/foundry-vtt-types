import type { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from '../../../../types/helperTypes';
import type DocumentData from '../../abstract/data.mjs';
import type EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface PlaylistDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  description: fields.BlankString;
  sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound>;
  mode: DocumentField<foundry.CONST.PLAYLIST_MODES> & {
    type: typeof Number;
    required: true;
    default: typeof foundry.CONST.PLAYLIST_MODES.SEQUENTIAL;
    validate: (m: unknown) => m is foundry.CONST.PLAYLIST_MODES;
    validationError: 'Invalid {name} {field} provided which must be a value from CONST.PLAYLIST_MODES';
  };
  playing: fields.BooleanField;
  fade: fields.IntegerField;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  seed: fields.NonnegativeIntegerField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface PlaylistDataProperties {
  /**
   * The _id which uniquely identifies this Playlist document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The name of this playlist
   */
  name: string;

  /**
   * @defaultValue `""`
   */
  description: string;

  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   * @defaultValue `new EmbeddedCollection(PlaylistSoundData, [], BasePlaylistSound.implementation)`
   */
  sounds: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BasePlaylistSound>, PlaylistData>;

  /**
   * The playback mode for sounds in this playlist
   * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
   */
  mode: foundry.CONST.PLAYLIST_MODES;

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
  permission: Record<string, foundry.CONST.DOCUMENT_PERMISSION_LEVELS>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'Playlist'>;
}

interface PlaylistDataConstructorData {
  /**
   * The _id which uniquely identifies this Playlist document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this playlist
   */
  name: string;

  /**
   * @defaultValue `""`
   */
  description?: string | null | undefined;

  /**
   * A Collection of PlaylistSounds embedded documents which belong to this playlist
   * @defaultValue `new EmbeddedCollection(PlaylistSoundData, [], BasePlaylistSound.implementation)`
   */
  sounds?:
    | EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BasePlaylistSound>, PlaylistData>
    | null
    | undefined;

  /**
   * The playback mode for sounds in this playlist
   * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
   */
  mode?: foundry.CONST.PLAYLIST_MODES | null | undefined;

  /**
   * Is this playlist currently playing?
   * @defaultValue `false`
   */
  playing?: boolean | null | undefined;

  fade?: number | null | undefined;

  /**
   * The _id of a Folder which contains this playlist
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  seed?: number | null | undefined;

  /**
   * An object which configures user permissions to this playlist
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Record<string, foundry.CONST.DOCUMENT_PERMISSION_LEVELS> | null | undefined;

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
export class PlaylistData extends DocumentData<
  PlaylistDataSchema,
  PlaylistDataProperties,
  PropertiesToSource<PlaylistDataProperties>,
  PlaylistDataConstructorData,
  documents.BasePlaylist
> {
  /** @override */
  static defineSchema(): PlaylistDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistData extends PlaylistDataProperties {}
