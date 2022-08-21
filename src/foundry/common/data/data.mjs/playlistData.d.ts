import type { ConfiguredDocumentClass, ConfiguredFlags, PropertiesToSource } from "../../../../types/helperTypes";
import type DocumentData from "../../abstract/data.mjs";
import type EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

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
    validationError: "Invalid {name} {field} provided which must be a value from CONST.PLAYLIST_MODES";
  };
  playing: fields.BooleanField;
  fade: fields.IntegerField;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sorting: DocumentField<foundry.CONST.PLAYLIST_SORT_MODES> & {
    type: foundry.CONST.PLAYLIST_SORT_MODES;
    required: true;
    default: typeof foundry.CONST.PLAYLIST_SORT_MODES.ALPHABETICAL;
    validate: (m: unknown) => m is foundry.CONST.PLAYLIST_SORT_MODES;
    validationError: "Invalid Playlist sorting mode";
  };
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
   * The description of this playlist
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

  /** A duration in milliseconds to fade volume transition */
  fade: number | undefined;

  /**
   * The _id of a Folder which contains this playlist
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The sorting mode used for this playlist.
   * @defaultValue `CONST.PLAYLIST_SORT_MODES.ALPHABETICAL`
   */
  sorting: foundry.CONST.PLAYLIST_SORT_MODES;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /** A seed used for playlist randomization to guarantee that all clients generate the same random order. */
  seed: number | undefined;

  /**
   * An object which configures user permissions to this playlist
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Playlist">;
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
   * The description of this playlist
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

  /** A duration in milliseconds to fade volume transition */
  fade?: number | null | undefined;

  /**
   * The _id of a Folder which contains this playlist
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The sorting mode used for this playlist.
   * @defaultValue `CONST.PLAYLIST_SORT_MODES.ALPHABETICAL`
   */
  sorting?: foundry.CONST.PLAYLIST_SORT_MODES | null | undefined;

  /**
   * The numeric sort value which orders this playlist relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /** A seed used for playlist randomization to guarantee that all clients generate the same random order. */
  seed?: number | null | undefined;

  /**
   * An object which configures user permissions to this playlist
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS> | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Playlist"> | null | undefined;
}

type PlaylistDataSource = PropertiesToSource<PlaylistDataProperties>;

/**
 * The data schema for a Playlist document.
 * @see BasePlaylist
 */
export class PlaylistData extends DocumentData<
  PlaylistDataSchema,
  PlaylistDataProperties,
  PlaylistDataSource,
  PlaylistDataConstructorData,
  documents.BasePlaylist
> {
  static override defineSchema(): PlaylistDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PlaylistData extends PlaylistDataProperties {}
