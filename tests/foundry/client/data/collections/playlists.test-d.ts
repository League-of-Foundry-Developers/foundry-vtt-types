import { expectTypeOf } from "vitest";
import type { PlaylistDataSource } from "../../../../../src/foundry/common/data/data.mjs/playlistData.d.mts";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const playlists = new Playlists();
expectTypeOf(playlists.get("", { strict: true })).toEqualTypeOf<StoredDocument<Playlist>>();
expectTypeOf(playlists.toJSON()).toEqualTypeOf<(PlaylistDataSource & { _id: string })[]>();
expectTypeOf(playlists.directory).toEqualTypeOf<PlaylistDirectory | undefined>();
