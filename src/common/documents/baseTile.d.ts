import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';

/**
 * The Tile embedded document model.
 */
export declare class BaseTile extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Tile';
      collection: 'tiles';
      label: 'DOCUMENT.Tile';
      isEmbedded: true;
    }
  >;
}
