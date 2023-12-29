// FOUNDRY_VERSION: 10.291

import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mts";
import type BasePlaylistSound from "../../../common/documents/playlist-sound.mts";

declare global {
  /**
   * The client-side PlaylistSound document which extends the common BasePlaylistSound model.
   * Each PlaylistSound belongs to the sounds collection of a Playlist document.
   *
   * @see {@link Playlist}              The Playlist document which contains PlaylistSound embedded documents
   * @see {@link PlaylistSoundConfig}   The PlaylistSound configuration application
   * @see {@link Sound}                 The Sound API which manages web audio playback
   */
  class PlaylistSound extends ClientDocumentMixin(BasePlaylistSound) {
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[0],
      context?: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[1],
    );

    /**
     * The Sound which manages playback for this playlist sound
     */
    sound: Sound | null;

    /**
     * A debounced function, accepting a single volume parameter to adjust the volume of this sound
     * @param volume    - The desired volume level
     */
    debounceVolume: (volume: number) => void;

    /**
     * The debounce tolerance for processing rapid volume changes into database updates in milliseconds
     * @defaultValue `100`
     */
    static VOLUME_DEBOUNCE_MS: number;

    /**
     * Create a Sound used to play this PlaylistSound document
     * @internal
     */
    protected _createSound(): Sound | null;

    /**
     * The effective volume at which this playlist sound is played, incorporating the global playlist volume setting.
     */
    get effectiveVolume(): number;

    /**
     * Determine the fade duration for this PlaylistSound based on its own configuration and that of its parent.
     */
    get fadeDuration(): number;

    /**
     * Synchronize playback for this particular PlaylistSound instance
     */
    sync(): void;

    /**
     * Create a content link for this Document.
     * @param options   - Additional options to configure how the link is constructed.
     *                  (default: `{}`)
     */
    toAnchor(options: PlaylistSound.ToAnchorOptions): HTMLAnchorElement;

    /** @internal */
    protected _onClickDocumentLink(event: unknown): Promise<Playlist>;

    /** @internal */
    protected override _onCreate(
      data: BasePlaylistSound.Source,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /** @internal */
    protected override_onUpdate(
      changed: BasePlaylistSound.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /** @internal */
    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Special handling that occurs when a PlaylistSound reaches the natural conclusion of its playback.
     * @internal
     */
    protected _onEnd(): Promise<void | InstanceType<ConfiguredDocumentClassForName<"Playlist">> | undefined>;

    /**
     * Special handling that occurs when playback of a PlaylistSound is started.
     * @internal
     */
    protected _onStart(): Promise<void>;

    /**
     * Special handling that occurs when a PlaylistSound is manually stopped before its natural conclusion.
     * @internal
     */
    protected _onStop(): Promise<void>;

    /**
     * Handle fading in the volume for this sound when it begins to play (or loop)
     * @param sound   - The sound fading-in
     * @internal
     */
    protected _fadeIn(sound: Sound): void;

    /**
     * Handle fading out the volume for this sound when it begins to play (or loop)
     * @param sound   - The sound fading-out
     * @internal
     */
    protected _fadeOut(sound: Sound): void;
  }

  namespace PlaylistSound {
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
