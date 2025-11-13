import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of Macro documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.macros | game.macros}.
 *
 * @see {@linkcode foundry.documents.Macro}: The Macro document
 * @see {@linkcode foundry.applications.sidebar.tabs.MacroDirectory}: The MacroDirectory sidebar directory
 */
declare class Macros extends WorldCollection<"Macro", "Macros"> {
  static override documentName: "Macro";

  /** @privateRemarks Fake type override */
  static override get instance(): Macros.Implementation;

  override get directory(): typeof ui.macros;

  override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
    document: Macro.Implementation | Macro.CreateData,
    options?: Options,
  ): WorldCollection.FromCompendiumReturnType<"Macro", Options>;
}

declare namespace Macros {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Macros.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Macros.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyMacros {}
    interface AnyConstructor extends Identity<typeof AnyMacros> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Macro"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Macro"> {}

  /** @deprecated Replaced by {@linkcode Macros.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Macros.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default Macros;

declare abstract class AnyMacros extends Macros {
  constructor(...args: never);
}
