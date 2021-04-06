/**
 * Playlist Sound Configuration Sheet
 * @typeParam P - the type of the options object
 */
declare class PlaylistSoundConfig<P extends FormApplication.Options = FormApplication.Options> extends FormApplication<
  P,
  PlaylistSoundConfig.Data,
  Playlist.Sound
> {
  /**
   * @param playlist - The Playlist entity within which the Sound is configured
   * @param sound    - An Object for the Playlist Sound data
   * @param options  - Additional application rendering options
   */
  constructor(playlist: PlaylistSoundConfig['playlist'], sound: Playlist.Sound, options: Partial<P>);

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
  static get defaultOptions(): typeof FormApplication['defaultOptions'];

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
  protected _onSourceChange(event: JQuery.ChangeEvent): void;
}

declare namespace PlaylistSoundConfig {
  interface Data extends foundry.utils.Duplicated<PlaylistSoundConfig['object']> {
    lvolume: number;
  }

  type FormData = Pick<Data, 'lvolume'> & Pick<Playlist.Sound, 'name' | 'path' | 'repeat' | 'streaming'>;
}
