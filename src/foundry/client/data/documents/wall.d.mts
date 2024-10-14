import type {
  ConfiguredDocumentClassForName,
  ConfiguredDocumentInstanceForName,
} from "../../../../types/helperTypes.d.mts";

declare global {
  namespace WallDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Wall">;
    type ConfiguredInstance = ConfiguredDocumentInstanceForName<"Wall">;
  }

  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}
}
