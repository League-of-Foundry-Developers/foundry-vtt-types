import type { ConfiguredDocumentClass } from "../../../types/helperTypes.mts";
import type { DeepPartial, Merge } from "../../../types/utils.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type * as data from "../data/data.mjs/index.mts";
import type { MeasuredTemplateDataConstructorData } from "../data/data.mjs/measuredTemplateData.mts";
import type { BaseScene } from "./baseScene.mts";
import type { BaseUser } from "./baseUser.mts";

type MeasuredTemplateMetadata = Merge<
  DocumentMetadata,
  {
    name: "MeasuredTemplate";
    collection: "templates";
    label: "DOCUMENT.MeasuredTemplate";
    labelPlural: "DOCUMENT.MeasuredTemplates";
    isEmbedded: true;
    permissions: {
      create: (user: BaseUser, doc: BaseMeasuredTemplate) => boolean;
      update: (
        user: BaseUser,
        doc: BaseMeasuredTemplate,
        data: DeepPartial<MeasuredTemplateDataConstructorData> | {},
      ) => boolean;
      delete: (
        user: BaseUser,
        doc: BaseMeasuredTemplate,
        data: DeepPartial<MeasuredTemplateDataConstructorData> | {},
      ) => boolean;
    };
  }
>;

/**
 * The base MeasuredTemplate model definition which defines common behavior of an MeasuredTemplate document between both client and server.
 */
export declare class BaseMeasuredTemplate extends Document<
  data.MeasuredTemplateData,
  InstanceType<ConfiguredDocumentClass<typeof BaseScene>>,
  MeasuredTemplateMetadata
> {
  static override get schema(): typeof data.MeasuredTemplateData;

  static override get metadata(): MeasuredTemplateMetadata;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean },
  ): boolean;

  /**
   * Is a user able to create a new MeasuredTemplate?
   * @param user - The user attempting the creation operation.
   * @param doc  - The MeasuredTemplate being created.
   */
  protected static _canCreate(user: BaseUser, doc: BaseMeasuredTemplate): boolean;

  /**
   * Is a user able to modify an existing MeasuredTemplate?
   */
  protected static _canModify(
    user: BaseUser,
    doc: BaseMeasuredTemplate,
    data: DeepPartial<MeasuredTemplateDataConstructorData> | {},
  ): boolean;
}
