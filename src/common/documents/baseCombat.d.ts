import { DocumentMetadata } from '../abstract/document';
import { Document } from '../abstract/module';
import { BaseUser } from './baseUser';
import { BaseCombatant } from './baseCombatant';

/**
 * The Combat document model.
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
