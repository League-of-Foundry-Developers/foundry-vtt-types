import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace AmbientSoundDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientSound">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations {
      create: DatabaseCreateOperation;
      update: DatabaseUpdateOperation;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {}
}
