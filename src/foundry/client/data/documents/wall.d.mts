import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace WallDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Wall">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations<BlahXXX extends boolean = false> {
      create: DatabaseCreateOperation<WallDocument, BlahXXX>;
      update: DatabaseUpdateOperation<WallDocument>;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side Wall document which extends the common BaseWall model.
   *
   * @see {@link Scene}            The Scene document type which contains Wall embedded documents
   * @see {@link WallConfig}       The Wall configuration application
   */
  class WallDocument extends CanvasDocumentMixin(foundry.documents.BaseWall) {}
}
