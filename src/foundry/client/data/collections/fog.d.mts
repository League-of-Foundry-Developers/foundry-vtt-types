import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

import Game = foundry.Game;

declare global {
  /**
   * The singleton collection of FogExploration documents which exist within the active World.
   * @see {@linkcode FogExploration} The FogExploration document
   */
  class FogExplorations extends WorldCollection<"FogExploration", "FogExplorations"> {
    static documentName: "FogExploration";

    /**
     * Activate Socket event listeners to handle for fog resets
     * @param socket - The active web socket connection
     */
    static _activateSocketListeners(socket: Game["socket"]): void;
  }

  namespace FogExplorations {
    interface Any extends AnyFogExplorations {}
    interface AnyConstructor extends Identity<typeof AnyFogExplorations> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"FogExploration"> {}
    interface Configured extends Document.ConfiguredCollection<"FogExploration"> {}
  }
}

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(...args: never);
}
