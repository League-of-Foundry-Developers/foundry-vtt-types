/**
 * Playlist Configuration Sheet
 */
declare class PlaylistConfig extends BaseEntitySheet<PlaylistConfig.Data, Playlist> {
  static get defaultOptions(): PlaylistConfig.Options;

  /**
   * @override
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): PlaylistConfig.Data;
}

declare namespace PlaylistConfig {
  interface Data extends Duplicated<PlaylistConfig['object']['data']> {
    modes: Record<string, ValueOf<typeof CONST['PLAYLIST_MODES']>>;
  }

  interface Options extends BaseEntitySheet.Options {
    /**
     * @defaultValue `'playlist-config'`
     */
    id: string;

    /**
     * @defaultValue `'templates/playlist/edit-playlist.html'`
     */
    template: string;

    /**
     * @defaultValue `360`
     */
    width: number;
  }
}
