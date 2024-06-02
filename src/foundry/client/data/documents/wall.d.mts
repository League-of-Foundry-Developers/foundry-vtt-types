import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";

export {};

declare global {
  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}

  namespace WallDocument {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"Wall">>;
  }
}
