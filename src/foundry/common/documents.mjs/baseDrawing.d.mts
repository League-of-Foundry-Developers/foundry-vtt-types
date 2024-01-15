import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type * as data from "../data/data.mjs/index.d.mts";
import type { CONST } from "../module.d.mts";
import type { BaseScene } from "./baseScene.d.mts";
import type { BaseUser } from "./baseUser.d.mts";

type DrawingMetadata = Merge<
  DocumentMetadata,
  {
    name: "Drawing";
    collection: "drawings";
    label: "DOCUMENT.Drawing";
    labelPlural: "DOCUMENT.Drawings";
    isEmbedded: true;
    types: [
      typeof CONST.DRAWING_TYPES.RECTANGLE,
      typeof CONST.DRAWING_TYPES.ELLIPSE,
      typeof CONST.DRAWING_TYPES.TEXT,
      typeof CONST.DRAWING_TYPES.POLYGON,
      typeof CONST.DRAWING_TYPES.FREEHAND,
    ];
    permissions: {
      create: "DRAWING_CREATE";
      update: (user: BaseUser, doc: BaseDrawing, data?: object) => boolean;
      delete: (user: BaseUser, doc: BaseDrawing, data?: object) => boolean;
    };
  }
>;

/**
 * The base Drawing model definition which defines common behavior of an Drawing document between both client and server.
 */
export declare class BaseDrawing extends Document<
  data.DrawingData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  DrawingMetadata
> {
  static override get schema(): typeof data.DrawingData;

  static override get metadata(): DrawingMetadata;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean },
  ): boolean;

  /**
   * Is a user able to update or delete an existing Drawing document??
   */
  protected static _canModify(user: BaseUser, doc: BaseDrawing, data?: object): boolean;
}
