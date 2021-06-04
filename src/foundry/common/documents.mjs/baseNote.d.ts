import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The Note embedded document model.
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
