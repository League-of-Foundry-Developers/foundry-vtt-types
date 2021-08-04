import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BaseScene } from './baseScene';

/**
 * The base AmbientSound model definition which defines common behavior of an AmbientSound document between both client and server.
 */
export declare class BaseAmbientSound extends Document<
  data.AmbientSoundData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>
> {
  static get schema(): typeof data.AmbientSoundData;

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
