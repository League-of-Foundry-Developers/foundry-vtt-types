import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';

/**
 * The base ChatMessage model definition which defines common behavior of an ChatMessage document between both client and server.
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
