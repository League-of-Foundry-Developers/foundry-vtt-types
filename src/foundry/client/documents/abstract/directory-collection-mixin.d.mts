import type { FixedInstanceType, Mixin } from "#utils";

/**
 * An extension of the Collection class which adds behaviors specific to tree-based collections of entries and folders.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class DirectoryCollection {
  /** @privateRemarks All mixin classes need a constructor like this */
  constructor(...args: any[]);

  // Note(LukeAbby): This isn't really a property on this class but rather it exists on `Collection`.
  // However since this is only used when merged with a Collection class, it's fine to define it here.
  contents: unknown;

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

  // Note(LukeAbby): This override has been commented out because it was being added as an overload
  // with `DocumentCollection` and causing problems. The main solution would be to use `this` but
  // that's awkward. This method really only makes sense on `DocumentCollection` subclasses as well.

  // protected _onModifyContents<A extends DatabaseAction>(
  //   action: A,
  //   documents: readonly Document.AnyStored[],
  //   result: readonly AnyObject[] | readonly string[],
  //   operation: DatabaseOperationMap[A],
  //   user: User.Implementation,
  // ): void;
}

/**
 * A mixin which adds directory functionality to a DocumentCollection, such as folders, tree structures, and sorting.
 * @param BaseCollection - The base collection class to extend
 * @returns A Collection mixed with DirectoryCollection functionality
 */
declare function DirectoryCollectionMixin<BaseCollection extends foundry.utils.Collection.AnyConstructor>(
  BaseCollection: BaseCollection,
): Mixin<typeof DirectoryCollection, BaseCollection>;

declare namespace DirectoryCollectionMixin {
  interface AnyMixedConstructor extends ReturnType<
    typeof DirectoryCollectionMixin<foundry.utils.Collection.AnyConstructor>
  > {}
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

export default DirectoryCollectionMixin;
