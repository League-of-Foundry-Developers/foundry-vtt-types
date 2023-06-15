import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import type { fields } from "../../../common/data/module.mjs";

declare global {
  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight document model.
   *
   * @see {@link Scene}                 The Scene document type which contains AmbientLight documents
   * @see {@link AmbientLightConfig}    The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    /**
     * {@inheritdoc}
     * @internal
     */
    _onUpdate(
      changed: DeepPartial<fields.SchemaField.PersistedType<fields.SchemaField.AnyWithFlags["fields"], {}>>,
      options: DocumentModificationOptions,
      userId: string
    ): foundry.documents.BaseAmbientLight["_onUpdate"];

    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;
  }
}

export {};
