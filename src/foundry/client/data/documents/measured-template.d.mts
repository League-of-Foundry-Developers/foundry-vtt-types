import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace MeasuredTemplateDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"MeasuredTemplate">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations<BlahXXX extends boolean = false>
      extends DocumentDatabaseOperations<MeasuredTemplateDocument, BlahXXX> {}
  }

  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@link Scene}                     The Scene document type which contains MeasuredTemplate documents
   * @see {@link MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    /**
     * Rotation is an alias for direction
     */
    get rotation(): this["direction"];

    /**
     * Is the current User the author of this template?
     */
    get isAuthor(): boolean;
  }
}
