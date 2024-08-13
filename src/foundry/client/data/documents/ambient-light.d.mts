import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../common/abstract/_types.d.mts";

declare global {
  namespace AmbientLightDocument {
    type ConfiguredClass = ConfiguredDocumentClassForName<"AmbientLight">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    export interface DatabaseOperations<BlahXXX extends boolean = false> {
      create: DatabaseCreateOperation<AmbientLightDocument, BlahXXX>;
      update: DatabaseUpdateOperation<AmbientLightDocument> & InexactPartial<{ animate?: boolean }>;
      delete: DatabaseDeleteOperation;
    }
  }

  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   *
   * @see {@link Scene}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
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
