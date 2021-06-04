import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The PlaylistSound document model.
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
