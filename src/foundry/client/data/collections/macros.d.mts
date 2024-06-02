export {};

declare global {
  /**
   * The singleton collection of Macro documents which exist within the active World.
   * This Collection is accessible within the Game object as game.macros.
   *
   * @see {@link Macro} The Macro document
   * @see {@link MacroDirectory} The MacroDirectory sidebar directory
   */
  class Macros extends WorldCollection<typeof foundry.documents.BaseMacro, "Macros"> {
    static documentName: "Macro";

    override get directory(): typeof ui.macros;

    override fromCompendium(
      document: Macro.ConfiguredInstance | foundry.documents.BaseMacro.ConstructorData,
      options?: WorldCollection.FromCompendiumOptions | undefined,
    ): Omit<Macro.ConfiguredInstance, "_id" | "folder">;
  }
}
