import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseTableResult from "../../../common/documents/table-result.d.mts";

declare global {
  namespace TableResult {
    type ConfiguredClass = Document.ConfiguredClassForName<"TableResult">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"TableResult">;

    interface DatabaseOperations extends DocumentDatabaseOperations<TableResult> {}

    // Helpful aliases
    type TypeNames = BaseTableResult.TypeNames;
    type ConstructorData = BaseTableResult.ConstructorData;
    type UpdateData = BaseTableResult.UpdateData;
    type Schema = BaseTableResult.Schema;
    type Source = BaseTableResult.Source;
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
