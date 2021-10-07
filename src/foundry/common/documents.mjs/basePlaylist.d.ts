import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BasePlaylistSound } from './basePlaylistSound';

/**
 * The base Playlist model definition which defines common behavior of an Playlist document between both client and server.
 */
export declare class BasePlaylist extends Document<data.PlaylistData> {
  /** @override */
  static get schema(): typeof data.PlaylistData;

  /** @override */
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

  /**
   * A reference to the Collection of ActiveEffect instances in the Actor document, indexed by _id.
   */
  get sounds(): this['data']['sounds'];
}
