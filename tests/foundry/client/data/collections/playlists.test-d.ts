import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const playlists = new Playlists([]);
expectTypeOf(playlists.get("", { strict: true })).toEqualTypeOf<Document.Stored<Playlist>>();
expectTypeOf(playlists.toJSON()).toEqualTypeOf<Document.Stored<Playlist>["_source"][]>();
expectTypeOf(playlists.directory).toEqualTypeOf<PlaylistDirectory>();
