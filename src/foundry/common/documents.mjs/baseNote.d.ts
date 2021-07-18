import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BaseScene } from './baseScene';

/**
 * The base Note model definition which defines common behavior of an Note document between both client and server.
 */
export declare class BaseNote extends Document<data.NoteData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
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
