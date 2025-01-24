export {};

declare global {
  /**
   * A Collection of Folder documents within a Compendium pack.
   */
  class CompendiumFolderCollection extends DocumentCollection<typeof Folder, "Folders"> {
    constructor(pack: CompendiumPacks, data: Folder["_source"][]);

    pack: CompendiumPacks;

    get documentName(): "Folder";

    override render(force?: boolean, options?: ApplicationOptions): void;

    /**
     * @privateRemarks Possible this causes depth issues, this is just a small extension in the code with no meaningful transformations
     */
    // updateAll(
    //   transformation:
    //     | DeepPartial<Folder["_source"]>
    //     | ((doc: foundry.abstract.Document.Stored<Folder>) => DeepPartial<Folder["_source"]>),
    //   condition?: ((obj: foundry.abstract.Document.Stored<Folder>) => boolean) | null,
    //   options?: foundry.abstract.Document.OnUpdateOptions<"Folder">,
    // ): Promise<Folder.Implementation[]>;
  }
}
