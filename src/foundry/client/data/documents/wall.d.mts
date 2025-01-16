import type Document from "../../../common/abstract/document.d.mts";
import type BaseWall from "../../../common/documents/wall.d.mts";

declare global {
  namespace WallDocument {
    type Metadata = Document.MetadataFor<"Wall">;

    type A = WallDocument extends { readonly documentName: infer Name extends Document.Type } ? Name : never;

    type ConfiguredClass = Document.ConfiguredClassForName<"Wall">;
    type ConfiguredInstance = Document.ConfiguredInstanceForName<"Wall">;

    interface DatabaseOperations extends Document.Database.Operations<WallDocument> {}

    // Helpful aliases
    type ConstructorData = BaseWall.ConstructorData;
    type UpdateData = BaseWall.UpdateData;
    type Schema = BaseWall.Schema;
    type Source = BaseWall.Source;
  }

  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {
    static override metadata: WallDocument.Metadata;

    static get implementation(): WallDocument.ConfiguredClass;
  }
}
