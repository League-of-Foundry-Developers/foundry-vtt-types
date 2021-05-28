import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';

/**
 * The AmbientLight embedded document model.
 */
export declare class BaseAmbientLight extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'AmbientLight';
      collection: 'lights';
      label: 'DOCUMENT.AmbientLight';
      isEmbedded: true;
    }
  >;
}
