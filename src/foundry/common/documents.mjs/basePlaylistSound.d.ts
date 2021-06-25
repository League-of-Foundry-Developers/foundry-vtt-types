import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The PlaylistSound model definition which defines common behaviour of a PlaylistSound document between both client and server.
 */
export declare class BasePlaylistSound extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'PlaylistSound';
      collection: 'sounds';
      label: 'DOCUMENT.PlaylistSound';
      isEmbedded: true;
    }
  >;
}
