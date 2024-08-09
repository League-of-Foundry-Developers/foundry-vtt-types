import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

declare global {
  namespace AmbientLightDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientLight">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;
  }

  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   *
   * @see {@link Scene}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    /**
     * @privateRemarks _onUpdate is overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;
  }
}
