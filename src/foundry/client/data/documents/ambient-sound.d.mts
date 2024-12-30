import type Document from "../../../common/abstract/document.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";
import type BaseAmbientSound from "../../../common/documents/ambient-sound.d.mts";

declare global {
  namespace AmbientSoundDocument {
    type Metadata = Document.MetadataFor<AmbientSoundDocument>;

    type ConfiguredClass = Document.ConfiguredClassForName<"AmbientSound">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"AmbientSound">;

    interface DatabaseOperations extends DocumentDatabaseOperations<AmbientSoundDocument> {}

    // Helpful aliases
    type ConstructorData = BaseAmbientSound.ConstructorData;
    type UpdateData = BaseAmbientSound.UpdateData;
    type Schema = BaseAmbientSound.Schema;
    type Source = BaseAmbientSound.Source;
  }

  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {
    static override metadata: AmbientSoundDocument.Metadata;

    static get implementation(): AmbientSoundDocument.ConfiguredClass;
  }
}
