export {};

declare global {
  /**
   * The client-side Adventure document which extends the common {@link foundry.documents.BaseAdventure} model.
   */
  class Adventure extends ClientDocumentMixin(foundry.documents.BaseAdventure) {}
}
