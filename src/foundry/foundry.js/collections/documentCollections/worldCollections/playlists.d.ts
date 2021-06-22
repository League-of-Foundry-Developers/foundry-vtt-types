import { ConfiguredDocumentClass } from '../../../../../types/helperTypes';

declare global {
  /**
   * The singleton collection of Playlist documents which exist within the active World.
   * This Collection is accessible within the Game object as game.playlists.
   *
   * @see {@link Playlist} The Playlist entity
   * @see {@link PlaylistDirectory} The PlaylistDirectory sidebar directory
   */
  class Playlists extends WorldCollection<typeof foundry.documents.BasePlaylist, 'Playlists'> {
    /** @override */
    static documentName: 'Playlist';

    /**
     * Return the subset of Playlist entities which are currently playing
     */
    get playing(): ReturnType<this['filter']>;

    /**
     * Perform one-time initialization to begin playback of audio
     */
    initialize(): void;

    /**
     * Handle changes to a Scene to determine whether to trigger changes to Playlist entities.
     * @param scene - The Scene entity being updated
     * @param data  - The incremental update data
     */
    protected _onChangeScene(
      scene: InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseScene>>,
      data: DeepPartial<Parameters<foundry.documents.BaseScene['data']['_initializeSource']>[0]> &
        Record<string, unknown>
    ): Promise<void>;
  }
}
