import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';
import * as data from '../data/data.mjs';

/**
 * The base ChatMessage model definition which defines common behavior of an ChatMessage document between both client and server.
 */
export declare class BaseChatMessage extends Document<data.ChatMessageData, null> {
  /** @override */
  static get schema(): typeof data.ChatMessageData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'ChatMessage';
      collection: 'messages';
      label: 'DOCUMENT.ChatMessage';
      labelPlural: 'DOCUMENT.ChatMessages';
      isPrimary: true;
      permissions: {
        create: (user: BaseUser, doc: BaseChatMessage) => boolean;
        update: (user: BaseUser, doc: BaseChatMessage, data?: object) => boolean;
        delete: (user: BaseUser, doc: BaseChatMessage) => boolean;
      };
    }
  >;

  /**
   * Is a user able to create a new chat message?
   */
  protected static _canCreate(user: BaseUser, doc: BaseChatMessage): boolean;

  /**
   * Is a user able to update an existing chat message?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseChatMessage, data?: object): boolean;

  /**
   * Is a user able to delete an existing chat message?
   */
  protected static _canDelete(user: BaseUser, doc: BaseChatMessage): boolean;
}
