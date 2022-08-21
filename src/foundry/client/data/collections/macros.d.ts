import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * The singleton collection of Macro documents which exist within the active World.
   * This Collection is accessible within the Game object as game.macros.
   *
   * @see {@link Macro} The Macro document
   * @see {@link MacroDirectory} The MacroDirectory sidebar directory
   */
  class Macros extends WorldCollection<typeof foundry.documents.BaseMacro, "Macros"> {
    static override documentName: "Macro";

    override get directory(): typeof ui.macros;

    override fromCompendium(
      document:
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>
        | InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>["data"]["_source"],
      options?: WorldCollection.FromCompendiumOptions | undefined
    ): Omit<
      InstanceType<ConfiguredDocumentClass<typeof foundry.documents.BaseMacro>>["data"]["_source"],
      "_id" | "folder"
    >;
  }
}
