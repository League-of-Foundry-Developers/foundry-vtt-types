import { expectTypeOf } from "vitest";

const playlists = new Playlists([]);
expectTypeOf(playlists.get("", { strict: true })).toEqualTypeOf<Playlist.Stored>();
expectTypeOf(playlists.toJSON()).toEqualTypeOf<Playlist.Stored["_source"][]>();
expectTypeOf(playlists.directory).toEqualTypeOf<PlaylistDirectory>();
