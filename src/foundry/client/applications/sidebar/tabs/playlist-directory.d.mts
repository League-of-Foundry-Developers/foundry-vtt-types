import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { NumberField } from "#common/data/fields.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";

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
  /**
   * @defaultValue
   * ```js
   * {
   *   collection: "Playlist",
   *   renderUpdateKeys: ["playing", "mode", "sounds", "sorting"],
   *   actions: {
   *     pinCurrentlyPlaying: PlaylistDirectory.#onPinCurrentlyPlaying,
   *     playlistBackward: PlaylistDirectory.#onPlaylistSkip,
   *     playlistForward: PlaylistDirectory.#onPlaylistSkip,
   *     playlistMode: PlaylistDirectory.#onPlaylistCycleMode,
   *     playlistPlay: PlaylistDirectory.#onPlaylistPlayback,
   *     playlistStop: PlaylistDirectory.#onPlaylistPlayback,
   *     soundCreate: PlaylistDirectory.#onSoundAdd,
   *     soundPause: PlaylistDirectory.#onSoundPlayback,
   *     soundPlay: PlaylistDirectory.#onSoundPlayback,
   *     soundRepeat: PlaylistDirectory.#onSoundToggleMode,
   *     soundStop: PlaylistDirectory.#onSoundPlayback,
   *     volumeExpand: PlaylistDirectory.#onVolumeExpand
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /** @defaultValue `"playlists"` */
  static override tabName: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: DocumentDirectory.PARTS.header,
   *   controls: {
   *     template: "templates/sidebar/tabs/playlist/controls.hbs"
   *   },
   *   directory: DocumentDirectory.PARTS.directory,
   *   playing: {
   *     template: "templates/sidebar/tabs/playlist/playing.hbs",
   *     templates: ["templates/sidebar/tabs/playlist/sound-partial.hbs"]
   *   },
   *   footer: DocumentDirectory.PARTS.footer
   * }
   * ```
   */
  static override PARTS: Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Playlist mode button descriptors.
   */
  static PLAYLIST_MODES: Record<CONST.PLAYLIST_MODES, PlaylistDirectory.ControlContext>;

  /** @defaultValue `"templates/sidebar/tabs/playlist/playlist-partial.hbs"` */
  protected static override _entryPartial: string;

  /**
   * Track the playlist IDs which are currently expanded in the display.
   */
  protected _expanded: Set<string>;

  /**
   * Cache the set of Playlist and PlaylistSound documents that are displayed as playing when the directory is rendered.
   */
  protected _playing: {
    context: PlaylistDirectory.SoundContext[];
    playlists: Playlist.Stored[];
    sounds: PlaylistSound.Stored[];
  };

  /**
   * Whether the global volume controls are currently expanded.
   */
  protected _volumeExpanded: boolean;

  /**
   * The location of the currently-playing widget.
   */
  get currentlyPlayingLocation(): "top" | "bottom";

  /**
   * The Playlist documents that are currently playing.
   */
  get playing(): Playlist.Stored[];

  protected override _createContextMenus(): void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Context menu options for individual PlaylistSounds.
   */
  protected _getSoundContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareDirectoryContext(
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Augment the tree directory structure with playlist-level data objects for rendering.
   * @param root - The root render context.
   * @param node - The tree node being prepared.
   */
  protected _prepareTreeContext(
    root: PlaylistDirectory.RenderContext,
    node: foundry.documents.abstract.DirectoryCollectionMixin.TreeNode<Playlist.Stored>,
  ): PlaylistDirectory.TreeContext;

  /**
   * Prepare render context for a playlist.
   * @param root     - The root render context.
   * @param playlist - The Playlist document.
   */
  protected _preparePlaylistContext(
    root: PlaylistDirectory.RenderContext,
    playlist: Playlist.Stored,
  ): PlaylistDirectory.PlaylistContext;

  protected override _preparePartContext(
    partId: string,
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<foundry.applications.api.ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the volume controls part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareControlsContext(
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the currently playing part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _preparePlayingContext(
    context: foundry.applications.api.ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareDuplicateData(document: Playlist.Stored): AnyObject;

  override collapseAll(): void;

  protected override _attachFrameListeners(): void;

  protected override _onClickEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle modifying a global volume slider.
   * @param slider - The slider.
   */
  protected _onGlobalVolume(slider: foundry.applications.elements.HTMLRangePickerElement): void;

  /**
   * Handle modifying a playing PlaylistSound's volume.
   * @param slider - The volume slider.
   */
  protected _onSoundVolume(slider: foundry.applications.elements.HTMLRangePickerElement): void;

  /**
   * Update the displayed timestamps for all currently playing audio sources every second.
   */
  updateTimestamps(): void;

  protected override _onMatchSearchEntry(
    query: string,
    entryIds: Set<string>,
    element: HTMLElement,
    options?: PlaylistDirectory.SearchOptions,
  ): void;

  protected override _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: PlaylistDirectory.SearchOptions,
  ): void;

  protected override _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: AnyObject,
  ): void;

  protected override _onDragStart(event: DragEvent): void;

  protected override _onDrop(event: DragEvent): Promise<void>;

  /**
   * Format the displayed timestamp given a number of seconds as input.
   * @param seconds - The current playback time in seconds.
   * @returns The formatted timestamp.
   */
  protected static formatTimestamp(seconds: number): string;

  /**
   * Register playlist directory specific settings.
   * @internal
   */
  static _registerSettings(): void;

  #PlaylistDirectory: true;
}

declare namespace PlaylistDirectory {
  interface Any extends AnyPlaylistDirectory {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {
    /** @remarks Added by {@linkcode PlaylistDirectory._prepareControlsContext | #_prepareControlsContext} */
    controls?: ControlsContext | undefined;

    /** @remarks Added by {@linkcode PlaylistDirectory._preparePlayingContext | #_preparePlayingContext} */
    currentlyPlaying?: CurrentlyPlayingContext | undefined;

    /** @remarks Added by {@linkcode PlaylistDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    tree?: TreeContext | undefined;
  }

  /** Volume control context. */
  interface ControlsContext {
    expanded: boolean;
    icon: string;
    music: VolumeContext;
    environment: VolumeContext;
    interface: VolumeContext;
  }

  /** Currently playing context. */
  interface CurrentlyPlayingContext {
    /** The CSS class of the currently playing widget. */
    class: string;

    /** Location information for the currently playing widget. */
    location: {
      /** The widget is affixed to the top of the directory. */
      top: boolean;

      /** The widget is affixed to the bottom of the directory. */
      bottom: boolean;
    };

    /** Render context for the currently playing pin icon. */
    pin: {
      /** The icon tooltip. */
      label: string;

      /** The icon class. */
      caret: string;
    };

    /** Render context for the currently playing PlaylistSound documents. */
    sounds: SoundContext[];
  }

  interface VolumeContext {
    /** The volume modifier in the interval [0, 1]. */
    modifier: number;

    /** The DataField specification for the form input. */
    field: NumberField;

    /** The form input name. */
    name?: string | undefined;

    /** HTML dataset attributes. */
    dataset: Record<string, string>;

    /** HTML ARIA attributes. */
    aria: Record<string, string>;
  }

  /** Render context for the directory tree. */
  interface TreeContext {
    /** Render context for the Playlist documents at this node. */
    entries: PlaylistContext[];

    /** Render context for this node's children. */
    children: TreeContext[];

    /**
     * The Folder document that represents this node.
     * @remarks `null` for the root node
     */
    folder: Folder.Stored | null;

    /** The node's depth in the tree. */
    depth: number;
  }

  interface ControlContext {
    /** The button icon. */
    icon: string;

    /** The button label. */
    label: string;
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

    /** Whether the Playlist is currently playing. */
    playing: boolean;

    /** Render context for this Playlist's PlaylistSounds. */
    sounds: SoundContext[];

    /** The mode icon context. */
    mode: ControlContext;

    /** Whether the Playlist is currently disabled. */
    disabled: boolean;

    /** The CSS class. */
    css: string;
  }

  interface SoundContext {
    /** The PlaylistSound ID. */
    id: string;

    uuid: string;

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
     * PlaylistSound pause context.
     * @remarks Only set when the sound has a loaded, non-failed `Sound` and is playing or paused.
     */
    pause?:
      | {
          /** Whether the PlaylistSound is currently paused. */
          paused: boolean;

          /** The pause icon. */
          icon: string;

          /** Whether the pause button is disabled. */
          disabled: boolean;
        }
      | undefined;

    /**
     * PlaylistSound volume context.
     * @remarks Only set when the sound has a loaded, non-failed `Sound` and is playing or paused.
     */
    volume?: VolumeContext | undefined;

    /**
     * The current playing timestamp.
     * @remarks Only set when the sound has a loaded, non-failed `Sound` and is playing or paused.
     */
    currentTime?: string | undefined;

    /**
     * The duration timestamp.
     * @remarks Only set when the sound has a loaded, non-failed `Sound` and is playing or paused.
     */
    durationTime?: string | undefined;
  }

  interface SearchOptions {
    soundIds?: Set<string> | undefined;
    plNameHits?: Set<string> | undefined;
  }

  interface Configuration extends DocumentDirectory.Configuration {}

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
