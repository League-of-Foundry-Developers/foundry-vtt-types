/**
 * Playlist Sound Configuration Sheet
 */
declare class PlaylistSoundConfig extends FormApplication<PlaylistSoundConfig.Data, Playlist.Sound> {
  /**
   * @param playlist - The Playlist entity within which the Sound is configured
   * @param sound    - An Object for the Playlist Sound data
   * @param options  - Additional application rendering options
   */
  constructor(playlist: PlaylistSoundConfig['playlist'], sound: Playlist.Sound, options: FormApplication.Options);

  playlist: Playlist;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   id: "track-config",
   *   template: "templates/playlist/edit-track.html",
   *   width: 360
   * });
   * ```
   */
  static get defaultOptions(): FormApplication.Options;

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
  protected _updateObject(event: Event, formData: PlaylistSoundConfig.FormData): Promise<Playlist>;

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

  type FormData = Pick<Data, 'lvolume'> & Pick<Playlist.Sound, 'name' | 'path' | 'repeat' | 'streaming'>;
}
