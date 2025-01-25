import { expectTypeOf } from "vitest";

const playlistDirectory = new PlaylistDirectory();

expectTypeOf(PlaylistDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(playlistDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(playlistDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(playlistDirectory.render(true)).toEqualTypeOf<PlaylistDirectory>();

expectTypeOf(playlistDirectory.playing).toEqualTypeOf<Playlist[]>();
expectTypeOf(PlaylistDirectory.volumeToTooltip(3)).toEqualTypeOf<string>();
