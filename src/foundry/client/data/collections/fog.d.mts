import type { Identity } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of FogExploration documents which exist within the active World.
   * @see {@link FogExploration | `FogExploration`} The FogExploration document
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
    interface Any extends AnyFogExplorations {}
    interface AnyConstructor extends Identity<typeof AnyFogExplorations> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"FogExploration"> {}
    interface Configured extends Document.ConfiguredCollection<"FogExploration"> {}
  }
}

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(...args: never);
}
