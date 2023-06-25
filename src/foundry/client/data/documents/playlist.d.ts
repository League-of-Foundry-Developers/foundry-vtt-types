// FOUNDRY_VERSION: 10.291

import type { ConfiguredDocumentClass } from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type BasePlaylist from "../../../common/documents/playlist.mjs";

declare global {
  /**
   * The client-side Playlist document which extends the common BasePlaylist model.
   *
   * @see {@link Playlists}             The world-level collection of Playlist documents
   * @see {@link PlaylistSound}         The PlaylistSound embedded document within a parent Playlist
   * @see {@link PlaylistConfig}        The Playlist configuration application
   */
  class Playlist extends ClientDocumentMixin(BasePlaylist) {
    /**
     * Playlists may have a playback order which defines the sequence of Playlist Sounds
     * @internal
     */
    protected _playbackOrder: string[];

    /**
     * The order in which sounds within this playlist will be played (if sequential or shuffled)
     * Uses a stored seed for randomization to guarantee that all clients generate the same random order.
     */
    get playbackOrder(): string[];

    get visible(): boolean;

    /**
     * Find all content links belonging to a given {@link Playlist} or {@link PlaylistSound}.
     * @param doc   - The Playlist or PlaylistSound.
     * @internal
     */
    protected static _getSoundContentLinks(doc: Playlist | PlaylistSound): NodeListOf<Element>;

    prepareDerivedData(): void;

    /**
     * Begin simultaneous playback for all sounds in the Playlist.
     * @returns The updated Playlist document
     */
    playAll(): Promise<Playlist>;

    /**
     * Play the next Sound within the sequential or shuffled Playlist.
     * @param soundId   - The currently playing sound ID, if known
     * @param options   - Additional options which configure the next track
     *                  (default: `{}`)
     * @returns The updated Playlist document
     */
    playNext(soundId: string, options?: Playlist.PlayNextOptions): Promise<Playlist>;

    /**
     * Begin playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound   - The desired sound that should play
     * @returns The updated Playlist
     */
    playSound(sound: PlaylistSound): Promise<Playlist>;

    /**
     * Stop playback of a specific Sound within this Playlist.
     * Determine which other sounds should remain playing, if any.
     * @param sound   - The desired sound that should play
     * @returns The updated Playlist
     */
    stopSound(sound: PlaylistSound): Promise<Playlist>;

    /**
     * End playback for any/all currently playing sounds within the Playlist.
     * @returns The updated Playlist document
     */
    stopAll(): Promise<Playlist>;

    /**
     * Cycle the playlist mode
     * @returns A promise which resolves to the updated Playlist instance
     */
    cycleMode(): Promise<Playlist>;

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

    /**
     * Create a content link for this Document.
     * @param options   - Additional options to configure how the link is constructed.
     */
    toAnchor(options: Playlist.ToAnchorOptions): HTMLAnchorElement;

    /** @internal */
    protected _onClickDocumentLink(event: unknown): Promise<Playlist>;

    /** @internal */
    protected _preUpdate(
      changed: DeepPartial<BasePlaylist.UpdateData>,
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    /** @internal */
    protected _onUpdate(
      changed: BasePlaylist.Source,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @internal */
    protected _onDelete(options: DocumentModificationOptions, userId: string): void;

    /** @internal */
    protected override _onCreateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    /** @internal */
    protected override _onUpdateEmbeddedDocuments(
      embeddedName: string,
      documents: foundry.abstract.Document<any, any>[],
      result: Record<string, unknown>[],
      options: DocumentModificationContext,
      userId: string
    ): void;

    /** @internal */
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
    protected _onSoundEnd(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Handle callback logic when playback for an individual sound within the Playlist is started.
     * Schedule auto-preload of next track
     * @internal
     */
    protected _onSoundStart(
      sound: InstanceType<ConfiguredDocumentClass<typeof PlaylistSound>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Playlist>> | undefined>;

    /**
     * Update the playing status of this Playlist in content links.
     * @param changed    - The data changes.
     * @internal
     */
    protected _updateContentLinkPlaying(changed: DeepPartial<BasePlaylist.UpdateData>): void;

    toCompendium(
      pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
      options?: ClientDocumentMixin.CompendiumExportOptions | undefined
    ): Omit<PlaylistData["_source"], "_id" | "folder" | "permission"> & {
      permission?: PlaylistData extends { toObject(): infer U } ? U : never;
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

    interface ToAnchorOptions {
      /** Attributes to set on the link. (default: `{}`) */
      attrs: Record<string, string>;

      /** Custom data- attributes to set on the link. (default: `{}`) */
      dataset: Record<string, string | undefined>;

      /** Classes to add to the link. (default: `[]`) */
      classes: string[];

      /** A font-awesome icon class to use as the icon, if different to the
       *  Document's configured sidebarIcon. */
      icon: string;
    }
  }
}
