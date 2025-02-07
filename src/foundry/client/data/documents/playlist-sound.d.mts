import type { InexactPartial } from "fvtt-types/utils";
import type Sound from "../../../client-esm/audio/sound.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace PlaylistSound {
    /**
     * The implementation of the PlaylistSound document instance configured through `CONFIG.PlaylistSound.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredPlaylistSound | `configuration/ConfiguredPlaylistSound`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"PlaylistSound">;

    /**
     * The implementation of the PlaylistSound document configured through `CONFIG.PlaylistSound.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"PlaylistSound">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"PlaylistSound"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Playlist.Implementation | null;

    /**
     * An instance of `PlaylistSound` that comes from the database.
     */
    interface Stored extends Document.Stored<PlaylistSound.Implementation> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link PlaylistSound._source | `PlaylistSound._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link PlaylistSound.create | `PlaylistSound.create`}
     * and {@link PlaylistSound | `new PlaylistSound(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link PlaylistSound.name | `PlaylistSound#name`}.
     *
     * This is data transformed from {@link PlaylistSound.Source | `PlaylistSound.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link PlaylistSound.update | `PlaylistSound#update`}.
     * It is a distinct type from {@link PlaylistSound.CreateData | `DeepPartial<PlaylistSound.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link PlaylistSound | `PlaylistSound`}. This is the source of truth for how an PlaylistSound document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link PlaylistSound | `PlaylistSound`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
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

    namespace DatabaseOperation {
      /** Options passed along in Get operations for PlaylistSounds */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<PlaylistSound.Parent> {}
      /** Options passed along in Create operations for PlaylistSounds */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<
          PlaylistSound.CreateData,
          PlaylistSound.Parent,
          Temporary
        > {}
      /** Options passed along in Delete operations for PlaylistSounds */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<PlaylistSound.Parent> {}
      /** Options passed along in Update operations for PlaylistSounds */
      interface Update
        extends foundry.abstract.types.DatabaseUpdateOperation<PlaylistSound.UpdateData, PlaylistSound.Parent> {}

      /** Options for {@link PlaylistSound.createDocuments | `PlaylistSound.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link PlaylistSound._preCreateOperation | `PlaylistSound._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link PlaylistSound#_preCreate | `PlaylistSound#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link PlaylistSound#_onCreate | `PlaylistSound#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link PlaylistSound.updateDocuments | `PlaylistSound.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link PlaylistSound._preUpdateOperation | `PlaylistSound._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link PlaylistSound#_preUpdate | `PlaylistSound#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link PlaylistSound#_onUpdate | `PlaylistSound#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link PlaylistSound.deleteDocuments | `PlaylistSound.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link PlaylistSound._preDeleteOperation | `PlaylistSound._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link PlaylistSound#_preDelete | `PlaylistSound#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link PlaylistSound#_onDelete | `PlaylistSound#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link PlaylistSound.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<PlaylistSound> {}

    /**
     * @deprecated {@link PlaylistSound.CreateData | `PlaylistSound.CreateData`}
     */
    interface ConstructorData extends PlaylistSound.CreateData {}

    /**
     * @deprecated {@link PlaylistSound.implementation | `PlaylistSound.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link PlaylistSound.Implementation | `PlaylistSound.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side PlaylistSound document which extends the common BasePlaylistSound model.
   * Each PlaylistSound belongs to the sounds collection of a Playlist document.
   *
   * @see {@link Playlist}                       The Playlist document which contains PlaylistSound embedded documents
   * @see {@link PlaylistSoundConfig}   The PlaylistSound configuration application
   * @see {@link Sound}                          The Sound API which manages web audio playback
   *
   */
  class PlaylistSound extends ClientDocumentMixin(foundry.documents.BasePlaylistSound) {
    /**
     * @param data    - Initial data from which to construct the `PlaylistSound`
     * @param context - Construction context options
     *
     * @deprecated Constructing `PlaylistSound` directly is not advised. While `new PlaylistSound(...)` would create a
     * temporary document it would not respect a system's subclass of `PlaylistSound`, if any.
     *
     * You should use {@link PlaylistSound.implementation | `new PlaylistSound.implementation(...)`} instead which
     * will give you a system specific implementation of `PlaylistSound`.
     */
    constructor(...args: Document.ConstructorParameters<PlaylistSound.CreateData, PlaylistSound.Parent>);

    /**
     * The debounce tolerance for processing rapid volume changes into database updates in milliseconds
     * @defaultValue `100`
     */
    static VOLUME_DEBOUNCE_MS: number;

    /**
     * The Sound which manages playback for this playlist sound
     */
    sound: Sound | null;

    /**
     * A debounced function, accepting a single volume parameter to adjust the volume of this sound
     * @param volume - The desired volume level
     */
    debounceVolume: (volume: number) => void;

    /**
     * Create a Sound used to play this PlaylistSound document
     * @internal
     */
    protected _createSound(): Sound | null;

    /**
     * Determine the fade duration for this PlaylistSound based on its own configuration and that of its parent.
     */
    get fadeDuration(): number;

    /**
     * The audio context within which this sound is played.
     * This will be undefined if the audio context is not yet active.
     */
    get context(): AudioContext | undefined;

    /**
     * Synchronize playback for this particular PlaylistSound instance
     */
    sync(): void | Promise<void> | Promise<Sound>;

    /**
     * Load the audio for this sound for the current client.
     */
    load(): Promise<void>;

    toAnchor(
      options?: InexactPartial<{
        attrs: Record<string, string>;
        dataset: Record<string, string>;
        classes: string[];
        name: string;
        icon: string;
      }>,
    ): HTMLAnchorElement;

    _onClickDocumentLink(event: MouseEvent): ReturnType<Playlist.Implementation["stopSound" | "playSound"]>;

    /**
     * @privateRemarks _onCreate, _onUpdate, and _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Special handling that occurs when playback of a PlaylistSound is started.
     * @internal
     */
    protected _onStart(): Promise<void>;

    /**
     * Special handling that occurs when a PlaylistSound reaches the natural conclusion of its playback.
     * @internal
     */
    protected _onEnd(): Promise<void | Playlist.Implementation | undefined>;

    /**
     * Special handling that occurs when a PlaylistSound is manually stopped before its natural conclusion.
     * @internal
     */
    protected _onStop(): Promise<void>;

    /**
     * The effective volume at which this playlist sound is played, incorporating the global playlist volume setting.
     * @deprecated PlaylistSound#effectiveVolume is deprecated in favor of using PlaylistSound#volume directly
     *
     */
    get effectiveVolume(): number;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context: Document.DefaultNameContext<"base", Exclude<PlaylistSound.Parent, null>>): string;

    static override createDialog(
      data: Document.CreateDialogData<PlaylistSound.CreateData>,
      context: Document.CreateDialogContext<string, Exclude<PlaylistSound.Parent, null>>,
    ): Promise<PlaylistSound.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<PlaylistSound.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<PlaylistSound.Implementation | undefined>;

    static override fromImport(
      source: PlaylistSound.Source,
      context?: Document.FromImportContext<PlaylistSound.Parent>,
    ): Promise<PlaylistSound.Implementation>;
  }
}
