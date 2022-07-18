import { expectType } from 'tsd';
import type DataModel from '../../../../../src/foundry/common/abstract/data.mjs';

const playlists = new Playlists();
expectType<StoredDocument<Playlist>>(playlists.get('', { strict: true }));
expectType<(DataModel.SchemaToSource<foundry.documents.BasePlaylist['schema']> & { _id: string | null })[]>(
  playlists.toJSON()
);
expectType<PlaylistDirectory | undefined>(playlists.directory);
