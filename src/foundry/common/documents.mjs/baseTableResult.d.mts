import type { ConfiguredDocumentClass } from "../../../types/helperTypes.d.mts";
import type { DeepPartial, Merge } from "../../../types/utils.d.mts";
import type { DocumentMetadata } from "../abstract/document.d.mts";
import type { Document } from "../abstract/module.d.mts";
import type { TableResultDataConstructorData } from "../data/data.mjs/tableResultData.d.mts";
import type { BaseRollTable } from "./baseRollTable.d.mts";
import type { BaseUser } from "./baseUser.d.mts";

type TableResultMetadata = Merge<
  DocumentMetadata,
  {
    name: "TableResult";
    collection: "results";
    label: "DOCUMENT.TableResult";
    labelPlural: "DOCUMENT.TableResults";
    types: [
      `${typeof CONST.TABLE_RESULT_TYPES.TEXT}`,
      `${typeof CONST.TABLE_RESULT_TYPES.DOCUMENT}`,
      `${typeof CONST.TABLE_RESULT_TYPES.COMPENDIUM}`,
    ];
    permissions: {
      update: (user: BaseUser, doc: BaseTableResult, data: DeepPartial<TableResultDataConstructorData>) => boolean;
    };
  }
>;

/**
 * The base TableResult model definition which defines common behavior of an TableResult document between both client and server.
 */
export declare class BaseTableResult extends Document<
  foundry.data.TableResultData,
  InstanceType<ConfiguredDocumentClass<typeof BaseRollTable>>,
  TableResultMetadata
> {
  static override get schema(): typeof foundry.data.TableResultData;

  static override get metadata(): TableResultMetadata;

  /**
   * Is a user able to update an existing TableResult?
   */
  protected static _canUpdate(
    user: BaseUser,
    doc: BaseTableResult,
    data: DeepPartial<TableResultDataConstructorData>,
  ): boolean;

  override testUserPermission(
    user: BaseUser,
    permission: keyof typeof foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS | foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS,
    { exact }?: { exact?: boolean },
  ): boolean;
}
