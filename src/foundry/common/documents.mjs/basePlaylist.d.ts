import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
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
