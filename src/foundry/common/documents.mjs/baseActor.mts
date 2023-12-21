import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.ts";
import type { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type { ActorDataConstructorData } from "../data/data.mjs/actorData.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseActiveEffect } from "./baseActiveEffect.mts";
import type { BaseItem } from "./baseItem.mts";
import type { BaseToken } from "./baseToken.mts";
import type { BaseUser } from "./baseUser.mts";

type ActorMetadata = Merge<
  DocumentMetadata,
  {
    name: "Actor";
    collection: "actors";
    label: "DOCUMENT.Actor";
    labelPlural: "DOCUMENT.Actors";
    embedded: {
      ActiveEffect: typeof BaseActiveEffect;
      Item: typeof BaseItem;
    };
    isPrimary: true;
    hasSystemData: true;
    permissions: {
      create: "ACTOR_CREATE";
    };
    types: string[];
  }
>;

/**
 * The base Actor model definition which defines common behavior of an Actor document between both client and server.
 */
export declare class BaseActor extends Document<
  data.ActorData,
  InstanceType<ConfiguredDocumentClass<typeof BaseToken>>,
  ActorMetadata
> {
  static override get schema(): typeof data.ActorData;

  static override get metadata(): ActorMetadata;
  /*
   * A reference to the Collection of embedded ActiveEffect instances in the Actor document, indexed by _id.
   */
  get effects(): this["data"]["effects"];

  /**
   * A reference to the Collection of embedded Item instances in the Actor document, indexed by _id.
   */
  get items(): this["data"]["items"];

  /**
   * The sub-type of Actor.
   */
  get type(): data.ActorData["type"];

  protected override _preCreate(
    data: ActorDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<void>;

  protected override _preUpdate(
    changed: DeepPartial<ActorDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<void>;
}
