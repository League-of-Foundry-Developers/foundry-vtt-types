import type { InexactPartial } from "../../../../utils/index.d.mts";
import type Sound from "../../../client-esm/audio/sound.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BasePlaylistSound from "../../../common/documents/playlist-sound.d.mts";

declare global {
  namespace PlaylistSound {
    type Metadata = Document.MetadataFor<PlaylistSound>;

    type ConfiguredClass = Document.ConfiguredClassForName<"PlaylistSound">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"PlaylistSound">;

    interface DatabaseOperations extends DocumentDatabaseOperations<PlaylistSound> {}

    // Helpful aliases
    type ConstructorData = BasePlaylistSound.ConstructorData;
    type UpdateData = BasePlaylistSound.UpdateData;
    type Schema = BasePlaylistSound.Schema;
    type Source = BasePlaylistSound.Source;
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
    static override metadata: PlaylistSound.Metadata;

    // Note(LukeAbby): TODO, this constructor just copies from the parent. Should this just be removed?
    // constructor(
    //   data: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[0],
    //   context?: ConstructorParameters<typeof foundry.documents.BasePlaylistSound>[1],
    // );

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

    _onClickDocumentLink(event: MouseEvent): ReturnType<Playlist.ConfiguredInstance["stopSound" | "playSound"]>;

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
    protected _onEnd(): Promise<void | Playlist.ConfiguredInstance | undefined>;

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
  }
}
