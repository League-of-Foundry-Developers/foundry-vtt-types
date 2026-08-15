import { expectTypeOf } from "vitest";
import type { AnyMutableObject, DeepPartial } from "fvtt-types/utils";

import ContextMenu = foundry.applications.ux.ContextMenu;
import DirectoryCollectionMixin = foundry.documents.abstract.DirectoryCollectionMixin;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import PlaylistDirectory = foundry.applications.sidebar.tabs.PlaylistDirectory;
import Playlists = foundry.documents.collections.Playlists;

declare const directory: PlaylistDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from their literals so a subclass can occupy its own tab and render its own entry template.
expectTypeOf(PlaylistDirectory.tabName).toBeString();
expectTypeOf(PlaylistDirectory["_entryPartial"]).toBeString();
expectTypeOf(PlaylistDirectory.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(PlaylistDirectory.PLAYLIST_MODES).toEqualTypeOf<
  Record<foundry.CONST.PLAYLIST_MODES, PlaylistDirectory.ControlContext>
>();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<Playlists.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Playlist.ImplementationClass>();

expectTypeOf(directory["_expanded"]).toEqualTypeOf<Set<string>>();
expectTypeOf(directory["_playing"]).toEqualTypeOf<PlaylistDirectory.PlayingCache>();
expectTypeOf(directory["_volumeExpanded"]).toBeBoolean();
expectTypeOf(directory.currentlyPlayingLocation).toEqualTypeOf<"top" | "bottom">();
expectTypeOf(directory.playing).toEqualTypeOf<Playlist.Implementation[]>();

expectTypeOf(directory["_createContextMenus"]()).toBeVoid();
expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_getSoundContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();

declare const context: DeepPartial<PlaylistDirectory.RenderContext>;
declare const renderOptions: DeepPartial<PlaylistDirectory.RenderOptions>;
expectTypeOf(directory["_onFirstRender"](context, renderOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onRender"](context, renderOptions)).toEqualTypeOf<Promise<void>>();

declare const partContext: PlaylistDirectory.RenderContext;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;
expectTypeOf(directory["_prepareDirectoryContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_prepareControlsContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_preparePlayingContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();

declare const node: DirectoryCollectionMixin.TreeNode<Playlist.Implementation>;
declare const playlist: Playlist.Implementation;
expectTypeOf(directory["_prepareTreeContext"](partContext, node)).toEqualTypeOf<PlaylistDirectory.TreeContext>();
expectTypeOf(
  directory["_preparePlaylistContext"](partContext, playlist),
).toEqualTypeOf<PlaylistDirectory.PlaylistContext>();
expectTypeOf(directory["_prepareDuplicateData"](playlist)).toEqualTypeOf<AnyMutableObject>();

expectTypeOf(directory.collapseAll()).toBeVoid();
expectTypeOf(directory.updateTimestamps()).toBeVoid();
expectTypeOf(directory["_attachFrameListeners"]()).toBeVoid();

declare const pointerEvent: PointerEvent;
declare const dragEvent: DragEvent;
declare const target: HTMLElement;
expectTypeOf(directory["_onClickEntry"](pointerEvent, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onDragStart"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDrop"](dragEvent)).toEqualTypeOf<Promise<void>>();

declare const slider: foundry.applications.elements.HTMLRangePickerElement;
expectTypeOf(directory["_onGlobalVolume"](slider)).toBeVoid();
expectTypeOf(directory["_onSoundVolume"](slider)).toBeVoid();

declare const entryIds: Set<string>;
declare const folderIds: Set<string>;
declare const autoExpandIds: Set<string>;
declare const rgx: RegExp;
expectTypeOf(directory["_onMatchSearchEntry"]("query", entryIds, target)).toBeVoid();
expectTypeOf(directory["_onMatchSearchEntry"]("query", entryIds, target, { soundIds: entryIds })).toBeVoid();
expectTypeOf(directory["_matchSearchEntries"](rgx, entryIds, folderIds, autoExpandIds)).toBeVoid();
expectTypeOf(directory["_matchSearchFolders"](rgx, folderIds, autoExpandIds)).toBeVoid();

expectTypeOf(PlaylistDirectory["formatTimestamp"](90)).toBeString();
expectTypeOf(PlaylistDirectory._registerSettings()).toBeVoid();

// Each of these is written by the part that needs it, so none is present on a freshly prepared context.
expectTypeOf<PlaylistDirectory.RenderContext["controls"]>().toEqualTypeOf<
  PlaylistDirectory.ControlsContext | undefined
>();
expectTypeOf<PlaylistDirectory.RenderContext["currentlyPlaying"]>().toEqualTypeOf<
  PlaylistDirectory.CurrentlyPlayingContext | undefined
>();
expectTypeOf<PlaylistDirectory.RenderContext["tree"]>().toEqualTypeOf<PlaylistDirectory.TreeContext | undefined>();
expectTypeOf<PlaylistDirectory.PreparePartContext["controls"]>().toEqualTypeOf<PlaylistDirectory.ControlsContext>();
expectTypeOf<
  PlaylistDirectory.PreparePartContext["currentlyPlaying"]
>().toEqualTypeOf<PlaylistDirectory.CurrentlyPlayingContext>();
expectTypeOf<PlaylistDirectory.PreparePartContext["tree"]>().toEqualTypeOf<PlaylistDirectory.TreeContext>();

// The root tree node carries no folder.
expectTypeOf<PlaylistDirectory.TreeContext["folder"]>().toEqualTypeOf<Folder.Stored | null>();

// Only set for a loaded sound that is playing or paused.
expectTypeOf<PlaylistDirectory.SoundContext["pause"]>().toEqualTypeOf<PlaylistDirectory.PauseContext | undefined>();
expectTypeOf<PlaylistDirectory.SoundContext["volume"]>().toEqualTypeOf<PlaylistDirectory.VolumeContext | undefined>();
expectTypeOf<PlaylistDirectory.SoundContext["currentTime"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<PlaylistDirectory.SoundContext["durationTime"]>().toEqualTypeOf<string | undefined>();
