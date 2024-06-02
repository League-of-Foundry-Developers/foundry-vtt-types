import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

export {};

declare global {
  /**
   * The client-side AmbientSound document which extends the common BaseAmbientSound document model.
   *
   * @see {@link Scene}                   The Scene document type which contains AmbientSound documents
   * @see {@link AmbientSoundConfig}      The AmbientSound configuration application
   */
  class AmbientSoundDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientSound) {}

  namespace AmbientSoundDocument {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"AmbientSound">>;
  }
}
