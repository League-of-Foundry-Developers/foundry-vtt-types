export {};

declare global {
  class CompendiumPacks extends DirectoryCollectionMixin(Collection)<CompendiumCollection.Any> {
    /**
     * Get a Collection of Folders which contain Compendium Packs
     */
    get folders(): Collection<Folder.Stored>;

    protected override _getVisibleTreeContents(): CompendiumCollection.Any[];

    protected static _sortAlphabetical(
      a: CompendiumPacks.AlphabeticalSortEntry,
      b: CompendiumPacks.AlphabeticalSortEntry,
    ): number;
  }

  namespace CompendiumPacks {
    interface AlphabeticalSortEntry extends DirectoryCollectionMixin.AlphabeticalSortEntry {
      metadata?: {
        label: string;
      };
    }
  }
}
