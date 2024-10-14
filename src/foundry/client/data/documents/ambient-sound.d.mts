import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";
import type { DocumentDatabaseOperations } from "../../../common/abstract/document.d.mts";

declare global {
  namespace AmbientSoundDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientSound">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"AmbientSound">;

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface DatabaseOperations extends DocumentDatabaseOperations<AmbientSoundDocument> {}
  }

  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {}
}
