import type { InexactPartial, Merge } from "fvtt-types/utils";
import type { documents } from "#client-esm/client.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { fields } from "#common/data/_module.d.mts";

declare global {
  namespace Playlist {
    /**
     * The document's name.
     */
    type Name = "Playlist";

    /**
     * The arguments to construct the document.
     */
    type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

    /**
     * The documents embedded within `Playlist`.
     */
    type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

    /**
     * The implementation of the `Playlist` document instance configured through `CONFIG.Playlist.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} or {@link ConfiguredPlaylist | `fvtt-types/configuration/ConfiguredPlaylist`} in fvtt-types.
     */
    type Implementation = Document.ImplementationFor<"Playlist">;

    /**
     * The implementation of the `Playlist` document configured through `CONFIG.Playlist.documentClass` in Foundry and
     * {@linkcode DocumentClassConfig} in fvtt-types.
     */
    type ImplementationClass = Document.ImplementationClassFor<"Playlist">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata
      extends Merge<
        Document.Metadata.Default,
        Readonly<{
          name: "Playlist";
          collection: "playlists";
          indexed: true;
          compendiumIndexFields: ["_id", "name", "sort", "folder"];
          embedded: Metadata.Embedded;
          label: string;
          labelPlural: string;
          permissions: Metadata.Permissions;
          schemaVersion: string;
        }>
      > {}

    namespace Metadata {
      /**
       * The embedded metadata
       */
      interface Embedded {
        PlaylistSound: "sounds";
      }

      /**
       * The permissions for whether a certain user can create, update, or delete this document.
       */
      interface Permissions {
        create: "PLAYLIST_CREATE";
      }
    }

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * A document's direct descendants are documents that are contained directly within its schema.
     * This is a union of all such instances, or never if the document doesn't have any descendants.
     */
    type DirectDescendant = PlaylistSound.Stored;

    /**
     * A document's direct descendants are documents that are contained directly within its schema.
     * This is a union of all such classes, or never if the document doesn't have any descendants.
     */
    type DirectDescendantClass = PlaylistSound.ImplementationClass;

    /**
     * A document's descendants are any documents that are contained within, either within its schema
     * or its descendant's schemas.
     * This is a union of all such instances, or never if the document doesn't have any descendants.
     */
    type Descendant = DirectDescendant;

    /**
     * A document's descendants are any child documents, grandchild documents, etc.
     * This is a union of all classes, or never if the document doesn't have any descendants.
     */
    type DescendantClass = DirectDescendantClass;

    /**
     * Types of `CompendiumCollection` this document might be contained in.
     * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
     */
    // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
    type Pack = CompendiumCollection.ForDocument<"Playlist">;

    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Embedded = Document.ImplementationFor<Embedded.Name>;

    namespace Embedded {
      /**
       * An embedded document is a document contained in another.
       * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
       *
       * If this is `never` it is because there are no embeddable documents (or there's a bug!).
       */
      type Name = keyof Metadata.Embedded;

      /**
       * Gets the collection name for an embedded document.
       */
      type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
        Metadata.Embedded,
        CollectionName
      >;

      /**
       * Gets the collection document for an embedded document.
       */
      // TODO(LukeAbby): There's a circularity. Should be `Document.Embedded.CollectionDocumentFor<Metadata.Embedded, CollectionName>`
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Any;

      /**
       * Gets the collection for an embedded document.
       */
      type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
        // TODO(LukeAbby): This should be `TokenDocument.Implementation` but this causes a circularity.
        Document.Any,
        Metadata.Embedded,
        CollectionName
      >;

      /**
       * A valid name to refer to a collection embedded in this document. For example an `Actor`
       * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
       * valid keys (amongst others).
       */
      type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
    }

    /**
     * The name of the world or embedded collection this document can find itself in.
     * For example an `Item` is always going to be inside a collection with a key of `items`.
     * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
     */
    type ParentCollectionName = Metadata["collection"];

    /**
     * The world collection that contains `Playlist`s. Will be `never` if none exists.
     */
    type CollectionClass = Playlists.ConfiguredClass;

    /**
     * The world collection that contains `Playlist`s. Will be `never` if none exists.
     */
    type Collection = Playlists.Configured;

    /**
     * An instance of `Playlist` that comes from the database but failed validation meaining that
     * its `system` and `_source` could theoretically be anything.
     */
    interface Invalid extends Document.Invalid<Playlist.Implementation> {}

    /**
     * An instance of `Playlist` that comes from the database.
     */
    interface Stored extends Document.Stored<Playlist.Implementation> {}

    /**
     * The data put in {@link Playlist._source | `Playlist#_source`}.. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@linkcode Set}.
     */
    interface Source extends fields.SchemaField.SourceData<Schema> {}

    /**
     * @deprecated Replaced with {@linkcode Playlist.Source}
     */
    type PersistedData = Source;

    /**
     * The data necessary to create a document. Used in places like {@linkcode Playlist.create}
     * and {@link Playlist | `new Playlist(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
     * {@link Playlist.name | `Playlist#name`}.
     *
     * This is data transformed from {@linkcode Playlist.Source} and turned into more
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
     * The schema for {@linkcode Playlist}. This is the source of truth for how an Playlist document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@linkcode Playlist}. For example
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
       * @defaultValue see {@linkcode fields.DocumentOwnershipField}
       */
      ownership: fields.DocumentOwnershipField;

      /**
       * An object of optional key/value flags
       * @defaultValue `{}`
       */
      flags: fields.ObjectField.FlagsField<"Playlist">;

      /**
       * An object of creation and access information
       * @defaultValue see {@linkcode fields.DocumentStatsField}
       */
      _stats: fields.DocumentStatsField;
    }

    namespace Database {
      /** Options passed along in Get operations for Playlists */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Playlist.Parent> {}

      /** Options passed along in Create operations for Playlists */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Playlist.CreateData, Playlist.Parent, Temporary> {}

      /** Options passed along in Delete operations for Playlists */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Playlist.Parent> {}

      /** Options passed along in Update operations for Playlists */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Playlist.UpdateData, Playlist.Parent> {}

      /** Operation for {@linkcode Playlist.createDocuments} */
      interface CreateDocumentsOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Playlist.Database.Create<Temporary>> {}

      /** Operation for {@linkcode Playlist.updateDocuments} */
      interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Playlist.Database.Update> {}

      /** Operation for {@linkcode Playlist.deleteDocuments} */
      interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Playlist.Database.Delete> {}

      /** Operation for {@linkcode Playlist.create} */
      interface CreateOperation<Temporary extends boolean | undefined>
        extends Document.Database.CreateOperation<Playlist.Database.Create<Temporary>> {}

      /** Operation for {@link Playlist.update | `Playlist#update`} */
      interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

      interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

      /** Options for {@linkcode Playlist.get} */
      interface GetOptions extends Document.Database.GetOptions {}

      /** Options for {@link Playlist._preCreate | `Playlist#_preCreate`} */
      interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

      /** Options for {@link Playlist._onCreate | `Playlist#_onCreate`} */
      interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

      /** Operation for {@linkcode Playlist._preCreateOperation} */
      interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Playlist.Database.Create> {}

      /** Operation for {@link Playlist._onCreateOperation | `Playlist#_onCreateOperation`} */
      interface OnCreateOperation extends Playlist.Database.Create {}

      /** Options for {@link Playlist._preUpdate | `Playlist#_preUpdate`} */
      interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

      /** Options for {@link Playlist._onUpdate | `Playlist#_onUpdate`} */
      interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

      /** Operation for {@linkcode Playlist._preUpdateOperation} */
      interface PreUpdateOperation extends Playlist.Database.Update {}

      /** Operation for {@link Playlist._onUpdateOperation | `Playlist._preUpdateOperation`} */
      interface OnUpdateOperation extends Playlist.Database.Update {}

      /** Options for {@link Playlist._preDelete | `Playlist#_preDelete`} */
      interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

      /** Options for {@link Playlist._onDelete | `Playlist#_onDelete`} */
      interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

      /** Options for {@link Playlist._preDeleteOperation | `Playlist#_preDeleteOperation`} */
      interface PreDeleteOperation extends Playlist.Database.Delete {}

      /** Options for {@link Playlist._onDeleteOperation | `Playlist#_onDeleteOperation`} */
      interface OnDeleteOperation extends Playlist.Database.Delete {}

      /** Context for {@linkcode Playlist._onDeleteOperation} */
      interface OnDeleteDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

      /** Context for {@linkcode Playlist._onCreateDocuments} */
      interface OnCreateDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

      /** Context for {@linkcode Playlist._onUpdateDocuments} */
      interface OnUpdateDocumentsContext extends Document.ModificationContext<Playlist.Parent> {}

      /**
       * Options for {@link Playlist._preCreateDescendantDocuments | `Playlist#_preCreateDescendantDocuments`}
       * and {@link Playlist._onCreateDescendantDocuments | `Playlist#_onCreateDescendantDocuments`}
       */
      interface CreateOptions extends Document.Database.CreateOptions<Playlist.Database.Create> {}

      /**
       * Options for {@link Playlist._preUpdateDescendantDocuments | `Playlist#_preUpdateDescendantDocuments`}
       * and {@link Playlist._onUpdateDescendantDocuments | `Playlist#_onUpdateDescendantDocuments`}
       */
      interface UpdateOptions extends Document.Database.UpdateOptions<Playlist.Database.Update> {}

      /**
       * Options for {@link Playlist._preDeleteDescendantDocuments | `Playlist#_preDeleteDescendantDocuments`}
       * and {@link Playlist._onDeleteDescendantDocuments | `Playlist#_onDeleteDescendantDocuments`}
       */
      interface DeleteOptions extends Document.Database.DeleteOptions<Playlist.Database.Delete> {}
    }

    /**
     * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
     */
    interface Flags extends Document.ConfiguredFlagsForName<Name> {}

    namespace Flags {
      /**
       * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
       */
      type Scope = Document.FlagKeyOf<Flags>;

      /**
       * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
       */
      type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

      /**
       * Gets the type of a particular flag given a `Scope` and a `Key`.
       */
      type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
    }

    type PreCreateDescendantDocumentsArgs = Document.PreCreateDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    type OnCreateDescendantDocumentsArgs = Document.OnCreateDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    type PreUpdateDescendantDocumentsArgs = Document.PreUpdateDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    type OnUpdateDescendantDocumentsArgs = Document.OnUpdateDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    type PreDeleteDescendantDocumentsArgs = Document.PreDeleteDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    type OnDeleteDescendantDocumentsArgs = Document.OnDeleteDescendantDocumentsArgs<
      Playlist.Stored,
      Playlist.DirectDescendant,
      Playlist.Metadata.Embedded
    >;

    /**
     * @deprecated Replaced with {@linkcode Playlist.Database.Operation}
     */
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    interface DatabaseOperations extends Document.Database.Operations<Playlist.Implementation> {}

    /**
     * @deprecated Replaced with {@linkcode Playlist.CreateData}
     */
    interface ConstructorData extends Playlist.CreateData {}

    /**
     * @deprecated Replaced with {@link Playlist.implementation | `Playlist.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated Replaced with {@linkcode Playlist.Implementation}
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
   * @see {@linkcode Playlists}             The world-level collection of Playlist documents
   * @see {@linkcode PlaylistSound}         The PlaylistSound embedded document within a parent Playlist
   * @see {@linkcode PlaylistConfig}        The Playlist configuration application
   *
   */
  class Playlist extends ClientDocumentMixin(foundry.documents.BasePlaylist) {
    /**
     * @param data    - Initial data from which to construct the `Playlist`
     * @param context - Construction context options
     */
    constructor(...args: Playlist.ConstructorArgs);

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
     * Find all content links belonging to a given {@linkcode Playlist} or {@linkcode PlaylistSound}.
     * @param doc - The Playlist or PlaylistSound.
     */
    static _getSoundContentLinks(doc: Playlist.Implementation | PlaylistSound.Implementation): NodeListOf<Element>;

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
     * @privateRemarks _preUpdate, _onUpdate, _onDelete are all overridden but with no signature changes from the BasePlaylist class.
     */

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class GurpsPlaylist extends Playlist {
     *   protected override _onCreateDescendantDocuments(...args: Playlist.OnCreateDescendantDocumentsArgs) {
     *     super._onCreateDescendantDocuments(...args);
     *
     *     const [parent, collection, documents, data, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _onCreateDescendantDocuments(...args: Playlist.OnCreateDescendantDocumentsArgs): void;

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class Ptr2ePlaylist extends Playlist {
     *   protected override _onUpdateDescendantDocuments(...args: Playlist.OnUpdateDescendantDocumentsArgs) {
     *     super._onUpdateDescendantDocuments(...args);
     *
     *     const [parent, collection, documents, changes, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _onUpdateDescendantDocuments(...args: Playlist.OnUpdateDescendantDocumentsArgs): void;

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class BladesPlaylist extends Playlist {
     *   protected override _onDeleteDescendantDocuments(...args: Playlist.OnUpdateDescendantDocuments) {
     *     super._onDeleteDescendantDocuments(...args);
     *
     *     const [parent, collection, documents, ids, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _onDeleteDescendantDocuments(...args: Playlist.OnDeleteDescendantDocumentsArgs): void;

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
     * They are here because Foundry's documents are complex and have lots of edge cases.
     * There are DRY ways of representing this but this ends up being harder to understand
     * for end users extending these functions, especially for static methods. There are also a
     * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
     * as there is no data that can safely construct every possible document. Finally keeping definitions
     * separate like this helps against circularities.
     */

    // ClientDocument overrides

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class SwadePlaylist extends Playlist {
     *   protected override _preCreateDescendantDocuments(...args: Playlist.PreCreateDescendantDocumentsArgs) {
     *     super._preCreateDescendantDocuments(...args);
     *
     *     const [parent, collection, data, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _preCreateDescendantDocuments(...args: Playlist.PreCreateDescendantDocumentsArgs): void;

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class LancerPlaylist extends Playlist {
     *   protected override _preUpdateDescendantDocuments(...args: Playlist.OnUpdateDescendantDocuments) {
     *     super._preUpdateDescendantDocuments(...args);
     *
     *     const [parent, collection, changes, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _preUpdateDescendantDocuments(...args: Playlist.PreUpdateDescendantDocumentsArgs): void;

    /**
     * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
     * this method must be overriden like so:
     * ```typescript
     * class KultPlaylist extends Playlist {
     *   protected override _preDeleteDescendantDocuments(...args: Playlist.PreDeleteDescendantDocumentsArgs) {
     *     super._preDeleteDescendantDocuments(...args);
     *
     *     const [parent, collection, ids, options, userId] = args;
     *     if (collection === "sounds") {
     *         options; // Will be narrowed.
     *     }
     *   }
     * }
     * ```
     */
    protected override _preDeleteDescendantDocuments(...args: Playlist.PreDeleteDescendantDocumentsArgs): void;

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
