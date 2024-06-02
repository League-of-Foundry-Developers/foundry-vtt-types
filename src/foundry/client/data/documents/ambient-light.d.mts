import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes.d.mts";
import type { DeepPartial } from "../../../../types/utils.d.mts";
import type { DocumentModificationOptions } from "../../../common/abstract/document.d.mts";
import type { SchemaField } from "../../../common/data/fields.d.mts";

export {};

declare global {
  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   *
   * @see {@link Scene}                     The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}        The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    protected _onUpdate(
      changed: DeepPartial<AmbientLightDocument["_source"]>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;
    protected _onUpdate(
      changed: DeepPartial<Readonly<SchemaField.InnerPersistedType<any>>>,
      options: DocumentModificationOptions,
      userId: string,
    ): void;

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;
  }

  namespace AmbientLightDocument {
    type ConfiguredInstance = InstanceType<ConfiguredDocumentClassForName<"AmbientLight">>;
  }
}
