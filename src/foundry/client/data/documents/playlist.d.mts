import type { InexactPartial } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type { Document } from "../../../common/abstract/module.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";

declare global {
  namespace Playlist {
    /**
     * The implementation of the Playlist document instance configured through `CONFIG.Playlist.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredPlaylist | `fvtt-types/configuration/ConfiguredPlaylist`} in fvtt-types.
     */
    type Implementation = Document.ImplementationInstanceFor<"Playlist">;

    /**
     * The implementation of the Playlist document configured through `CONFIG.Playlist.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Playlist">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Playlist"> {}

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Playlist` that comes from the database.
     */
    interface Stored extends Document.Stored<Playlist.Implementation> {}

    /**
     * The data put in {@link DataModel._source | `DataModel._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Playlist._source | `Playlist._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Playlist.create | `Playlist.create`}
     * and {@link Playlist | `new Playlist(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Playlist.name | `Playlist#name`}.
     *
     * This is data transformed from {@link Playlist.Source | `Playlist.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Playlist.update | `Playlist#update`}.
     * It is a distinct type from {@link Playlist.CreateData | `DeepPartial<Playlist.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Playlist | `Playlist`}. This is the source of truth for how an Playlist document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Playlist | `Playlist`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
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
      sounds: fields.EmbeddedCollectionField<typeof documents.BasePlaylistSound, Playlist.Implementation>;

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
       * @defaultValue see {@link fields.DocumentOwnershipField | `fields.DocumentOwnershipField`}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Playlist">;

      /**
       * An object of creation and access information
       * @defaultValue see {@link fields.DocumentStatsField | `fields.DocumentStatsField`}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Playlists */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Playlist.Parent> {}
      /** Options passed along in Create operations for Playlists */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Playlist.CreateData, Playlist.Parent, Temporary> {}
      /** Options passed along in Delete operations for Playlists */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Playlist.Parent> {}
      /** Options passed along in Update operations for Playlists */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Playlist.UpdateData, Playlist.Parent> {}

      /** Options for {@link Playlist.createDocuments | `Playlist.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Playlist._preCreateOperation | `Playlist._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Playlist._preCreate | `Playlist#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOptions<Create>;
      /** Options for {@link Playlist._onCreate | `Playlist#_onCreate`} */
      type OnCreateOperation = Document.Database.CreateOptions<Create>;

      /** Options for {@link Playlist.updateDocuments | `Playlist.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateDocumentsOperation<Update>;
      /** Options for {@link Playlist._preUpdateOperation | `Playlist._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Playlist._preUpdate | `Playlist#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOptions<Update>;
      /** Options for {@link Playlist._onUpdate | `Playlist#_onUpdate`} */
      type OnUpdateOperation = Document.Database.UpdateOptions<Update>;

      /** Options for {@link Playlist.deleteDocuments | `Playlist.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteDocumentsOperation<Delete>;
      /** Options for {@link Playlist._preDeleteOperation | `Playlist._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Playlist._preDelete | `Playlist#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Playlist._onDelete | `Playlist#_onDelete`} */
      type OnDeleteOperation = Document.Database.DeleteOptions<Delete>;
    }

    /**
     * @deprecated {@link Playlist.DatabaseOperation | `Playlist.DatabaseOperation`}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Playlist> {}

    /**
     * @deprecated {@link Playlist.CreateData | `Playlist.CreateData`}
     */
    interface ConstructorData extends Playlist.CreateData {}

    /**
     * @deprecated {@link Playlist.implementation | `Playlist.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Playlist.Implementation | `Playlist.Implementation`}
     */
    type ConfiguredInstance = Implementation;
    interface PlayNextOptions {
      /**
       * Whether to advance forward (if 1) or backwards (if -1)
       * @defaultValue `1`
       */
      direction: 1 | -1;
    }
  }

  /**
   * The client-side Playlist document which extends the common BasePlaylist model.
   *
   * @see {@link Playlists | `Playlists`}             The world-level collection of Playlist documents
   * @see {@link PlaylistSound | `PlaylistSound`}         The PlaylistSound embedded document within a parent Playlist
   * @see {@link PlaylistConfig | `PlaylistConfig`}        The Playlist configuration application
   *
   */
  class Playlist extends ClientDocumentMixin(foundry.documents.BasePlaylist) {
    /**
     * @param data    - Initial data from which to construct the `Playlist`
     * @param context - Construction context options
     *
     * @deprecated Constructing `Playlist` directly is not advised. While `new Playlist(...)` would create a
     * temporary document it would not respect a system's subclass of `Playlist`, if any.
     *
     * You should use {@link Playlist.implementation | `new Playlist.implementation(...)`} instead which
     * will give you a system specific implementation of `Playlist`.
     */
    constructor(...args: Document.ConstructorParameters<Playlist.CreateData, Playlist.Parent>);

    /**
     * Playlists may have a playback order which defines the sequence of Playlist Sounds
     * @defaultValue `undefined`
     * @internal
     */
    protected _playbackOrder: string[] | undefined;

    /**
     * The order in which sounds within this playlist will be played (if sequential or shuffled)
     * Uses a stored seed for randomization to guarantee that all clients generate the same random order.
     */
    get playbackOrder(): string[];

    override get visible(): boolean;

    /**
     * Find all content links belonging to a given {@link Playlist | `Playlist`} or {@link PlaylistSound | `PlaylistSound`}.
     * @param doc - The Playlist or PlaylistSound.
     */
    static _getSoundContentLinks(doc: Playlist | PlaylistSound): NodeListOf<Element>;

    override prepareDerivedData(): void;

    /**
     * Begin simultaneous playback for all sounds in the Playlist.
     * @returns The updated Playlist document
     */
    playAll(): Promise<this | undefined>;

    /**
     * Play the next Sound within the sequential or shuffled Playlist.
     * @param soundId - The currently playing sound ID, if known
     * @param options - Additional options which configure the next track
     * @returns The updated Playlist document
     */
    playNext(soundId?: string, options?: Partial<Playlist.PlayNextOptions>): Promise<this | undefined | null>;

    /**
     * Begin playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    playSound(sound: PlaylistSound.Implementation): Promise<this | undefined>;

    /**
     * Stop playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    stopSound(sound: PlaylistSound.Implementation): Promise<this | undefined>;

    /**
     * End playback for any/all currently playing sounds within the Playlist.
     * @returns The updated Playlist document
     */
    stopAll(): Promise<this | undefined>;

    /**
     * Cycle the playlist mode
     * @returns A promise which resolves to the updated Playlist instance
     */
    cycleMode(): Promise<this | undefined>;

    /**
     * Get the next sound in the cached playback order. For internal use.
     * @internal
     */
    protected _getNextSound(soundId: string): PlaylistSound.Implementation | undefined;

    /**
     * Get the previous sound in the cached playback order. For internal use.
     * @internal
     */
    protected _getPreviousSound(soundId: string): PlaylistSound.Implementation | undefined;

    /**
     * Define the sorting order for the Sounds within this Playlist. For internal use.
     * If sorting alphabetically, the sounds are sorted with a locale-independent comparator
     * to ensure the same order on all clients.
     * @internal
     */
    protected _sortSounds(a: PlaylistSound.Implementation, b: PlaylistSound.Implementation): number;

    override toAnchor(
      options?: InexactPartial<{
        attrs: Record<string, string>;
        dataset: Record<string, string>;
        classes: string[];
        name: string;
        icon: string;
      }>,
    ): HTMLAnchorElement;

    override _onClickDocumentLink(event: MouseEvent): ReturnType<this["playAll" | "stopAll"]>;

    /**
     * @privateRemarks _preUpdate, _onUpdate, _onDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    protected override _onCreateDescendantDocuments(
      parent: Playlist.Stored,
      collection: PlaylistSound.ParentCollectionName,
      documents: PlaylistSound.Stored[],
      result: PlaylistSound.CreateData[],
      options: PlaylistSound.DatabaseOperation.OnCreateOperation,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: Playlist.Stored,
      collection: PlaylistSound.ParentCollectionName,
      documents: PlaylistSound.Stored[],
      changes: PlaylistSound.UpdateData[],
      options: PlaylistSound.DatabaseOperation.OnUpdateOperation,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: Playlist.Stored,
      collection: PlaylistSound.ParentCollectionName,
      documents: PlaylistSound.Stored[],
      ids: string[],
      options: PlaylistSound.DatabaseOperation.OnDeleteOperation,
      userId: string,
    ): void;

    /**
     * Handle callback logic when an individual sound within the Playlist concludes playback naturally
     * @internal
     */
    _onSoundEnd(sound: PlaylistSound.Implementation): Promise<this | undefined>;

    /**
     * Handle callback logic when playback for an individual sound within the Playlist is started.
     * Schedule auto-preload of next track
     * @internal
     */
    _onSoundStart(sound: PlaylistSound.Implementation): Promise<void>;

    toCompendium<Options extends ClientDocument.ToCompendiumOptions>(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null,
      options?: Options,
    ): ClientDocument.ToCompendiumReturnType<foundry.documents.BasePlaylist, Options>;

    /*
     * After this point these are not really overridden methods.
     * They are here because they're static properties but depend on the instance and so can't be
     * defined DRY-ly while also being easily overridable.
     */

    static override defaultName(context?: Document.DefaultNameContext<string, Playlist.Parent>): string;

    static override createDialog(
      data?: Document.CreateDialogData<Playlist.CreateData>,
      context?: Document.CreateDialogContext<string, Playlist.Parent>,
    ): Promise<Playlist.Stored | null | undefined>;

    static override fromDropData(
      data: Document.DropData<Playlist.Implementation>,
      options?: Document.FromDropDataOptions,
    ): Promise<Playlist.Implementation | undefined>;

    static override fromImport(
      source: Playlist.Source,
      context?: Document.FromImportContext<Playlist.Parent>,
    ): Promise<Playlist.Implementation>;
  }
}
