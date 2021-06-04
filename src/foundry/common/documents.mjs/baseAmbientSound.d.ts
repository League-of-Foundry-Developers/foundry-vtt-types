import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The AmbientSound document model.
 */
export declare class BaseAmbientSound extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'AmbientSound';
      collection: 'sounds';
      label: 'DOCUMENT.AmbientSound';
      isEmbedded: true;
      types: ['l', 'g'];
    }
  >;
}
