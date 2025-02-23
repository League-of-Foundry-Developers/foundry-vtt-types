import type { DeepPartial } from "fvtt-types/utils";

declare global {
  /**
   * The singleton collection of Playlist documents which exist within the active World.
   * This Collection is accessible within the Game object as game.playlists.
   *
   * @see {@link Playlist | `Playlist`} The Playlist document
   * @see {@link PlaylistDirectory | `PlaylistDirectory`} The PlaylistDirectory sidebar directory
   */
  class Playlists extends WorldCollection<Playlist.ImplementationClass, "Playlists"> {
    static documentName: "Playlist";

    /**
     * Return the subset of Playlist documents which are currently playing
     */
    get playing(): ReturnType<this["filter"]>;

    /**
     * Perform one-time initialization to begin playback of audio.
     */
    initialize(): Promise<void>;

    /**
     * Handle changes to a Scene to determine whether to trigger changes to Playlist documents.
     * @param scene - The Scene document being updated
     * @param data  - The incremental update data
     */
    protected _onChangeScene(scene: Scene.Stored, data: DeepPartial<Scene["_source"]>): Promise<void>;
  }

  namespace Playlists {
    type Any = AnyPlaylists;
    type AnyConstructor = typeof AnyPlaylists;
  }
}

declare abstract class AnyPlaylists extends Playlists {
  constructor(arg0: never, ...args: never[]);
}
