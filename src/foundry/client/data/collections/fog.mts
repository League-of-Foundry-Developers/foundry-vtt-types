declare global {
  /**
   * The singleton collection of FogExploration documents which exist within the active World.
   * @see {@link FogExploration} The FogExploration document
   */
  class FogExplorations extends WorldCollection<typeof foundry.documents.BaseFogExploration, "FogExplorations"> {
    static documentName: "FogExploration";
  }
}
