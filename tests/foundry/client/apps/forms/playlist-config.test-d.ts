import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const playlist: Playlist.ConfiguredInstance;
const playlistConfig = new PlaylistConfig(playlist);

expectTypeOf(playlistConfig.object).toEqualTypeOf<Playlist>();
expectTypeOf(playlistConfig.document).toEqualTypeOf<Playlist>();
expectTypeOf(PlaylistConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<Playlist.ConfiguredInstance>>();
expectTypeOf(playlistConfig.options).toEqualTypeOf<DocumentSheetOptions<Playlist.ConfiguredInstance>>();
expectTypeOf(playlistConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<PlaylistConfig.PlaylistConfigData>>
>();
expectTypeOf(playlistConfig.render(true)).toEqualTypeOf<PlaylistConfig>();

expectTypeOf(playlistConfig.title).toEqualTypeOf<string>();
