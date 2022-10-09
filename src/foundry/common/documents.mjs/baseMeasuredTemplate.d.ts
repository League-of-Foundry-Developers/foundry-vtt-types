import { ConfiguredDocumentClass } from "../../../types/helperTypes";
import * as data from "../data/data.mjs";
import { DocumentMetadata } from "../abstract/document.mjs";
import { Document } from "../abstract/module.mjs";
import { BaseScene } from "./baseScene";
import { BaseUser } from "./baseUser";
import type { MeasuredTemplateDataConstructorData } from "../data/data.mjs/measuredTemplateData";

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
        data: DeepPartial<MeasuredTemplateDataConstructorData> | {}
      ) => boolean;
      delete: (
        user: BaseUser,
        doc: BaseMeasuredTemplate,
        data: DeepPartial<MeasuredTemplateDataConstructorData> | {}
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
    { exact }?: { exact?: boolean }
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
    data: DeepPartial<MeasuredTemplateDataConstructorData> | {}
  ): boolean;
}
