import { expectType } from "tsd";
import type { PlaylistDataSource } from "../../../../../src/foundry/common/data/data.mjs/playlistData";

const playlists = new Playlists();
expectType<StoredDocument<Playlist>>(playlists.get("", { strict: true }));
expectType<(PlaylistDataSource & { _id: string })[]>(playlists.toJSON());
expectType<PlaylistDirectory | undefined>(playlists.directory);
