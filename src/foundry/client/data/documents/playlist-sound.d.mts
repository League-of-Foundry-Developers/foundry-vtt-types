import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";

declare global {
  namespace PlaylistSound {
    type ConfiguredClass = ConfiguredDocumentClassForName<"PlaylistSound">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"PlaylistSound">;
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
    sync(): void | Promise<void> | Promise<Sound>;

    toAnchor(
      options?: InexactPartial<{
        attrs: Record<string, string>;
        dataset: Record<string, string>;
        classes: string[];
        name: string;
        icon: string;
      }>,
    ): HTMLAnchorElement;

    _onClickDocumentLink(event: MouseEvent): ReturnType<Playlist.ConfiguredInstance["stopSound" | "playSound"]>;

    protected override _onCreate(data: this["_source"], options: DocumentModificationOptions, userId: string): void;

    protected override _onUpdate(
      changed: foundry.documents.BaseAmbientSound.UpdateData,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    protected override _onDelete(options: DocumentModificationOptions, userId: string): void;

    /**
     * Special handling that occurs when a PlaylistSound reaches the natural conclusion of its playback.
     * @internal
     */
    protected _onEnd(): Promise<void | Playlist.ConfiguredInstance | undefined>;

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
