// TODO
declare global {
  /**
   * The client-side Scene document which extends the common BaseScene abstraction.
   * Each Scene document contains SceneData which defines its data schema.
   *
   * @see {@link data.SceneData}              The Scene data schema
   * @see {@link documents.Scenes}            The world-level collection of Scene documents
   * @see {@link applications.SceneConfig}    The Scene configuration application
   *
   * @param data - Initial data provided to construct the Scene document
   */
  class Scene extends ClientDocumentMixin(foundry.documents.BaseScene) {}
}

export {};
