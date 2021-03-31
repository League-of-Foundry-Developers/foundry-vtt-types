/**
 * Playlist Configuration Sheet
 */
declare class PlaylistConfig extends BaseEntitySheet<BaseEntitySheet.Options, PlaylistConfig.Data, Playlist> {
  /**
   * @defaultValue
   * ```typescript
   * const options = super.defaultOptions;
   * options.id = "playlist-config";
   * options.template = "templates/playlist/edit-playlist.html";
   * options.width = 360;
   * ```
   */
  static get defaultOptions(): typeof BaseEntitySheet['defaultOptions'];

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
    modes: Record<string, ValueOf<typeof foundry.CONST['PLAYLIST_MODES']>>;
  }
}
