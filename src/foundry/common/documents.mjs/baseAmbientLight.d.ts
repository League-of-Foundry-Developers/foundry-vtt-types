import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BaseScene } from './baseScene';

/**
 * The base AmbientLight model definition which defines common behavior of an AmbientLight document between both client and server.
 */
export declare class BaseAmbientLight extends Document<data.AmbientLightData, BaseScene> {
  static get schema(): typeof data.AmbientLightData;

  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'AmbientLight';
      collection: 'lights';
      label: 'DOCUMENT.AmbientLight';
      isEmbedded: true;
    }
  >;

  /** @override */
  protected _initialize(): void;
}
