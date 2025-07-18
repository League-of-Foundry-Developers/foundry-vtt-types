import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

import Game = foundry.Game;

/**
 * The singleton collection of FogExploration documents which exist within the active World.
 * @see {@linkcode FogExploration} The FogExploration document
 */
declare class FogExplorations extends foundry.documents.abstract.WorldCollection<"FogExploration", "FogExplorations"> {
  static documentName: "FogExploration";

  /**
   * Activate Socket event listeners to handle for fog resets
   * @param socket - The active web socket connection
   */
  static _activateSocketListeners(socket: Game["socket"]): void;
}

declare namespace FogExplorations {
  interface Any extends AnyFogExplorations {}
  interface AnyConstructor extends Identity<typeof AnyFogExplorations> {}

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"FogExploration"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"FogExploration"> {}

  /**
   * @deprecated Replaced by {@linkcode FogExplorations.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode FogExplorations.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(...args: never);
}

export default FogExplorations;
