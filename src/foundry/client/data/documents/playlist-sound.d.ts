import type { DocumentModificationOptions } from '../../../common/abstract/document.mjs.js';

declare global {
  /**
   * The client-side PlaylistSound document which extends the common BasePlaylistSound model.
   * Each PlaylistSound belongs to the sounds collection of a Playlist document.
   *
   * @see {@link Playlist}              The Playlist document which contains PlaylistSound embedded documents
   * @see {@link PlaylistSoundConfig}   The PlaylistSound configuration application
   * @see {@link Sound}                 The Sound API which manages web audio playback
   */
  class PlaylistSound extends ClientDocumentMixin(foundry.documents.BasePlaylistSound) {
    /**
     * @param data   - Initial data provided to construct the PlaylistSound document
     * @param parent - The parent Playlist document to which this result belongs
     */
    constructor(
      data: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[0],
      context?: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[1]
    );

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
     * Determine the fade duration for this PlaylistSound based on its own configuration and that of its parent.
     */
    get fadeDuration(): number;

    /**
     * Synchronize playback for this particular PlaylistSound instance
     */
    sync(): void | Promise<void> | Promise<Sound>;

    override _onCreate(
      data: foundry.documents.BasePlaylistSound['_source'],
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onUpdate(
      changed: DeepPartial<foundry.documents.BasePlaylistSound['_source']>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Special handling that occurs when a PlaylistSound reaches the natural conclusion of its playback.
     * @internal
     */
    protected _onEnd(): Promise<void | InstanceType<ConfiguredPlaylist> | undefined>;

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
     * @internal
     */
    protected _fadeIn(sound: Sound): void;

    /**
     * Handle fading out the volume for this sound when it begins to play (or loop)
     * @internal
     */
    protected _fadeOut(sound: Sound): void;
  }
}
