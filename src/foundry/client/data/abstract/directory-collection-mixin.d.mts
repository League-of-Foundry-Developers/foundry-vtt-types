import type { Mixin } from "../../../../types/utils.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

type DocumentCollectionBase = DirectoryCollection<DirectoryCollection.DirectoryTypes> &
  DocumentCollection<Document.AnyConstructor, string>;

export interface MixedDocumentCollectionInterface extends DocumentCollectionBase {
  new <T extends Document.AnyConstructor, Name extends string>(
    ...args: ConstructorParameters<typeof DocumentCollection>
  ): DirectoryCollection<Document.ToConfiguredInstance<T>> & DocumentCollection<Document.ToConfiguredClass<T>, Name>;
}

type CollectionBase = DirectoryCollection<DirectoryCollection.DirectoryTypes> &
  Collection<CompendiumCollection<CompendiumCollection.Metadata>>;

export interface MixedCollectionInterface extends CollectionBase {
  new (
    ...args: ConstructorParameters<typeof Collection>
  ): DirectoryCollection<CompendiumCollection<CompendiumCollection.Metadata>> &
    Collection<CompendiumCollection<CompendiumCollection.Metadata>>;
}

/**
 * An extension of the Collection class which adds behaviors specific to tree-based collections of entries and folders.
 */
// TODO: T should probably extend a subset of documents | CompendiumCollection
declare class DirectoryCollection<T extends DirectoryCollection.DirectoryTypes> {
  /** @privateRemarks All mixin classses need a constructor like this */
  constructor(...args: any[]);

  /**
   * Reference the set of Folders which contain documents in this collection
   */
  get folders(): Collection<Folder>;

  /**
   * The built tree structure of the DocumentCollection
   */
  get tree(): DirectoryCollection.TreeNode<T>;

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
    a: DirectoryCollection.AlphabeticalSortEntry,
    b: DirectoryCollection.AlphabeticalSortEntry,
  ): number;

  /**
   * Sort two Entries using their numeric sort fields.
   * @param a - Some Entry
   * @param b - Some other Entry
   * @returns The sort order between Entries a and b
   */
  protected static _sortStandard(
    a: DirectoryCollection.StandardSortEntry,
    b: DirectoryCollection.StandardSortEntry,
  ): number;
}

declare global {
  /**
   * A mixin which adds directory functionality to a DocumentCollection, such as folders, tree structures, and sorting.
   * @param BaseCollection - The base collection class to extend
   * @returns A Collection mixed with DirectoryCollection functionality
   */
  function DirectoryCollectionMixin<
    T extends DirectoryCollection.DirectoryTypes,
    BaseCollection extends foundry.utils.Collection.AnyConstructor,
  >(BaseCollection: BaseCollection): Mixin<typeof DirectoryCollection<T>, BaseCollection>;

  namespace DirectoryCollection {
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
