import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const playlist: Playlist.Implementation;
const playlistConfig = new PlaylistConfig(playlist);

expectTypeOf(playlistConfig.object).toEqualTypeOf<Playlist.Implementation>();
expectTypeOf(playlistConfig.document).toEqualTypeOf<Playlist.Implementation>();
expectTypeOf(PlaylistConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<Playlist.Implementation>>();
expectTypeOf(playlistConfig.options).toEqualTypeOf<DocumentSheet.Options<Playlist.Implementation>>();
expectTypeOf(playlistConfig.getData()).toEqualTypeOf<
  MaybePromise<GetDataReturnType<PlaylistConfig.PlaylistConfigData>>
>();
expectTypeOf(playlistConfig.render(true)).toEqualTypeOf<PlaylistConfig>();

expectTypeOf(playlistConfig.title).toEqualTypeOf<string>();
