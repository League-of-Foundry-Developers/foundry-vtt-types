import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import type { ActiveEffectDataConstructorData, ActiveEffectDataSchema } from "../data/data.mjs/activeEffectData";
import { BaseActor } from "./baseActor";
import { BaseItem } from "./baseItem";
import { BaseUser } from "./baseUser";

type ActiveEffectMetadata = Merge<
  DocumentMetadata,
  {
    name: "ActiveEffect";
    collection: "effects";
    label: "DOCUMENT.ActiveEffect";
    labelPlural: "DOCUMENT.ActiveEffects";
    isEmbedded: true;
  }
>;

/**
 * The data schema for an ActiveEffect document.
 */
export declare class BaseActiveEffect extends Document<
  data.ActiveEffectData,
  InstanceType<ConfiguredDocumentClass<typeof BaseActor>> | InstanceType<ConfiguredDocumentClass<typeof BaseItem>>,
  ActiveEffectMetadata
> {
  /**
   * @param data    - Initial data from which to construct the ActiveEffect (default `{}`)
   * @param context - Construction context options (default `{}`)
   */
  constructor(data?: ActiveEffectDataConstructorData, context?: DocumentConstructionContext);

  static override readonly metadata: Readonly<ActiveEffectMetadata>;

  static defineSchema(): ActiveEffectDataSchema;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;

  protected override _preCreate(
    data: ActiveEffectDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  static migrateData(data: object): data.ActiveEffectData;
}
