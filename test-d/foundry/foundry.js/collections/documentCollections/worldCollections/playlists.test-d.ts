import { expectType } from 'tsd';

const playlists = new Playlists();
expectType<Playlist>(playlists.get('', { strict: true }));
expectType<any[]>(playlists.toJSON()); // TODO Adjust as soon as BasePlaylist and PlaylistData has been typed
expectType<PlaylistDirectory | undefined>(playlists.directory);
