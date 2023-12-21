import type { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type { FogExplorationDataConstructorData } from "../data/data.mjs/fogExplorationData.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { BaseUser } from "./baseUser.mts";

type FogExplorationMetadata = Merge<
  DocumentMetadata,
  {
    name: "FogExploration";
    collection: "fog";
    label: "DOCUMENT.FogExploration";
    labelPlural: "DOCUMENT.FogExplorations";
    isPrimary: true;
    permissions: {
      create: "PLAYER";
      update: (user: BaseUser, doc: BaseFogExploration) => boolean;
      delete: (user: BaseUser, doc: BaseFogExploration) => boolean;
    };
  }
>;

/**
 * The base FogExploration model definition which defines common behavior of an FogExploration document between both client and server.
 */
export declare class BaseFogExploration extends Document<data.FogExplorationData, null, FogExplorationMetadata> {
  static override get schema(): typeof data.FogExplorationData;

  static override get metadata(): FogExplorationMetadata;

  protected override _preUpdate(
    changed: DeepPartial<FogExplorationDataConstructorData>,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<void>;

  /**
   * Test whether a User can modify a FogExploration document.
   */
  protected static _canUserModify(user: BaseUser, doc: BaseFogExploration): boolean;
}
