import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

declare global {
  namespace AmbientSoundDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientSound">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;
  }

  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {}
}
