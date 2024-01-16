import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { ConstructorOf, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type { ActiveEffectDataConstructorData } from "../data/data.mjs/activeEffectData.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { BaseActor } from "./baseActor.d.mts";
import type { BaseItem } from "./baseItem.d.mts";
import type { BaseUser } from "./baseUser.d.mts";

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
 * The base ActiveEffect model definition which defines common behavior of an ActiveEffect document between both client and server.
 */
export declare class BaseActiveEffect extends Document<
  data.ActiveEffectData,
  InstanceType<ConfiguredDocumentClass<typeof BaseActor>> | InstanceType<ConfiguredDocumentClass<typeof BaseItem>>,
  ActiveEffectMetadata
> {
  static override get schema(): ConstructorOf<data.ActiveEffectData>;

  static override get metadata(): ActiveEffectMetadata;

  protected override _preCreate(
    data: ActiveEffectDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<void>;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean },
  ): boolean;
}
