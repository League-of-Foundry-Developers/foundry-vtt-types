import type { DeepPartial, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type { CombatDataConstructorData } from "../data/data.mjs/combatData.d.mts";
import type { data } from "../module.d.mts";
import type { BaseCombatant } from "./baseCombatant.d.mts";
import type { BaseUser } from "./baseUser.d.mts";

type CombatMetadata = Merge<
  DocumentMetadata,
  {
    name: "Combat";
    collection: "combats";
    label: "DOCUMENT.Combat";
    labelPlural: "DOCUMENT.Combats";
    embedded: {
      Combatant: typeof BaseCombatant;
    };
    isPrimary: true;
    permissions: {
      update: (user: BaseUser, doc: BaseCombat, data: DeepPartial<CombatDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base Combat model definition which defines common behavior of an Combat document between both client and server.
 */
export declare class BaseCombat extends Document<data.CombatData, null, CombatMetadata> {
  static override get schema(): typeof data.CombatData;

  static override get metadata(): CombatMetadata;

  /** A reference to the Collection of Combatant instances in the Combat document, indexed by id. */
  get combatants(): this["data"]["combatants"];

  /**
   * Is a user able to update an existing Combat?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseCombat, data: DeepPartial<CombatDataConstructorData>): boolean;
}
