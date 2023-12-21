import type { DocumentMetadata } from "../abstract/document.mts";
import type { Document } from "../abstract/module.mts";
import type { BaseTableResult } from "./baseTableResult.mts";

type RollTableMetadata = Merge<
  DocumentMetadata,
  {
    name: "RollTable";
    collection: "tables";
    label: "DOCUMENT.RollTable";
    labelPlural: "DOCUMENT.RollTables";
    embedded: {
      TableResult: typeof BaseTableResult;
    };
    isPrimary: true;
  }
>;

/**
 * The base RollTable model definition which defines common behavior of an RollTable document between both client and server.
 */
export declare class BaseRollTable extends Document<foundry.data.RollTableData, null, RollTableMetadata> {
  static override get schema(): typeof foundry.data.RollTableData;

  static override get metadata(): RollTableMetadata;

  /**
   * A reference to the Collection of TableResult instances in this document, indexed by _id.
   */
  get results(): this["data"]["results"];
}
