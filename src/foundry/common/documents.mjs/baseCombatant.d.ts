import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import type { CombatantDataConstructorData, CombatantDataSource } from "../data/data.mjs/combatantData";
import { data } from "../module.mjs";
import { BaseCombat } from "./baseCombat";
import { BaseUser } from "./baseUser";

type CombatantMetadata = Merge<
  DocumentMetadata,
  {
    name: "Combatant";
    collection: "combatants";
    label: "DOCUMENT.Combatant";
    isEmbedded: true;
    labelPlural: "DOCUMENT.Combatants";
    permissions: {
      create: (user: BaseUser, doc: BaseCombatant, data: CombatantDataSource) => boolean;
      update: (user: BaseUser, doc: BaseCombatant, data: DeepPartial<CombatantDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base Combatant model definition which defines common behavior of an Combatant document between both client and server.
 */
export declare class BaseCombatant extends Document<
  data.CombatantData,
  InstanceType<ConfiguredDocumentClass<typeof BaseCombat>>,
  CombatantMetadata
> {
  static override get schema(): typeof data.CombatantData;

  static override get metadata(): CombatantMetadata;

  /**
   * Is a user able to update an existing Combatant?
   * @remarks doc seems unused
   */
  protected static _canUpdate(
    user: BaseUser,
    doc: BaseCombatant,
    data: DeepPartial<CombatantDataConstructorData>
  ): boolean;

  /** Is a user able to create this Combatant? */
  protected static _canCreate(user: BaseUser, doc: BaseCombatant, data: CombatantDataSource): boolean;
}
