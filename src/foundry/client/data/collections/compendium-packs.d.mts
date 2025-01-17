export {};

declare global {
  class CompendiumPacks extends DirectoryCollectionMixin(Collection)<
    CompendiumCollection<CompendiumCollection.Metadata>
  > {
    /**
     * Get a Collection of Folders which contain Compendium Packs
     */
    get folders(): Collection<Folder.Stored>;

    protected override _getVisibleTreeContents(): CompendiumCollection<CompendiumCollection.Metadata>[];

    protected static _sortAlphabetical(
      a: CompendiumPacks.AlphabeticalSortEntry,
      b: CompendiumPacks.AlphabeticalSortEntry,
    ): number;
  }

  namespace CompendiumPacks {
    interface AlphabeticalSortEntry extends DirectoryCollection.AlphabeticalSortEntry {
      metadata?: {
        label: string;
      };
    }
  }
}
