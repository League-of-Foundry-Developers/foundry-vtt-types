import { DocumentMetadata, DocumentModificationOptions } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import * as data from '../data/data.mjs';
import { BaseUser } from './baseUser';
import { ConfiguredDocumentClass, ConstructorDataType } from '../../../types/helperTypes';
import { BaseCards } from './baseCards';

/**
 * The base Card definition which defines common behavior of an embedded Card document shared by both client and server.
 */
export declare class BaseCard extends Document<data.CardData, InstanceType<ConfiguredDocumentClass<typeof BaseCards>>> {
  /** @override */
  static get schema(): typeof data.CardData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Card';
      collection: 'cards';
      label: 'DOCUMENT.Card';
      labelPlural: 'DOCUMENT.Cards';
      isEmbedded: true;
      types: string[];
      hasSystemData: true;
      permissions: {
        create: typeof BaseCard['_canCreate'];
        update: typeof BaseCard['_canUpdate'];
      };
    }
  >;

  /**
   * The sub-type of Card.
   */
  get type(): data.CardData['type'];

  /** @override */
  protected _preCreate(
    data: ConstructorDataType<data.CardData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  /**
   * Is a User able to create a new embedded Card document within this parent?
   */
  protected static _canCreate(user: BaseUser, doc: BaseCard, data?: object): boolean;

  /**
   * Is a user able to update an existing Card?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseCard, data?: object): boolean;

  /** @override */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_PERMISSION_LEVELS | foundry.CONST.DOCUMENT_PERMISSION_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;
}
