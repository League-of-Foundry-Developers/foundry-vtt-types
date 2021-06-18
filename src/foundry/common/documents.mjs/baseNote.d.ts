import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The base Note model definition which defines common behavior of an Note document between both client and server.
 */
export declare class BaseNote extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Note';
      collection: 'notes';
      label: 'DOCUMENT.Note';
      isEmbedded: true;
    }
  >;
}
