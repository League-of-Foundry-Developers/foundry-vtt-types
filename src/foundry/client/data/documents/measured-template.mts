// FOUNDRY_VERSION: 10.291

import type BaseMeasuredTemplate from "../../../common/documents/measured-template.mts";

declare global {
  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@link Scene}               The Scene document type which contains MeasuredTemplate embedded documents
   * @see {@link MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(BaseMeasuredTemplate) {
    /**
     * A reference to the User who created the MeasuredTemplate document.
     */
    get author(): User;

    /**
     * Rotation is an alias for direction
     */
    get rotation(): number;
  }
}
