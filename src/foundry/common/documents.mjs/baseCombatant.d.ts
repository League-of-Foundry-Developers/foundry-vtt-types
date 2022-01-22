import { ConfiguredDocumentClass } from '../../../types/helperTypes';
import { DocumentMetadata } from '../abstract/document.mjs';
import { Document } from '../abstract/module.mjs';
import type { CombatantDataConstructorData } from '../data/data.mjs/combatantData.js';
import { data } from '../module.mjs';
import { BaseCombat } from './baseCombat';
import { BaseUser } from './baseUser';

/**
 * The base Combatant model definition which defines common behavior of an Combatant document between both client and server.
 */
export declare class BaseCombatant extends Document<
  data.CombatantData,
  InstanceType<ConfiguredDocumentClass<typeof BaseCombat>>
> {
  /** @override */
  static get schema(): typeof data.CombatantData;

  /** @override */
  static get metadata(): Merge<
    DocumentMetadata,
    {
      name: 'Combatant';
      collection: 'combatants';
      label: 'DOCUMENT.Combatant';
      isEmbedded: true;
      labelPlural: 'DOCUMENT.Combatants';
      permissions: {
        create: typeof BaseCombatant._canCreate;
        update: typeof BaseCombatant._canUpdate;
      };
    }
  >;

  /**
   * Is a user able to update an existing Combatant?
   * @remarks doc seems unused
   */
  protected static _canUpdate(user: BaseUser, doc: BaseCombatant, data?: CombatantDataConstructorData): boolean;

  /** Is a user able to create this Combatant? */
  protected static _canCreate(user: BaseUser, doc: BaseCombatant, data?: CombatantDataConstructorData): boolean;
}
