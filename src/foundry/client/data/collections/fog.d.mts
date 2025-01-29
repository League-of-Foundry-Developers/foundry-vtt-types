export {};

declare global {
  /**
   * The singleton collection of FogExploration documents which exist within the active World.
   * @see {@link FogExploration} The FogExploration document
   */
  class FogExplorations extends WorldCollection<FogExploration.ImplementationClass, "FogExplorations"> {
    static documentName: "FogExploration";

    /**
     * Activate Socket event listeners to handle for fog resets
     * @param socket - The active web socket connection
     */
    static _activateSocketListeners(socket: Game["socket"]): void;
  }

  namespace FogExplorations {
    type Any = AnyFogExplorations;
    type AnyConstructor = typeof AnyFogExplorations;
  }
}

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(arg0: never, ...args: never[]);
}
