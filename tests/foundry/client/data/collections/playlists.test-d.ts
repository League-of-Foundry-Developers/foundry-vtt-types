import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const playlists = new Playlists([]);
expectTypeOf(playlists.get("", { strict: true })).toEqualTypeOf<StoredDocument<Playlist>>();
expectTypeOf(playlists.toJSON()).toEqualTypeOf<StoredDocument<Playlist>["_source"][]>();
expectTypeOf(playlists.directory).toEqualTypeOf<PlaylistDirectory>();
