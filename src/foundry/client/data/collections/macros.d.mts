import type { Identity } from "#utils";
import type Document from "#common/abstract/document.d.mts";

declare global {
  /**
   * The singleton collection of Macro documents which exist within the active World.
   * This Collection is accessible within the Game object as game.macros.
   *
   * @see {@linkcode Macro} The Macro document
   * @see {@linkcode MacroDirectory} The MacroDirectory sidebar directory
   */
  class Macros extends WorldCollection<"Macro", "Macros"> {
    static documentName: "Macro";

    override get directory(): typeof ui.macros;

    override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
      document: Macro.Implementation | Macro.CreateData,
      options?: Options,
    ): WorldCollection.FromCompendiumReturnType<"Macro", Options>;
  }

  namespace Macros {
    interface Any extends AnyMacros {}
    interface AnyConstructor extends Identity<typeof AnyMacros> {}

    interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Macro"> {}
    interface Configured extends Document.ConfiguredCollection<"Macro"> {}
  }
}

declare abstract class AnyMacros extends Macros {
  constructor(...args: never);
}
