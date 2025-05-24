import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Playlist documents which exist within the active World.
   * This Collection is accessible within the Game object as game.playlists.
   *
   * @see {@linkcode Playlist} The Playlist document
   * @see {@linkcode PlaylistDirectory} The PlaylistDirectory sidebar directory
   */
  class Playlists extends WorldCollection<Playlist.ImplementationClass, "Playlists"> {
    static documentName: "Playlist";

    /**
     * Return the subset of Playlist documents which are currently playing
     */
    get playing(): Playlist.Implementation[];

    /**
     * Perform one-time initialization to begin playback of audio.
     */
    initialize(): Promise<void>;

    /**
     * Handle changes to a Scene to determine whether to trigger changes to Playlist documents.
     * @param scene      - The new active Scene
     * @param priorScene - The previously active Scene
     * @internal
     */
    protected _onChangeScene(scene: Scene.Stored | null, priorScene: Scene.Stored | null): Promise<void>;
  }

  namespace Playlists {
    interface Any extends AnyPlaylists {}
    interface AnyConstructor extends Identity<typeof AnyPlaylists> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Playlist"> {}
    interface Configured extends Document.ConfiguredCollection<"Playlist"> {}
  }
}

declare abstract class AnyPlaylists extends Playlists {
  constructor(...args: never);
}
