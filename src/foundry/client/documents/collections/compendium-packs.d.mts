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
  get folders(): Collection<Folder.Stored<"Compendium">>;

  /** @remarks Filters packs by {@linkcode CompendiumCollection.visible | #visible} */
  protected override _getVisibleTreeContents(): this["contents"];

  protected static override _sortAlphabetical<
    Sortable extends DirectoryCollectionMixin.AlphabeticalSortEntry | CompendiumPacks.AlphabeticalSortEntry,
  >(a: Sortable, b: Sortable): number;
}

declare namespace CompendiumPacks {
  // No `Any`s/`Implementation`s as there's no generics, the `Game` constructor names the class directly, and there's no `CONFIG` property.

  /**
   * This does not extend {@linkcode DirectoryCollectionMixin.AlphabeticalSortEntry}, as the objects passed to
   * {@linkcode CompendiumPacks._sortAlphabetical} need to both be of one type or the other.
   */
  interface AlphabeticalSortEntry {
    metadata: {
      label: string;
    };
  }
}

export default CompendiumPacks;
