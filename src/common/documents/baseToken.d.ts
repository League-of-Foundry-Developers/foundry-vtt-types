import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';

/**
 * The Token document model.
 */
export declare class BaseToken extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Token';
      collection: 'tokens';
      label: 'DOCUMENT.Token';
      isEmbedded: true;
      permissions: {
        create: 'TOKEN_CREATE';
        update: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
