import { expectTypeOf } from "vitest";

import PlaylistDirectory = foundry.applications.sidebar.tabs.PlaylistDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(PlaylistDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(PlaylistDirectory.tabName).toEqualTypeOf<string>();
expectTypeOf(PlaylistDirectory.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(PlaylistDirectory.PLAYLIST_MODES).toEqualTypeOf<
  Record<CONST.PLAYLIST_MODES, PlaylistDirectory.ControlContext>
>();

declare const directory: PlaylistDirectory;
expectTypeOf(directory.currentlyPlayingLocation).toEqualTypeOf<"top" | "bottom">();
expectTypeOf(directory.playing).toEqualTypeOf<Playlist.Stored[]>();
expectTypeOf(directory.collapseAll()).toBeVoid();
expectTypeOf(directory.updateTimestamps()).toBeVoid();

declare class _TestPlaylistDirectorySubclass extends PlaylistDirectory {
  protected override _getSoundContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _prepareTreeContext(
    root: PlaylistDirectory.RenderContext,
    node: foundry.documents.abstract.DirectoryCollectionMixin.TreeNode<Playlist.Stored>,
  ): PlaylistDirectory.TreeContext;
  protected override _preparePlaylistContext(
    root: PlaylistDirectory.RenderContext,
    playlist: Playlist.Stored,
  ): PlaylistDirectory.PlaylistContext;
  protected override _onClickEntry(event: PointerEvent, target: HTMLElement): Promise<void>;
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
  protected override _onDragStart(event: DragEvent): void;
  protected override _onDrop(event: DragEvent): Promise<void>;
}
