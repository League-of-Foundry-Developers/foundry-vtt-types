declare global {
  class CompendiumPacks extends DirectoryCollectionMixin(Collection) {
    /**
     * Get a Collection of Folders which contain Compendium Packs
     */
    get folders(): Collection<Folder>;

    protected override _getVisibleTreeContents(): object[];

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

export {};
