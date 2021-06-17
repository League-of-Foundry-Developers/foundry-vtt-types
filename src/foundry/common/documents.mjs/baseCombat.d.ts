import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { BaseUser } from './baseUser';
import { BaseCombatant } from './baseCombatant';

/**
 * The base Combat model definition which defines common behavior of an Combat document between both client and server.
 */
export declare class BaseCombat extends Document<any, any> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Combat';
      collection: 'combats';
      label: 'DOCUMENT.Combat';
      embedded: {
        Combatant: typeof BaseCombatant;
      };
      isPrimary: true;
      permissions: {
        update: (user: BaseUser, doc: any, data: any) => boolean;
      };
    }
  >;
}
