import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseAmbientLight from "../../../common/documents/ambient-light.d.mts";

declare global {
  namespace AmbientLightDocument {
    type Metadata = Document.MetadataFor<AmbientLightDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"AmbientLight">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"AmbientLight">;

    /* eslint-disable @typescript-eslint/no-empty-object-type */
    interface DatabaseOperations
      extends DocumentDatabaseOperations<AmbientLightDocument, {}, { animate: boolean }, {}> {}
    /* eslint-enable @typescript-eslint/no-empty-object-type */

    // Helpful aliases
    type ConstructorData = BaseAmbientLight.ConstructorData;
    type UpdateData = BaseAmbientLight.UpdateData;
    type Schema = BaseAmbientLight.Schema;
    type Source = BaseAmbientLight.Source;
  }

  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   *
   * @see {@link Scene}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    static override metadata: AmbientLightDocument.Metadata;

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
