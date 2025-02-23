export {};

declare global {
  /**
   * The singleton collection of Macro documents which exist within the active World.
   * This Collection is accessible within the Game object as game.macros.
   *
   * @see {@link Macro | `Macro`} The Macro document
   * @see {@link MacroDirectory | `MacroDirectory`} The MacroDirectory sidebar directory
   */
  class Macros extends WorldCollection<Macro.ImplementationClass, "Macros"> {
    static documentName: "Macro";

    override get directory(): typeof ui.macros;

    override fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
      document: Macro.Implementation | Macro.CreateData,
      options?: Options,
    ): WorldCollection.FromCompendiumReturnType<Macro.Implementation, Options>;
  }

  namespace Macros {
    type Any = AnyMacros;
    type AnyConstructor = typeof AnyMacros;
  }
}

declare abstract class AnyMacros extends Macros {
  constructor(arg0: never, ...args: never[]);
}
