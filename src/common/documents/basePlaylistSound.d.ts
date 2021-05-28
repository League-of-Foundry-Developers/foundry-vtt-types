import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';

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
