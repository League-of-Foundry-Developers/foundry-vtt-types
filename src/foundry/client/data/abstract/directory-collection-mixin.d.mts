import type { FixedInstanceType, Mixin } from "fvtt-types/utils";

/**
 * An extension of the Collection class which adds behaviors specific to tree-based collections of entries and folders.
 */
declare class DirectoryCollection {
  /** @privateRemarks All mixin classses need a constructor like this */
  constructor(...args: any[]);

  // Note(LukeAbby): This isn't really a property on this class but rather it exists on `Collection`.
  // However since this is only used when merged with a Collection class, it's fine to define it here.
  contents: readonly unknown[];

  /**
   * Reference the set of Folders which contain documents in this collection
   */
  get folders(): Collection<Folder.Stored, Collection.Methods.Any>;

  /**
   * The built tree structure of the DocumentCollection
   */
  get tree(): DirectoryCollectionMixin.TreeNode<this["contents"]>;

  /**
   * The current search mode for this collection
   */
  get searchMode(): foundry.CONST.DIRECTORY_SEARCH_MODES;

  /**
   * Toggle the search mode for this collection between "name" and "full" text search
   */
  toggleSearchMode(): void;

  /**
   * The current sort mode used to order the top level entries in this collection
   */
  // TODO: Should have a helper type for these sorting modes or something
  get sortingMode(): "m" | "a";

  /**
   * Toggle the sorting mode for this collection between "a" (Alphabetical) and "m" (Manual by sort property)
   */
  toggleSortingMode(): void;

  /**
   * The maximum depth of folder nesting which is allowed in this collection
   * @defaultValue `CONST.FOLDER_MAX_DEPTH`
   */
  get maxFolderDepth(): number;

  /**
   * Return a reference to list of entries which are visible to the User in this tree
   */
  protected _getVisibleTreeContents(): this["contents"];

  /**
   * Initialize the tree by categorizing folders and entries into a hierarchical tree structure.
   */
  initializeTree(): void;

  /**
   * Creates the list of Folder options in this Collection in hierarchical order
   * for populating the options of a select tag.
   */
  protected _formatFolderSelectOptions(): { id: string; name: string }[];

  /**
   * Sort two Entries by name, alphabetically.
   * @param a - Some Entry
   * @param b - Some other Entry
   * @returns The sort order between entries a and b
   */
  protected static _sortAlphabetical(
    a: DirectoryCollectionMixin.AlphabeticalSortEntry,
    b: DirectoryCollectionMixin.AlphabeticalSortEntry,
  ): number;

  /**
   * Sort two Entries using their numeric sort fields.
   * @param a - Some Entry
   * @param b - Some other Entry
   * @returns The sort order between Entries a and b
   */
  protected static _sortStandard(
    a: DirectoryCollectionMixin.StandardSortEntry,
    b: DirectoryCollectionMixin.StandardSortEntry,
  ): number;
}

declare global {
  /**
   * A mixin which adds directory functionality to a DocumentCollection, such as folders, tree structures, and sorting.
   * @param BaseCollection - The base collection class to extend
   * @returns A Collection mixed with DirectoryCollection functionality
   */
  function DirectoryCollectionMixin<BaseCollection extends foundry.utils.Collection.AnyConstructor>(
    BaseCollection: BaseCollection,
  ): Mixin<typeof DirectoryCollection, BaseCollection>;

  namespace DirectoryCollectionMixin {
    interface AnyMixedConstructor
      extends ReturnType<typeof DirectoryCollectionMixin<foundry.utils.Collection.AnyConstructor>> {}
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = foundry.utils.Collection.AnyConstructor;

    interface TreeNode<T> {
      children: TreeNode<T>[];
      depth: number;
      entries: T[];
      folder: Folder.Implementation;
      root: boolean;
      visible: boolean;
    }

    type AlphabeticalSortEntry = { name: string } & object;
    type StandardSortEntry = { sort: number } & object;
  }
}
