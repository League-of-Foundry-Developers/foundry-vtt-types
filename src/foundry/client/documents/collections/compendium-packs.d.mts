declare class CompendiumPacks extends foundry.documents.abstract.DirectoryCollectionMixin(
  Collection,
)<foundry.documents.collections.CompendiumCollection.Any> {
  /**
   * Get a Collection of Folders which contain Compendium Packs
   */
  get folders(): Collection<Folder.Stored>;

  protected override _getVisibleTreeContents(): foundry.documents.collections.CompendiumCollection.Any[];

  protected static _sortAlphabetical(
    a: CompendiumPacks.AlphabeticalSortEntry,
    b: CompendiumPacks.AlphabeticalSortEntry,
  ): number;
}

declare namespace CompendiumPacks {
  interface AlphabeticalSortEntry extends foundry.documents.abstract.DirectoryCollectionMixin.AlphabeticalSortEntry {
    metadata?: {
      label: string;
    };
  }
}

export default CompendiumPacks;
