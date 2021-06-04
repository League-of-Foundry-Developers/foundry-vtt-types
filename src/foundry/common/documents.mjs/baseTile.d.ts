import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

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
