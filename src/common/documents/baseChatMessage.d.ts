import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';

/**
 * The ChatMessage document model.
 */
export declare class BaseChatMessage extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'ChatMessage';
      collection: 'messages';
      label: 'DOCUMENT.ChatMessage';
      isPrimary: true;
      permissions: {
        create: (user: BaseUser, doc: any) => boolean;
        update: (user: BaseUser, doc: any, data: any) => boolean;
        delete: (user: BaseUser, doc: any) => boolean;
      };
    }
  >;
}
