import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BasePlaylistSound } from './basePlaylistSound';

/**
 * The Playlist document model.
 */
export declare class BasePlaylist extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Playlist';
      collection: 'playlists';
      label: 'DOCUMENT.Playlist';
      embedded: {
        PlaylistSound: typeof BasePlaylistSound;
      };
      isPrimary: true;
    }
  >;
}
