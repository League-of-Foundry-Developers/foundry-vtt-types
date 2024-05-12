import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { DeepPartial, Merge } from "../../../types/utils.d.mts";
import type { Context, DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { WallDataConstructorData } from "../data/data.mjs/wallData.d.mts";
import type { BaseScene } from "./scene.d.mts";
import type { BaseUser } from "./user.d.mts";

type WallMetadata = Merge<
  DocumentMetadata,
  {
    name: "Wall";
    collection: "walls";
    label: "DOCUMENT.Wall";
    labelPlural: "DOCUMENT.Walls";
    isEmbedded: true;
    permissions: {
      update: (user: BaseUser, doc: BaseWall, data: DeepPartial<WallDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base Wall model definition which defines common behavior of an Wall document between both client and server.
 */
export declare class BaseWall extends Document<data.WallData, InstanceType<ConfiguredDocumentClass<typeof BaseScene>>> {
  /**
   * @remarks This is not overridden in foundry but reflects the real behavior.
   */
  constructor(
    data: WallDataConstructorData,
    context?: Context<InstanceType<ConfiguredDocumentClass<typeof BaseScene>>>,
  );

  static override get schema(): typeof data.WallData;

  static override get metadata(): WallMetadata;

  /**
   * Is a user able to update an existing Wall?
   */
  protected static _canUpdate(user: BaseUser, doc: BaseWall, data: DeepPartial<WallDataConstructorData>): boolean;
}
