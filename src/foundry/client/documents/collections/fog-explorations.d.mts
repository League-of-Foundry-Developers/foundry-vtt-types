import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of FogExploration documents which exist within the active World.
 * @see {@linkcode foundry.document.FogExploration} The FogExploration document
 */
declare class FogExplorations extends foundry.documents.abstract.WorldCollection<"FogExploration"> {
  static override documentName: "FogExploration";

  /** @privateRemarks Fake type override */
  static override get instance(): FogExplorations.Implementation;

  /**
   * Activate Socket event listeners to handle for fog resets
   * @param socket - The active web socket connection
   */
  static _activateSocketListeners(socket: io.Socket): void;
}

declare namespace FogExplorations {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode FogExplorations.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode FogExplorations.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFogExplorations {}
    interface AnyConstructor extends Identity<typeof AnyFogExplorations> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"FogExploration"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"FogExploration"> {}

  /** @deprecated Replaced by {@linkcode FogExplorations.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode FogExplorations.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default FogExplorations;

declare abstract class AnyFogExplorations extends FogExplorations {
  constructor(...args: never);
}
