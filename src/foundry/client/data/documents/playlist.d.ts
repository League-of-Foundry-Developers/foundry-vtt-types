import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { PlaylistDataConstructorData } from "../../../common/data/data.mjs/playlistData";

declare global {
  /**
   * The client-side Playlist document which extends the common BasePlaylist model.
   * Each Playlist document contains PlaylistData which defines its data schema.
   *
   * @see {@link data.PlaylistData}               The Playlist data schema
   * @see {@link documents.Playlists}             The world-level collection of Playlist documents
   * @see {@link embedded.PlaylistSound}          The PlaylistSound embedded document within a parent Playlist
   * @see {@link applications.PlaylistConfig}     The Playlist configuration application
   *
   */
  class Playlist extends ClientDocumentMixin(foundry.documents.BasePlaylist) {
    /**
     * @param data - Initial data provided to construct the Playlist document
     */
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BasePlaylist>[0],
      context?: ConstructorParameters<typeof foundry.documents.BasePlaylist>[1]
    );

    /**
     * Playlists may have a playback order which defines the sequence of Playlist Sounds
     * @defaultValue `undefined`
     * @internal
     */
    protected _playbackOrder: string[] | undefined;

    /**
     * The playback mode for the Playlist instance
     */
    get mode(): foundry.CONST.PLAYLIST_MODES;

    /**
     * The order in which sounds within this playlist will be played (if sequential or shuffled)
     * Uses a stored seed for randomization to guarantee that all clients generate the same random order.
     */
    get playbackOrder(): string[];

    /**
     * An indicator for whether any Sound within the Playlist is currently playing
     */
    get playing(): boolean;

    override get visible(): boolean;

    /**
     * Begin simultaneous playback for all sounds in the Playlist.
     * @returns The updated Playlist document
     */
    playAll(): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Play the next Sound within the sequential or shuffled Playlist.
     * @param soundId - The currently playing sound ID, if known
     * @param options - Additional options which configure the next track
     * @returns The updated Playlist document
     */
    playNext(
      soundId?: string,
      options?: Partial<Playlist.PlayNextOptions>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined | null>;

    /**
     * Begin playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    playSound(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Stop playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    stopSound(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * End playback for any/all currently playing sounds within the Playlist.
     * @returns The updated Playlist document
     */
    stopAll(): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Cycle the playlist mode
     * @returns A promise which resolves to the updated Playlist instance
     */
    cycleMode(): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Get the next sound in the cached playback order. For internal use.
     * @internal
     */
    protected _getNextSound(soundId: string): InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>> | undefined;

    /**
     * Get the previous sound in the cached playback order. For internal use.
     * @internal
     */
    protected _getPreviousSound(
      soundId: string
    ): InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>> | undefined;

    /**
     * Define the sorting order for the Sounds within this Playlist. For internal use.
     * @internal
     */
    protected _sortSounds(
      a: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
      b: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): number;

    protected override _preUpdate(
      changed: DeepPartial<PlaylistDataConstructorData>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    protected override _onUpdate(
      changed: DeepPartial<foundry.data.PlaylistData["_source"]>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    protected override _onDeleteEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: string[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /**
     * Handle callback logic when an individual sound within the Playlist concludes playback naturally
     * @internal
     */
    _onSoundEnd(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Handle callback logic when playback for an individual sound within the Playlist is started.
     * Schedule auto-preload of next track
     * @internal
     */
    _onSoundStart(sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>): Promise<void>;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<foundry.data.PlaylistData["_source"], "_id" | "folder" | "permission"> & {
      permission?: foundry.data.PlaylistData["_source"]["permission"];
    };
  }

  namespace Playlist {
    interface PlayNextOptions {
      /**
       * Whether to advance forward (if 1) or backwards (if -1)
       * @defaultValue `1`
       */
      direction: 1 | -1;
    }
  }
}
