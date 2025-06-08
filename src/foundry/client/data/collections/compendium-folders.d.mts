export {};

declare global {
  /**
   * A Collection of Folder documents within a Compendium pack.
   */
  class CompendiumFolderCollection extends DocumentCollection<"Folder"> {
    constructor(pack: CompendiumPacks, data: Folder.Source[]);

    pack: CompendiumPacks;

    get documentName(): "Folder";

    override render(
      force?: boolean,
      options?: foundry.appv1.api.Application.Options | foundry.applications.api.ApplicationV2.RenderOptions,
    ): void;

    /**
     * @privateRemarks Possible this causes depth issues, this is just a small extension in the code with no meaningful transformations
     */
    // updateAll(
    //   transformation:
    //     | DeepPartial<Folder["_source"]>
    //     | ((doc: foundry.abstract.Folder.Stored) => DeepPartial<Folder["_source"]>),
    //   condition?: ((obj: foundry.abstract.Folder.Stored) => boolean) | null,
    //   options?: foundry.abstract.Document.OnUpdateOptions<"Folder">,
    // ): Promise<Folder.Implementation[]>;
  }
}
