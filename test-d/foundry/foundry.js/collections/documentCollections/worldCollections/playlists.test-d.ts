import { expectType } from 'tsd';
import type { PlaylistDataProperties } from '../../../../../../src/foundry/common/data/data.mjs/playlistData';
import type { PropertiesToSource } from '../../../../../../src/types/helperTypes';

const playlists = new Playlists();
expectType<StoredDocument<Playlist>>(playlists.get('', { strict: true }));
expectType<(PropertiesToSource<PlaylistDataProperties> & { _id: string })[]>(playlists.toJSON());
expectType<PlaylistDirectory | undefined>(playlists.directory);
