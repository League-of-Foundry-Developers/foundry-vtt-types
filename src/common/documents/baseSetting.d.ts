import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';

/**
 * The Setting Document model.
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
