import type { InexactPartial } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";

/**
 * The PlaylistSound Document.
 * Defines the DataSchema and common behaviors for a PlaylistSound which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BasePlaylistSound extends Document<"PlaylistSound", BasePlaylistSound.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the PlaylistSound
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(
  //   data: BasePlaylistSound.ConstructorData,
  //   context?: Document.ConstructionContext<BasePlaylistSound.Parent>,
  // );

  override parent: BasePlaylistSound.Parent;

  static override metadata: Readonly<BasePlaylistSound.Metadata>;

  static override defineSchema(): BasePlaylistSound.Schema;

  override testUserPermission(
    user: foundry.documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;
}

export default BasePlaylistSound;

declare namespace BasePlaylistSound {
  type Parent = Playlist.ConfiguredInstance | null;

  type Metadata = Document.MetadataForName<"PlaylistSound">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this PlaylistSound document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this sound
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * The description of this sound
     * @defaultValue `""`
     */
    description: fields.StringField;

    /**
     * The audio file path that is played by this sound
     * @defaultValue `null`
     */
    path: fields.FilePathField<{ categories: ["AUDIO"] }>;

    /**
     * A channel in CONST.AUDIO_CHANNELS where this sound is are played
     * @defaultValue `"music"`
     */
    channel: fields.StringField<{ choices: typeof foundry.CONST.AUDIO_CHANNELS; initial: string; blank: false }>;

    /**
     * Is this sound currently playing?
     * @defaultValue `false`
     */
    playing: fields.BooleanField;

    /**
     * The time in seconds at which playback was paused
     * @defaultValue `null`
     */
    pausedTime: fields.NumberField<{ min: 0 }>;

    /**
     * Does this sound loop?
     * @defaultValue `false`
     */
    repeat: fields.BooleanField;

    /**
     * The audio volume of the sound, from 0 to 1
     * @defaultValue `1`
     */
    volume: fields.AlphaField<{ initial: 0.5; step: 0.01 }>;

    /**
     * A duration in milliseconds to fade volume transition
     * @defaultValue `null`
     */
    fade: fields.NumberField<{ integer: true; min: 0 }>;

    /**
     * The sort order of the PlaylistSound relative to others in the same collection
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"PlaylistSound">;
  }
}
