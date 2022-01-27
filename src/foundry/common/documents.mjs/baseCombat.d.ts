import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import type { CombatDataConstructorData } from '../data/data.mjs/combatData.js';
import { data } from '../module.mjs';
import { BaseCombatant } from './baseCombatant';
import { BaseUser } from './baseUser';

/**
 * The base Combat model definition which defines common behavior of an Combat document between both client and server.
 */
export declare class BaseCombat extends Document<data.CombatData> {
  /** @override */
  static get schema(): typeof data.CombatData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Combat';
      collection: 'combats';
      label: 'DOCUMENT.Combat';
      labelPlural: 'DOCUMENT.Combats';
      embedded: {
        Combatant: typeof BaseCombatant;
      };
      isPrimary: true;
      permissions: {
        update: typeof BaseCombat._canUpdate;
      };
    }
  >;

  /** A reference to the Collection of Combatant instances in the Combat document, indexed by id. */
  get combatants(): this['data']['combatants'];

  /**
   * Is a user able to update an existing Combat?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseCombat, data: DeepPartial<CombatDataConstructorData>): boolean;
}
