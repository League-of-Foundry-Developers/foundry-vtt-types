/**
 * A directory listing of audio playlists
 */
declare class PlaylistDirectory extends SidebarDirectory<PlaylistDirectory.Options> {
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
  static get entity(): 'Playlist';

  /**
   * @override
   * @see {@link Game.playlists}
   */
  static get collection(): Game['playlists'];

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
  protected _getModeIcon(mode: foundry.CONST.PlaylistMode): string;

  /**
   * Given a constant playback mode, provide the string tooltip used to describe it
   */
  protected _getModeTooltip(mode: foundry.CONST.PlaylistMode): string;

  /**
   * @override
   */
  activateListeners(html: JQuery): void;

  /**
   * Handle global volume change for the playlist sidebar
   */
  protected _onGlobalVolume(event: JQuery.ChangeEvent): void;

  /**
   * Handle Playlist collapse toggle
   */
  protected _onPlaylistCollapse(event: JQuery.ClickEvent): void;

  /**
   * Helper method to render the expansion or collapse of playlists
   * @param speed - (default: `250`)
   */
  protected _collapse(li: JQuery, collapse: boolean, speed: number): void;

  /**
   * Handle Playlist edit action
   */
  protected _onPlaylistEdit(event: JQuery.ClickEvent): void;

  /**
   * Handle Playlist deletion requests
   * Confirm the deletion with a yes/no dialog prompt
   */
  protected _onPlaylistDelete(event: JQuery.ClickEvent): void;

  /**
   * Handle Playlist track addition request
   */
  protected _onPlaylistAddTrack(event: JQuery.ClickEvent): void;

  /**
   * Handle Playlist playback state changes
   */
  protected _onPlaylistPlay(event: JQuery.ClickEvent, playing: boolean): void;

  /**
   * Handle cycling the playback mode for a Playlist
   * @param event - The initial click event
   */
  protected _onPlaylistToggleMode(event: JQuery.ClickEvent): void;

  /**
   * Handle editing a Sound within a PLaylist
   * @param event - The initial click event
   */
  protected _onSoundEdit(event: JQuery.ClickEvent): void;

  /**
   * Modify the playback state of a Sound within a Playlist
   * @param event - The initial click event
   */
  protected _onSoundPlay(event: JQuery.ClickEvent, playing: boolean): void;

  /**
   * Handle volume adjustments to sounds within a Playlist
   * @param event - The initial change event
   */
  protected _onSoundVolume(event: JQuery.ChangeEvent): void;

  /**
   * Handle changes to the sound playback mode
   * @param event - The initial click event
   */
  protected _onSoundToggleMode(event: JQuery.ClickEvent): void;

  /**
   * Handle Playlist track deletion request
   */
  protected _onSoundDelete(event: JQuery.ClickEvent): void;

  /**
   * Handle right click context-menu options on a Playlist or a Sound
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get context menu options for individual sound effects
   * @returns The context options for each sound
   */
  protected _getSoundContextOptions(): ContextMenu.Item[];
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
