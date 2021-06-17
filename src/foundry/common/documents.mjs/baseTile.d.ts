import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The base Tile model definition which defines common behavior of an Tile document between both client and server.
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
