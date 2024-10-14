import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace AmbientLightDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientLight">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"AmbientLight">;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    export interface DatabaseOperations
      extends DocumentDatabaseOperations<AmbientLightDocument, {}, { animate: boolean }, {}> {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */
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
     * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;
  }
}
