import type { Identity, InexactPartial } from "fvtt-types/utils";

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

    override fromCompendium<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
    >(
      document: Macro.ConfiguredInstance | foundry.documents.BaseMacro.ConstructorData,
      options?: InexactPartial<WorldCollection.FromCompendiumOptions<FolderOpt, SortOpt, OwnershipOpt, IdOpt>>,
    ): Omit<
      Macro["_source"],
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | (IdOpt extends false ? "_id" : never)
    >;
  }

  namespace Macros {
    interface Any extends AnyMacros {}
    interface AnyConstructor extends Identity<typeof AnyMacros> {}
  }
}

declare abstract class AnyMacros extends Macros {
  constructor(arg0: never, ...args: never[]);
}
