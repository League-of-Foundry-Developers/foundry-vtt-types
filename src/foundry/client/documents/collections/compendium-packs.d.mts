import type { DirectoryCollectionMixin } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

declare class CompendiumPacks extends DirectoryCollectionMixin(Collection)<CompendiumCollection.Any> {
  /**
   * The Collection class name
   */
  get name(): string;

  /**
   * Get a Collection of Folders which contain Compendium Packs
   */
  get folders(): Collection<Folder.Stored>;

  protected override _getVisibleTreeContents(): this["contents"];

  protected static override _sortAlphabetical(
    a: CompendiumPacks.AlphabeticalSortEntry,
    b: CompendiumPacks.AlphabeticalSortEntry,
  ): number;
}

declare namespace CompendiumPacks {
  // No `Implementation`/`ImplementationClass`, as the `Game` constructor names the class directly, there's no `CONFIG` property.

  interface AlphabeticalSortEntry extends DirectoryCollectionMixin.AlphabeticalSortEntry {
    metadata?: {
      label: string;
    };
  }
}

export default CompendiumPacks;
