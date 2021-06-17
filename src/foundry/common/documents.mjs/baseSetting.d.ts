import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';

/**
 * The base Setting model definition which defines common behavior of an Setting document between both client and server.
 */
export declare class BaseSetting extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Setting';
      collection: 'settings';
      label: 'DOCUMENT.Setting';
      isPrimary: true;
      permissions: {
        create: 'SETTINGS_MODIFY';
        update: 'SETTINGS_MODIFY';
        delete: 'SETTINGS_MODIFY';
      };
    }
  >;
}
