import type { FixedInstanceType, Mixin } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

type DirectoryCollectionMixin_DocumentCollection_Static = DirectoryCollection<DirectoryCollectionMixin.DirectoryTypes> &
  DocumentCollection<Document.AnyConstructor, string>;

export interface DirectoryCollectionMixin_DocumentCollection_Interface
  extends DirectoryCollectionMixin_DocumentCollection_Static {
  new <T extends Document.AnyConstructor, Name extends string>(
    ...args: ConstructorParameters<typeof DocumentCollection>
  ): DirectoryCollection<Document.ToConfiguredInstance<T>> & DocumentCollection<Document.ToConfiguredClass<T>, Name>;
}

type DirectoryCollectionMixin_Collection_Static = DirectoryCollection<DirectoryCollectionMixin.DirectoryTypes> &
  Collection<CompendiumCollection<CompendiumCollection.Metadata>>;

export interface DirectoryCollectionMixin_Collection_Interface extends DirectoryCollectionMixin_Collection_Static {
  new (
    ...args: ConstructorParameters<typeof Collection>
  ): DirectoryCollection<CompendiumCollection<CompendiumCollection.Metadata>> &
    Collection<CompendiumCollection<CompendiumCollection.Metadata>>;
}

/**
 * An extension of the Collection class which adds behaviors specific to tree-based collections of entries and folders.
 */
// TODO: T should probably extend a subset of documents | CompendiumCollection
declare class DirectoryCollection<T extends DirectoryCollectionMixin.DirectoryTypes> {
  /** @privateRemarks All mixin classses need a constructor like this */
  constructor(...args: any[]);

  /**
   * Reference the set of Folders which contain documents in this collection
   */
  get folders(): Collection<Folder.Stored>;

  /**
   * The built tree structure of the DocumentCollection
   */
  get tree(): DirectoryCollectionMixin.TreeNode<T>;

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
  protected _getVisibleTreeContents(): T[];

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
  function DirectoryCollectionMixin<
    T extends DirectoryCollectionMixin.DirectoryTypes,
    BaseCollection extends DirectoryCollectionMixin.BaseClass,
  >(BaseCollection: BaseCollection): Mixin<typeof DirectoryCollection<T>, BaseCollection>;

  namespace DirectoryCollectionMixin {
    type AnyMixedConstructor = ReturnType<
      typeof DirectoryCollectionMixin<DirectoryCollectionMixin.DirectoryTypes, DirectoryCollectionMixin.BaseClass>
    >;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = foundry.utils.Collection.AnyConstructor;
    // TODO: Refine type based on CONST.FOLDER_DOCUMENT_TYPES
    type DirectoryTypes = object;

    interface TreeNode<T> {
      children: TreeNode<T>[];
      depth: number;
      entries: T[];
      folder: Folder;
      root: boolean;
      visible: boolean;
    }

    type AlphabeticalSortEntry = { name: string } & object;
    type StandardSortEntry = { sort: number } & object;
  }
}
