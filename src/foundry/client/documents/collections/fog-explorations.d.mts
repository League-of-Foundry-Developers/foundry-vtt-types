import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of FogExploration documents which exist within the active World.
 * @see {@linkcode foundry.documents.FogExploration} The FogExploration document
 */
declare class FogExplorations extends WorldCollection<"FogExploration", "FogExplorations"> {
  static override documentName: "FogExploration";

  /**
   * Activate Socket event listeners to handle for fog resets
   * @param socket - The active web socket connection
   */
  static _activateSocketListeners(socket: foundry.Game["socket"]): void;
}

declare namespace FogExplorations {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFogExplorations {}
    interface AnyConstructor extends Identity<typeof AnyFogExplorations> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"FogExploration"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"FogExploration"> {}

  /** @deprecated Replaced by {@linkcode FogExplorations.ImplementationClass}. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode FogExplorations.Implementation}. */
  type Configured = Implementation;
}

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(...args: never);
}

export default FogExplorations;
