import { expectTypeOf } from "vitest";
import { Playlists } from "#client/documents/collections/_module.mjs";

const playlists = new Playlists([]);
expectTypeOf(playlists.get("", { strict: true })).toEqualTypeOf<Playlist.Stored>();
expectTypeOf(playlists.toJSON()).toEqualTypeOf<Playlist.Stored["_source"][]>();
expectTypeOf(playlists.directory).toEqualTypeOf<PlaylistDirectory>();
