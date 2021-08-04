import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { EntityPermission } from '../constants.mjs';
import * as data from '../data/data.mjs';
import { BaseScene } from './baseScene';
import { BaseUser } from './baseUser';

/**
 * The base Note model definition which defines common behavior of an Note document between both client and server.
 */
export declare class BaseNote extends Document<data.NoteData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
  /** @override */
  static get schema(): typeof data.NoteData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Note';
      collection: 'notes';
      label: 'DOCUMENT.Note';
      isEmbedded: true;
      permissions: {
        create: 'NOTE_CREATE';
      };
    }
  >;

  /** @override */
  testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.ENTITY_PERMISSIONS | EntityPermission,
    { exact }?: { exact?: boolean }
  ): boolean;
}
