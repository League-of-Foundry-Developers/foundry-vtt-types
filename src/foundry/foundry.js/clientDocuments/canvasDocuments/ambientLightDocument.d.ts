declare global {
  /**
   * The client-side AmbientLight document which extends the common BaseAmbientLight model.
   * Each AmbientLight document contains AmbientLightData which defines its data schema.
   *
   * @see {@link data.AmbientLightData}             The AmbientLight data schema
   * @see {@link documents.Scene}                   The Scene document type which contains AmbientLight embedded documents
   * @see {@link applications.LightConfig}          The AmbientLight configuration application
   */
  class AmbientLightDocument extends CanvasDocumentMixin(foundry.documents.BaseAmbientLight) {
    /**
     * Is this ambient light source global in nature?
     */
    get isGlobal(): boolean;
  }
}

export {};
