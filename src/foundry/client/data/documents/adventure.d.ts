/**
 * The client-side Adventure document which extends the common {@link foundry.documents.BaseAdventure} model.
 */
declare global {
  class Adventure extends ClientDocumentMixin(foundry.documents.BaseAdventure) {}
}

export {};
