/**
 * A directory listing of audio playlists
 */
declare class PlaylistDirectory extends SidebarDirectory {
  constructor(options?: Partial<Application.Options>);

  /**
   * Track the playlist IDs which are currently expanded in their display
   */
  protected _expanded: Set<string>;

  /**
   * @override
   */
  static get defaultOptions(): PlaylistDirectory.Options;

  /**
   * @override
   */
  static get entity(): string;

  /**
   * @override
   */
  static get collection(): Playlists;

  /**
   * Return an Array of the Playlist entities which are currently playing
   */
  get playing(): Playlist[];

  /**
   * Prepare the data used to render the AudioList application
   * @param options - (unused)
   */
  getData(options?: Application.RenderOptions): PlaylistDirectory.Data;

  /**
   * Given a constant playback mode, provide the FontAwesome icon used to display it
   */
  protected _getModeIcon(mode: Const.PlaylistModes): string;

  /**
   * Given a constant playback mode, provide the string tooltip used to describe it
   */
  protected _getModeTooltip(mode: Const.PlaylistModes): string;
}

declare namespace PlaylistDirectory {
  interface Data {
    user: User;
    isGM: boolean;
    entities: PlaylistEntity[];
    playlistModifier: ReturnType<typeof AudioHelper['volumeToInput']>;
    ambientModifier: ReturnType<typeof AudioHelper['volumeToInput']>;
    interfaceModifier: ReturnType<typeof AudioHelper['volumeToInput']>;
  }

  interface PlaylistEntity extends Duplicated<Playlist.Data> {
    modeIcon: string;
    modeTooltip: string;
    disabled: boolean;
    controlCSS: string;
    expanded: boolean;
    sounds: Sound[];
  }

  interface Sound extends Duplicated<Playlist.Sound> {
    lvolume: ReturnType<typeof AudioHelper['volumeToInput']>;
    controlCSS: string;
  }

  interface Options extends SidebarDirectory.Options {
    /**
     * @defaultValue The `dragSelector` of the first entry is `'.playlist-name'`.
     */
    dragDrop: SidebarDirectory.Options['dragDrop'];

    /**
     * @defaultValue `['name', 'playing', 'mode']`
     */
    renderUpdateKeys: string[];
  }
}
