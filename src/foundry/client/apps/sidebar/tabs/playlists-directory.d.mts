import type Document from "../../../../common/abstract/document.d.mts";

declare global {
  /**
   * The sidebar directory which organizes and displays world-level Playlist documents.
   * @typeParam Options - The type of the options object
   */
  class PlaylistDirectory<
    Options extends DocumentDirectoryOptions = DocumentDirectoryOptions,
  > extends DocumentDirectory<"Playlist", Options> {
    constructor(options?: Partial<Options>);

    /**
     * Track the playlist IDs which are currently expanded in their display
     * @internal
     */
    protected _expanded: Set<string>;

    /**
     * Are the global volume controls currently expanded?
     * @defaultValue `false`
     * @internal
     */
    protected _volumeExpanded: boolean;

    /**
     * Cache the set of Playlist documents that are displayed as playing when the directory is rendered
     * @defaultValue `[]`
     */
    protected _playingPlaylists: Playlist.ConfiguredInstance[];

    /**
     * Cache the set of PlaylistSound documents that are displayed as playing when the directory is rendered
     * @defaultValue `[]`
     */
    protected _playingSounds: PlaylistSound.ConfiguredInstance[];

    /**
     * @internal
     * @defaultValue `undefined`
     * @remarks This is only initialized and set in `getData`.
     */
    protected _playingSoundsData?: PlaylistDirectory.SoundData[] | undefined;

    static override documentName: "Playlist";

    /**
     * @defaultValue `"templates/sidebar/partials/playlist-partial.html"`
     */
    static override entryPartial: string;

    /**
     * @defaultValue
     * ```typescript
     * const options = super.defaultOptions;
     * options.template = "templates/sidebar/playlists-directory.html";
     * options.dragDrop[0].dragSelector = ".folder, .playlist-name, .sound-name";
     * options.renderUpdateKeys = ["name", "playing", "mode", "sounds", "sort", "sorting", "folder"];
     * options.contextMenuSelector = ".document .playlist-header";
     * return options;
     * ```
     */
    static override get defaultOptions(): DocumentDirectoryOptions;

    /**
     * Initialize the set of Playlists which should be displayed in an expanded form
     * @internal
     */
    protected _createExpandedSet(): Set<string>;

    /**
     * Return an Array of the Playlist documents which are currently playing
     */
    get playing(): Playlist.ConfiguredInstance[];

    /**
     * Whether the "currently playing" element is pinned to the top or bottom of the display.
     * @internal
     */
    protected get _playingLocation(): "top" | "bottom";

    // TODO: Implement GetDataReturnType
    override getData(options?: Partial<Options>): Promise<object>;

    /**
     * Converts a volume level to a human-friendly % value
     * @param volume - Value between [0, 1] of the volume level
     */
    static volumeToTooltip(volume: number): string;

    /**
     * Augment the tree directory structure with playlist-level data objects for rendering
     * @param node - The tree leaf node being prepared
     * @internal
     */
    protected _prepareTreeData(node: DirectoryCollectionMixin.TreeNode<Playlist.ConfiguredInstance>): void;

    /**
     * Create an object of rendering data for each Playlist document being displayed
     * @param playlist - The playlist to display
     * @returns The data for rendering
     * @internal
     */
    protected _preparePlaylistData(playlist: Playlist.ConfiguredInstance): PlaylistDirectory.PlaylistData;

    /**
     * Get the icon used to represent the "play/stop" icon for the PlaylistSound
     * @param sound - The sound being rendered
     * @returns The icon that should be used
     * @internal
     */
    protected _getPlayIcon(sound: PlaylistSound.ConfiguredInstance): string;

    /**
     * Get the icon used to represent the pause/loading icon for the PlaylistSound
     * @param sound - The sound being rendered
     * @returns The icon that should be used
     * @internal
     */
    protected _getPauseIcon(sound: PlaylistSound.ConfiguredInstance): string;

    /**
     * Given a constant playback mode, provide the FontAwesome icon used to display it
     * @internal
     */
    protected _getModeIcon(mode: foundry.CONST.PLAYLIST_MODES): string;

    /**
     * Given a constant playback mode, provide the string tooltip used to describe it
     * @internal
     */
    protected _getModeTooltip(mode: foundry.CONST.PLAYLIST_MODES): string;

    override activateListeners(html: JQuery): void;

    /**
     * Handle global volume change for the playlist sidebar
     * @param event - The initial click event
     * @internal
     */
    protected _onGlobalVolume(event: JQuery.ClickEvent): unknown;

    override collapseAll(): void;

    protected override _onClickEntryName(event: PointerEvent): Promise<void>;

    /**
     * Handle global volume control collapse toggle
     * @param event - The initial click event
     * @internal
     */
    protected _onVolumeCollapse(event: JQuery.ClickEvent): void;

    /**
     * Helper method to render the expansion or collapse of playlists
     * @param speed - (default: `250`)
     * @internal
     */
    protected _collapse(el: HTMLElement, collapse: boolean, speed?: number): void;

    /**
     * Handle Playlist playback state changes
     * @param event   - The initial click event
     * @param playing - Is the playlist now playing?
     * @internal
     */
    protected _onPlaylistPlay(event: JQuery.ClickEvent, playing: boolean): Promise<Playlist.ConfiguredInstance>;

    /**
     * Handle advancing the playlist to the next (or previous) sound
     * @param event  - The initial click event
     * @param action - The control action requested
     * @internal
     */
    protected _onPlaylistSkip(event: JQuery.ClickEvent, action: string): Promise<Playlist.ConfiguredInstance>;

    /**
     * Handle cycling the playback mode for a Playlist
     * @param event - The initial click event
     * @internal
     */
    protected _onPlaylistToggleMode(event: JQuery.ClickEvent): Promise<Playlist.ConfiguredInstance>;

    /**
     * Handle Playlist track addition request
     * @param event - The initial click event
     * @internal
     */
    protected _onSoundCreate(event: JQuery.ClickEvent): void;

    /**
     * Modify the playback state of a Sound within a Playlist
     * @param event  - The initial click event
     * @param action - The sound control action performed
     * @internal
     */
    protected _onSoundPlay(event: JQuery.ClickEvent, action: string): Promise<Playlist.ConfiguredInstance | undefined>;

    /**
     * Handle volume adjustments to sounds within a Playlist
     * @param event - The initial change event
     * @internal
     */
    protected _onSoundVolume(event: JQuery.ChangeEvent): void;

    /**
     * Handle changes to the sound playback mode
     * @param event - The initial click event
     * @internal
     */
    protected _onSoundToggleMode(event: JQuery.ClickEvent): Promise<void>;

    /** @internal */
    protected _onPlayingPin(): void;

    protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Update the displayed timestamps for all currently playing audio sources.
     * Runs on an interval every 1000ms.
     * @internal
     */
    protected _updateTimestamps(): void;

    /**
     * Format the displayed timestamp given a number of seconds as input
     * @param seconds - The current playback time in seconds
     * @returns The formatted timestamp
     * @internal
     */
    protected _formatTimestamp(seconds: number): string;

    protected override _contextMenu(html: JQuery): void;

    protected override _getFolderContextOptions(): ContextMenuEntry[];

    protected override _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * Get context menu options for individual sound effects
     * @returns The context options for each sound
     * @internal
     */
    protected _getSoundContextOptions(): ContextMenuEntry[];

    protected override _onDragStart(event: DragEvent): void;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onDrop(event: DragEvent): Promise<Playlist.ConfiguredInstance | boolean>;
  }

  namespace PlaylistDirectory {
    type Any = AnyPlaylistDirectory;
    type AnyConstructor = typeof AnyPlaylistDirectory;

    interface PlaylistData extends Document.ToObjectFalseType<Playlist.ConfiguredInstance> {
      modeTooltip: string;
      modeIcon: string;
      disabled: boolean;
      expanded: boolean;
      css: string;
      controlCSS: string;
      sounds: SoundData[];
    }

    interface SoundData extends Document.ToObjectFalseType<PlaylistSound.ConfiguredInstance> {
      playlistId: string | null;
      css: string;
      controlCSS: string;
      playIcon: string;
      playTitle: string;
      isPaused?: boolean;
      pauseIcon?: string;
      lvolume?: number;
      currentTime?: string;
      durationTime?: string;
    }
  }
}

declare abstract class AnyPlaylistDirectory extends PlaylistDirectory<DocumentDirectoryOptions> {
  constructor(arg0: never, ...args: never[]);
}
