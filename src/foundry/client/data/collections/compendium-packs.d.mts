import type { MixedCollectionInterface } from "../abstract/directory-collection-mixin.d.mts";

declare const MixedCollection: MixedCollectionInterface;

declare global {
  class CompendiumPacks extends MixedCollection {
    /**
     * Get a Collection of Folders which contain Compendium Packs
     */
    get folders(): Collection<Folder>;

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
