import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

declare global {
  namespace MeasuredTemplateDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"MeasuredTemplate">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;
  }

  /**
   * The client-side MeasuredTemplate document which extends the common BaseMeasuredTemplate document model.
   *
   * @see {@link Scene}                     The Scene document type which contains MeasuredTemplate documents
   * @see {@link MeasuredTemplateConfig}    The MeasuredTemplate configuration application
   */
  class MeasuredTemplateDocument extends CanvasDocumentMixin(foundry.documents.BaseMeasuredTemplate) {
    /**
     * A reference to the User who created the MeasuredTemplate document.
     * @remarks Will return undefined if the user has been deleted
     */
    get author(): User.ConfiguredInstance | undefined;

    /**
     * Rotation is an alias for direction
     */
    get rotation(): this["direction"];
  }
}
