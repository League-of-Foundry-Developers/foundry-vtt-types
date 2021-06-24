import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import { data } from '../module.mjs';
import { BaseCombat } from './baseCombat';
import { BaseUser } from './baseUser';

/**
 * The base Combatant model definition which defines common behavior of an Combatant document between both client and server.
 */
export declare class BaseCombatant extends Document<data.CombatantData, BaseCombat> {
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Combatant';
      collection: 'combatants';
      label: 'DOCUMENT.Combatant';
      isEmbedded: true;
      permissions: {
        create: 'PLAYER';
        update: typeof BaseCombatant._canUpdate;
      };
    }
  >;

  /**
   * Is a user able to update an existing Combatant?
   * @remarks doc seems unused
   */
  protected static _canUpdate(user: foundry.documents.BaseUser, doc: unknown, data: data.CombatantData): boolean;
}
