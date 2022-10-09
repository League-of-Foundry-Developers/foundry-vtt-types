import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import * as data from "../data/data.mjs";
import type { ActiveEffectDataConstructorData } from "../data/data.mjs/activeEffectData";
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
    user: BaseUser
  ): Promise<void>;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }: { exact?: boolean }
  ): boolean;
}
