import { expectTypeOf } from "vitest";

const playlistDirectory = new PlaylistDirectory();

expectTypeOf(PlaylistDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(playlistDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(playlistDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(playlistDirectory.render(true)).toEqualTypeOf<PlaylistDirectory>();

expectTypeOf(playlistDirectory.playing).toEqualTypeOf<Playlist.Implementation[]>();
expectTypeOf(PlaylistDirectory.volumeToTooltip(3)).toEqualTypeOf<string>();
