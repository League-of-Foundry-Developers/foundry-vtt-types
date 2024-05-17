import type { ConfiguredDocumentClass } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { AnyMetadata, DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { ClientDocument } from "../abstract/client-document.d.mts";

declare global {
  /**
   * The client-side Playlist document which extends the common BasePlaylist model.
   *
   * @see {@link Playlists}             The world-level collection of Playlist documents
   * @see {@link PlaylistSound}         The PlaylistSound embedded document within a parent Playlist
   * @see {@link PlaylistConfig}        The Playlist configuration application
   *
   */
  class Playlist extends ClientDocumentMixin(foundry.documents.BasePlaylist) {
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
     * Find all content links belonging to a given {@link Playlist} or {@link PlaylistSound}.
     * @param doc - The Playlist or PlaylistSound.
     */
    static _getSoundContentLinks(doc: Playlist | PlaylistSound): NodeListOf<Element>;

    override prepareDerivedData(): void;

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
      options?: Partial<Playlist.PlayNextOptions>,
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined | null>;

    /**
     * Begin playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    playSound(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Stop playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound - The desired sound that should play
     * @returns The updated Playlist
     */
    stopSound(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
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
      soundId: string,
    ): InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>> | undefined;

    /**
     * Define the sorting order for the Sounds within this Playlist. For internal use.
     * @internal
     */
    protected _sortSounds(
      a: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
      b: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
    ): number;

    override toAnchor(
      options?:
        | InexactPartial<{
            attrs: Record<string, string>;
            dataset: Record<string, string>;
            classes: string[];
            name: string;
            icon: string;
          }>
        | undefined,
    ): HTMLAnchorElement;

    override _onClickDocumentLink(event: MouseEvent): ReturnType<this["playAll" | "stopAll"]>;

    protected override _preUpdate(
      changed: Playlist["_source"],
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser,
    ): Promise<void>;

    protected override _onUpdate(
      changed: DeepPartial<Playlist["_source"]>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    protected override _onCreateDescendantDocuments(
      parent: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>,
      collection: string,
      documents: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>[],
      data: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onUpdateDescendantDocuments(
      parent: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>,
      collection: string,
      documents: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>[],
      changes: unknown[],
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDeleteDescendantDocuments(
      parent: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>,
      collection: string,
      documents: ClientDocument<Document<any, AnyMetadata, null>, AnyMetadata>[],
      ids: string,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Handle callback logic when an individual sound within the Playlist concludes playback naturally
     * @internal
     */
    _onSoundEnd(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>,
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Handle callback logic when playback for an individual sound within the Playlist is started.
     * Schedule auto-preload of next track
     * @internal
     */
    _onSoundStart(sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>): Promise<void>;

    /**
     * UPdate the playing status of this Playlist in content links.
     * @param changed - The data changes
     */
    _updateContentLinkPlaying(changed: DeepPartial<Playlist["_source"]>): void;

    override toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocument.CompendiumExportOptions | undefined,
    ): Omit<Playlist["_source"], "_id" | "folder" | "permission"> & {
      permission?: Playlist["_source"]["permission"];
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
