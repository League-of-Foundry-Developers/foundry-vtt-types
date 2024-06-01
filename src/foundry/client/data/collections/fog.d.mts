export {};

declare global {
  /**
   * The singleton collection of FogExploration documents which exist within the active World.
   * @see {@link FogExploration} The FogExploration document
   */
  class FogExplorations extends WorldCollection<typeof foundry.documents.BaseFogExploration, "FogExplorations"> {
    static documentName: "FogExploration";

    /**
     * Activate Socket event listeners to handle for fog resets
     * @param socket - The active web socket connection
     */
    static _activateSocketListeners(socket: Game["socket"]): void;
  }
}
