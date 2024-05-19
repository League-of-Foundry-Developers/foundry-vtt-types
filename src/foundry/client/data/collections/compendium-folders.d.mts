declare global {
  class CompendiumFolderCollection extends DocumentCollection<typeof Folder, "Folders"> {
    constructor(pack: CompendiumPacks, data: Folder["_source"][]);

    pack: CompendiumPacks;

    get documentName(): "Folder";

    override render(force?: boolean | undefined, options?: ApplicationOptions | undefined): void;
  }
}

export {};
