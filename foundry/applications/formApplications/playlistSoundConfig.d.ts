/**
 * Playlist Sound Configuration Sheet
 */
declare class PlaylistSoundConfig extends FormApplication<PlaylistSoundConfig.Data, Playlist.Sound> {
  /**
   * @param playlist - The Playlist entity within which the Sound is configured
   * @param sound    - An Object for the Playlist Sound data
   * @param options  - Additional application rendering options
   */
  constructor(playlist: PlaylistSoundConfig['playlist'], sound: Playlist.Sound, options: PlaylistSoundConfig.Options);

  playlist: Playlist;

  /**
   * @override
   */
  static get defaultOptions(): PlaylistSoundConfig.Options;

  /**
   * @override
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): PlaylistSoundConfig.Data;

  /**
   * @param event - (unused)
   * @override
   */
  protected _updateObject(event: Event, formData: PlaylistSoundConfig.Data): Promise<Playlist>;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Auto-populate the track name using the provided filename, if a name is not already set
   */
  protected _onSourceChange(event: Event): void;
}

declare namespace PlaylistSoundConfig {
  interface Data extends Duplicated<PlaylistSoundConfig['object']> {
    lvolume: number;
  }

  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'track-config'`
     */
    id: string;

    /**
     * @defaultValue `'templates/playlist/edit-track.html'`
     */
    template: string;

    /**
     * @defaultValue `360`
     */
    width: number;
  }
}
