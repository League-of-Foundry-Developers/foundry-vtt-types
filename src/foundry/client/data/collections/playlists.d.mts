import type { DeepPartial } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Playlist documents which exist within the active World.
   * This Collection is accessible within the Game object as game.playlists.
   *
   * @see {@link Playlist} The Playlist document
   * @see {@link PlaylistDirectory} The PlaylistDirectory sidebar directory
   */
  class Playlists extends WorldCollection<typeof foundry.documents.BasePlaylist, "Playlists"> {
    constructor(data?: Document.Stored<Playlist.ConfiguredInstance>["_source"][]);

    static documentName: "Playlist";

    /**
     * Return the subset of Playlist documents which are currently playing
     */
    get playing(): ReturnType<this["filter"]>;

    /**
     * Perform one-time initialization to begin playback of audio
     */
    initialize(): void;

    /**
     * Handle changes to a Scene to determine whether to trigger changes to Playlist documents.
     * @param scene - The Scene document being updated
     * @param data  - The incremental update data
     */
    protected _onChangeScene(scene: Document.Stored<Scene>, data: DeepPartial<Scene["_source"]>): Promise<void>;
  }
}
