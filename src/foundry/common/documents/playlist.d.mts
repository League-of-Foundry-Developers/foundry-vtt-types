import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type PlaylistData = BasePlaylist.Properties;
}

/**
 * The Document definition for a Playlist.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BasePlaylist extends Document<BasePlaylist.Schema, BasePlaylist.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Playlist
   * @param context - Construction context options
   */
  constructor(data: BasePlaylist.ConstructorData, context?: Document.ConstructionContext<BasePlaylist.Parent>);

  override parent: BasePlaylist.Parent;

  static override metadata: Readonly<BasePlaylist.Metadata>;

  static override defineSchema(): BasePlaylist.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BasePlaylist;

declare namespace BasePlaylist {
  type Parent = null;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "Playlist";
      collection: "playlists";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "sort", "folder"];
      embedded: { PlaylistSound: "sounds" };
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Playlist document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this playlist
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The description of this playlist
     * @defaultValue `""`
     */
    description: fields.StringField<{ textSearch: true }>;

    /**
     * A Collection of PlaylistSounds embedded documents which belong to this playlist
     * @defaultValue `[]`
     */
    sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound, Playlist.ConfiguredInstance>;

    /**
     * The playback mode for sounds in this playlist
     * @defaultValue `CONST.PLAYLIST_MODES.SEQUENTIAL`
     */
    mode: fields.NumberField<{
      required: true;
      choices: foundry.CONST.PLAYLIST_MODES[];
      initial: typeof CONST.PLAYLIST_MODES.SEQUENTIAL;
      validationError: "must be a value in CONST.PLAYLIST_MODES";
    }>;

    /**
     * Is this playlist currently playing?
     * @defaultValue `false`
     */
    playing: fields.BooleanField;

    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `null`
     */
    fade: fields.NumberField<{ positive: true }>;

    /**
     * The _id of a Folder which contains this playlist
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

    /**
     * The sorting mode used for this playlist.
     * @defaultValue `CONST.PLAYLIST_SORT_MODES.ALPHABETICAL`
     */
    sorting: fields.StringField<{
      required: true;
      choices: foundry.CONST.PLAYLIST_SORT_MODES[];
      initial: typeof CONST.PLAYLIST_SORT_MODES.ALPHABETICAL;
      validationError: "must be a value in CONST.PLAYLIST_SORTING_MODES";
    }>;

    /**
     * A seed used for playlist randomization to guarantee that all clients generate the same random order.
     * @defaultValue `null`
     */
    seed: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The numeric sort value which orders this playlist relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Playlist
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Playlist">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
