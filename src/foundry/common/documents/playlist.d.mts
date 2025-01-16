import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Playlist Document.
 * Defines the DataSchema and common behaviors for a Playlist which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BasePlaylist extends Document<"Playlist", BasePlaylist.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Playlist
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BasePlaylist.ConstructorData, context?: Document.ConstructionContext<BasePlaylist.Parent>);

  override parent: BasePlaylist.Parent;

  static override metadata: BasePlaylist.Metadata;

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

  static [Document.Internal.DocumentName]: "Playlist";
}

export default BasePlaylist;

declare namespace BasePlaylist {
  type Parent = null;

  type Metadata = Document.MetadataFor<"Playlist">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;
  interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

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
     * A channel in CONST.AUDIO_CHANNELS where all sounds in this playlist are played
     * @defaultValue `"music"`
     */
    channel: fields.StringField<{ choices: typeof foundry.CONST.AUDIO_CHANNELS; initial: string; blank: false }>;

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
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

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
