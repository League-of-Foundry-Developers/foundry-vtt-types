import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace TableResult {
    type ConfiguredClass = ConfiguredDocumentClassForName<"TableResult">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations<Temporary extends boolean = false> {
      create: DatabaseCreateOperation<TableResult, Temporary>;
      update: DatabaseUpdateOperation<TableResult>;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side TableResult document which extends the common BaseTableResult model.
   *
   * @see {@link RollTable}         The RollTable document which contains TableResult embedded documents
   */
  class TableResult extends ClientDocumentMixin(foundry.documents.BaseTableResult) {
    /**
     * A path reference to the icon image used to represent this result
     */
    get icon(): string;

    /**
     * Prepare a string representation for the result which (if possible) will be a dynamic link or otherwise plain text
     * @returns The text to display
     */
    getChatText(): string;
  }
}
