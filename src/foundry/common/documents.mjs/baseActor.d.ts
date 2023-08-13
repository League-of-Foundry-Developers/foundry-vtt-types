import { ConfiguredDocumentClass, DocumentSubTypes } from "../../../types/helperTypes";
import { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import type { DEFAULT_TOKEN } from "../constants.mjs.js";
import * as data from "../data/data.mjs";
import type { ActorDataConstructorData, ActorDataSchema, ActorDataSource } from "../data/data.mjs/actorData";
import { BaseActiveEffect } from "./baseActiveEffect";
import { BaseItem } from "./baseItem";
import { BaseToken } from "./baseToken";
import { BaseUser } from "./baseUser";

type ActorMetadata = Merge<
  DocumentMetadata,
  {
    name: "Actor";
    collection: "actors";
    indexed: true;
    compendiumIndexFields: ["_id", "name", "img", "type", "sort"];
    embedded: {
      ActiveEffect: typeof BaseActiveEffect;
      Item: typeof BaseItem;
    };
    label: "DOCUMENT.Actor";
    labelPlural: "DOCUMENT.Actors";
    isPrimary: true;
    hasSystemData: true;
    permissions: {
      create: "ACTOR_CREATE";
      update: "ACTOR_UPDATE";
    };
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
  /**
   * @param data    - Initial data provided to construct the Actor document (default: `{}`)
   * @param context - The document context, see {@link foundry.abstract.Document} (default: `{}`)
   */
  constructor(data?: ActorDataConstructorData, context?: DocumentConstructionContext);

  static readonly metadata: Readonly<ActorMetadata>;

  // FIXME: removed once ancestor classes are updated for v10
  // @ts-expect-error an override, once ancestor classes are updated for v10
  static override defineSchema(): ActorDataSchema;

  /**
   * The default icon used for newly created Actor documents.
   * @defaultValue {@link CONST.DEFAULT_TOKEN}
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Actor types which may exist.
   */
  static get TYPES(): DocumentSubTypes<"Actor">[];

  protected _initializeSource(data: ActorDataConstructorData): ActorDataSource;

  static canUserCreate(user: BaseUser): ReturnType<BaseUser["hasPermission"]>;

  static #canCreate(user: User, doc: Actor): ReturnType<User["hasPermission"]>;

  static #canUpdate(user: User, doc: Actor, data: DeepPartial<Actor["toObject"]>);

  protected override _preCreate(
    data: ActorDataConstructorData,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  protected override _preUpdate(
    changed: DeepPartial<ActorDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser
  ): Promise<void>;

  static migrateData(data: object): ActorDataSource;

  static shimData(data: ActorDataSource): object;
}
