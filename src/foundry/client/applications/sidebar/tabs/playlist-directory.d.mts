import type { AnyMutableObject, AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type HTMLRangePickerElement from "../../elements/range-picker.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

import DirectoryCollectionMixin = foundry.documents.abstract.DirectoryCollectionMixin;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistDirectory: PlaylistDirectory.Any;
    }
  }
}

/**
 * The World Playlist directory listing.
 */
declare class PlaylistDirectory<
  RenderContext extends PlaylistDirectory.RenderContext = PlaylistDirectory.RenderContext,
  Configuration extends PlaylistDirectory.Configuration = PlaylistDirectory.Configuration,
  RenderOptions extends PlaylistDirectory.RenderOptions = PlaylistDirectory.RenderOptions,
> extends DocumentDirectory<Playlist.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: PlaylistDirectory.DefaultOptions;

  /** @defaultValue `"playlists"` */
  static override tabName: string;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Playlist mode button descriptors.
   */
  static PLAYLIST_MODES: Record<foundry.CONST.PLAYLIST_MODES, PlaylistDirectory.ControlContext>;

  /** @defaultValue `"templates/sidebar/tabs/playlist/playlist-partial.hbs"` */
  protected static override _entryPartial: string;

  /**
   * Track the playlist IDs which are currently expanded in the display.
   *
   * @remarks Seeded from the playlists that are already playing when the directory is constructed.
   */
  protected _expanded: Set<string>;

  /**
   * Cache the set of Playlist and PlaylistSound documents that are displayed as playing when the directory is
   * rendered.
   */
  protected _playing: PlaylistDirectory.PlayingCache;

  /**
   * Whether the global volume controls are currently expanded.
   *
   * @defaultValue `true`
   */
  protected _volumeExpanded: boolean;

  /**
   * The location of the currently-playing widget.
   *
   * @remarks Read from the `core.playlist.playingLocation` client setting.
   */
  get currentlyPlayingLocation(): "top" | "bottom";

  /**
   * The Playlist documents that are currently playing.
   *
   * @remarks Empty until the directory part has rendered.
   */
  get playing(): Playlist.Implementation[];

  // Fake override.
  override get collection(): foundry.documents.collections.Playlists.Implementation;

  /**
   * @remarks Rebinds the entry menu to playlist headers and adds a sound menu.
   *
   * Fires the `getFolderContextOptions`, `getPlaylistContextOptions` and `getPlaylistSoundContextOptions` hooks.
   */
  protected override _createContextMenus(): void;

  /**
   * @remarks Adds preload and bulk-import entries.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Context menu options for individual PlaylistSounds.
   */
  protected _getSoundContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * @remarks Starts timestamp updates unless the tab is a popout.
   */
  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * @remarks Positions the playing widget and binds sound drag-and-drop.
   */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * @remarks Resets the playing cache for each render.
   */
  protected override _prepareDirectoryContext(
    context: PlaylistDirectory.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Augment the tree directory structure with playlist-level data objects for rendering.
   * @param root - The root render context.
   * @param node - The tree node being prepared.
   */
  protected _prepareTreeContext(
    root: PlaylistDirectory.RenderContext,
    node: DirectoryCollectionMixin.TreeNode<Playlist.Implementation>,
  ): PlaylistDirectory.TreeContext;

  /**
   * Prepare render context for a playlist.
   * @param root     - The root render context.
   * @param playlist - The Playlist document.
   *
   * @remarks Populates the playing cache and omits inaccessible sounds.
   */
  protected _preparePlaylistContext(
    root: PlaylistDirectory.RenderContext,
    playlist: Playlist.Implementation,
  ): PlaylistDirectory.PlaylistContext;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the volume controls part.
   */
  protected _prepareControlsContext(
    context: PlaylistDirectory.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for the currently playing part.
   */
  protected _preparePlayingContext(
    context: PlaylistDirectory.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /** @remarks Clears the playing state from the duplicate and from every one of its sounds. */
  protected override _prepareDuplicateData(document: Playlist.Implementation): AnyMutableObject;

  /** @remarks Also collapses every playlist and the global volume controls. */
  override collapseAll(): void;

  protected override _attachFrameListeners(): void;

  /**
   * @remarks Toggles expansion instead of opening the playlist sheet.
   */
  protected override _onClickEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle modifying a global volume slider.
   * @param slider - The slider.
   *
   * @remarks Unmutes the global audio context when it was muted.
   */
  protected _onGlobalVolume(slider: HTMLRangePickerElement): void;

  /**
   * Handle modifying a playing PlaylistSound's volume.
   * @param slider - The volume slider.
   *
   * @remarks Updates locally at once and debounces owned-sound persistence.
   */
  protected _onSoundVolume(slider: HTMLRangePickerElement): void;

  /**
   * Update the displayed timestamps for all currently playing audio sources every second.
   */
  updateTimestamps(): void;

  /**
   * @remarks Also shows or hides the entry's individual sound rows, and expands a playlist that the query matched.
   */
  protected override _onMatchSearchEntry(
    query: string,
    entryIds: Set<string>,
    element: HTMLElement,
    options?: PlaylistDirectory.MatchSearchOptions,
  ): void;

  /**
   * @remarks Matches sounds and playlists; matching folders retain their subtrees.
   * `options` receives the sound and playlist matches.
   */
  protected override _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: PlaylistDirectory.MatchSearchOptions,
  ): void;

  /**
   * @remarks Folder matching is handled by {@linkcode PlaylistDirectory._matchSearchEntries}.
   */
  protected override _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: AnyObject,
  ): void;

  /** @remarks Drags an individual sound when the drag started on one, and otherwise drags the playlist. */
  protected override _onDragStart(event: DragEvent): void;

  /**
   * @remarks Copies or sorts dropped sounds; other drops defer to the base.
   */
  protected override _onDrop(event: DragEvent): Promise<void>;

  /**
   * Format the displayed timestamp given a number of seconds as input.
   * @param seconds - The current playback time in seconds.
   * @returns The formatted timestamp.
   *
   * @remarks Returns `"∞"` for a non-finite duration, which is what an unloaded sound reports.
   */
  protected static formatTimestamp(seconds: number): string;

  /**
   * Register playlist directory specific settings.
   * @internal
   */
  static _registerSettings(): void;

  #PlaylistDirectory: true;

  static #PlaylistDirectoryStatic: true;
}

declare namespace PlaylistDirectory {
  interface Any extends AnyPlaylistDirectory {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistDirectory> {}

  interface PlayingCache {
    context: SoundContext[];

    playlists: Playlist.Implementation[];

    sounds: PlaylistSound.Implementation[];
  }

  interface ControlContext {
    /** The button icon. */
    icon: string;

    /** The button label. */
    label: string;
  }

  interface VolumeContext {
    /** The volume modifier in the interval [0, 1]. */
    modifier: number;

    /** The DataField specification for the form input. */
    field: foundry.data.fields.NumberField;

    /** The form input name. */
    name?: string | undefined;

    /** HTML dataset attributes. */
    dataset: Record<string, string>;

    /** HTML ARIA attributes. */
    aria: Record<string, string>;
  }

  interface TreeContext {
    /** Render context for the Playlist documents at this node. */
    entries: PlaylistContext[];

    /** Render context for this node's children. */
    children: TreeContext[];

    /**
     * The Folder document that represents this node.
     *
     * @remarks `null` for the root node, which is the one the directory part starts from.
     */
    folder: Folder.Stored | null;

    /** The node's depth in the tree. */
    depth: number;
  }

  interface PlaylistContext {
    /** The Playlist ID. */
    id: string;

    /** The Playlist name. */
    name: string;

    /** Whether the Playlist is expanded in the sidebar. */
    expanded: boolean;

    /** Whether the current user has ownership of this Playlist. */
    isOwner: boolean;

    /** Render context for this Playlist's PlaylistSounds. */
    sounds: SoundContext[];

    /** The mode icon context. */
    mode: ControlContext;

    /** Whether the Playlist is currently disabled. */
    disabled: boolean;

    /** The CSS class. */
    css: string;

    /** @privateRemarks Missing from Foundry's typedef. */
    playing: boolean;
  }

  interface SoundContext {
    /** The PlaylistSound ID. */
    id: string;

    /** The track name. */
    name: string;

    /** Whether the PlaylistSound is currently playing. */
    playing: boolean;

    /** Whether the track is set to loop. */
    repeat: boolean;

    /** Whether the current user has ownership of this PlaylistSound. */
    isOwner: boolean;

    /** The parent Playlist ID. */
    playlistId: string;

    /** The CSS class. */
    css: string;

    /** The play button context. */
    play: ControlContext;

    /**
     * @privateRemarks Missing from Foundry's typedef; required to key playing rows.
     */
    uuid: string;

    /**
     * PlaylistSound pause context.
     *
     * @remarks Present only for a sound that is loaded and either playing or paused, along with
     * {@linkcode SoundContext.volume | volume}, {@linkcode SoundContext.currentTime | currentTime} and
     * {@linkcode SoundContext.durationTime | durationTime}.
     */
    pause?: PauseContext | undefined;

    /** PlaylistSound volume context. */
    volume?: VolumeContext | undefined;

    /** The current playing timestamp. */
    currentTime?: string | undefined;

    /** The duration timestamp. */
    durationTime?: string | undefined;
  }

  interface PauseContext {
    /** Whether the PlaylistSound is currently paused. */
    paused: boolean;

    /** The pause icon. */
    icon: string;

    /** Whether the pause button is disabled. */
    disabled: boolean;
  }

  interface ControlsContext {
    /** The expanded state of the volume controls. */
    expanded: boolean;

    /** @privateRemarks Missing from Foundry's typedef. */
    icon: string;

    /** Music volume context. */
    music: VolumeContext;

    /** Environment volume context. */
    environment: VolumeContext;

    /** Interface volume context. */
    interface: VolumeContext;
  }

  interface CurrentlyPlayingContext {
    /** The CSS class of the currently playing widget. */
    class: string;

    /** Location information for the currently playing widget. */
    location: CurrentlyPlayingLocation;

    /** Render context for the currently playing pin icon. */
    pin: PinContext;

    /** Render context for the currently playing PlaylistSound documents. */
    sounds: SoundContext[];
  }

  interface CurrentlyPlayingLocation {
    /** The widget is affixed to the top of the directory. */
    top: boolean;

    /** The widget is affixed to the bottom of the directory. */
    bottom: boolean;
  }

  interface PinContext {
    /** The icon tooltip. */
    label: string;

    /** The icon class. */
    caret: string;
  }

  /**
   * @privateRemarks Members are part-specific and therefore optional despite Foundry's typedef.
   */
  interface RenderContext extends DocumentDirectory.RenderContext {
    /** Volume control context. */
    controls?: ControlsContext | undefined;

    /** Currently playing context. */
    currentlyPlaying?: CurrentlyPlayingContext | undefined;

    /** Render context for the directory tree. */
    tree?: TreeContext | undefined;
  }

  /**
   * @remarks Carries search matches between the two search hooks.
   */
  interface MatchSearchOptions extends AnyObject {
    /** The IDs of the sounds the query matched. */
    soundIds?: Set<string> | undefined;

    /** The IDs of the playlists whose own name the query matched. */
    plNameHits?: Set<string> | undefined;
  }

  interface Configuration<
    PlaylistDirectory extends PlaylistDirectory.Any = PlaylistDirectory.Any,
  > extends DocumentDirectory.Configuration<PlaylistDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PlaylistDirectory extends PlaylistDirectory.Any = PlaylistDirectory.Any> = DeepPartial<
    Configuration<PlaylistDirectory>
  > &
    object;

  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyPlaylistDirectory extends PlaylistDirectory<
  PlaylistDirectory.RenderContext,
  PlaylistDirectory.Configuration,
  PlaylistDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistDirectory;
