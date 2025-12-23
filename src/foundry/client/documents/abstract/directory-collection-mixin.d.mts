import type { AnyObject, FixedInstanceType, InitializedOn, Mixin } from "#utils";
import type { Collection } from "#common/utils/_module.d.mts";
import type { Document } from "#common/abstract/_module.d.mts";

/** @privateRemarks `CompendiumCollection` and `CompendiumPacks` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CompendiumCollection, CompendiumPacks } from "#client/documents/collections/_module.d.mts";

/** @privateRemarks `WorldCollection` only used for links */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * An extension of the Collection class which adds behaviors specific to tree-based collections of entries and folders.
 */
declare class DirectoryCollection {
  /** @privateRemarks All mixin classes need a constructor like this */
  constructor(...args: any[]);

  /**
   * Will be overridden by the mixed {@linkcode Collection} class. Exists to allow references to the `V` type param for the mixed class
   * in this mixin.
   * @internal
   */
  " __fvtt_types_internal_value": unknown;

  /**
   * Reference the set of Folders which contain documents in this collection
   *
   * @remarks Effectively abstract in {@linkcode DirectoryCollection}, the implementation there just throws.
   */
  get folders(): Collection<Folder.Stored, Collection.Methods.Any>;

  /**
   * The built tree structure of the DocumentCollection
   *
   * @remarks Only `undefined` prior to first {@linkcode initializeTree | #initializeTree} call, which happens just before the `"setup"`
   * hook in {@linkcode foundry.Game.initializeTrees | Game#initializeTrees} via {@linkcode foundry.Game.setupGame | Game#setupGame}
   */
  get tree(): DirectoryCollectionMixin.Tree<this>;

  /**
   * The current search mode for this collection
   */
  get searchMode(): CONST.DIRECTORY_SEARCH_MODES;

  /**
   * Toggle the search mode for this collection between "name" and "full" text search
   */
  toggleSearchMode(): void;

  /**
   * The current sort mode used to order the top level entries in this collection
   */
  get sortingMode(): DirectoryCollectionMixin.SortingMode;

  /**
   * Toggle the sorting mode for this collection between "a" (Alphabetical) and "m" (Manual by sort property)
   */
  toggleSortingMode(): void;

  /**
   * The maximum depth of folder nesting which is allowed in this collection
   * @defaultValue {@linkcode CONST.FOLDER_MAX_DEPTH}
   */
  get maxFolderDepth(): number;

  /**
   * Return a reference to list of entries which are visible to the User in this tree
   * @remarks
   * This signature's return type includes `AnyObject[]` to allow
   * {@linkcode CompendiumCollection._getVisibleTreeContents | CompendiumCollection#_getVisibleTreeContents}
   * to return its `index`'s `contents` instead of its own.
   *
   * Any classes *directly* extending this mixin, if they wish to call this method, should provide a minimal override like:
   * ```ts
   * class MyDirectoryCollection extends DirectoryCollectionMixin(Collection) {
   *   protected override _getVisibleTreeContents() {
   *     return this.contents;
   *   }
   * }
   * ```
   * @privateRemarks The three core classes which directly extend this mixin ({@linkcode CompendiumCollection}, {@linkcode CompendiumPacks},
   * and {@linkcode WorldCollection}) all have real overrides to narrow this, so it's only relevant in user subclasses.
   */
  protected _getVisibleTreeContents(): DirectoryCollectionMixin.GetElementType<this>[] | AnyObject[];

  /**
   * Initialize the tree by categorizing folders and entries into a hierarchical tree structure.
   */
  initializeTree(): void;

  /**
   * Creates the list of Folder options in this Collection in hierarchical order
   * for populating the options of a select tag.
   * @remarks This only returns the required properties of {@linkcode Document.DialogFoldersChoices} (`id` and `name`), but subclasses could
   * return more and be valid as this is used as the `choices` for a {@linkcode foundry.applications.handlebars.selectOptions} hbs helper.
   */
  protected _formatFolderSelectOptions(): Document.DialogFoldersChoices[];

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
  // that's awkward. This method really only makes sense on `DocumentCollection` subclasses as well:
  // all it does is call `this.initializeTree()` and then forward all args to super.

  // protected _onModifyContents<A extends DatabaseAction>(
  //   action: A,
  //   documents: readonly Document.AnyStored[],
  //   result: readonly AnyObject[] | readonly string[],
  //   operation: DatabaseOperationMap[A],
  //   user: User.Implementation,
  // ): void;

  #DirectoryCollection: true;
}

/**
 * A mixin which adds directory functionality to a DocumentCollection, such as folders, tree structures, and sorting.
 * @param BaseCollection - The base collection class to extend
 * @returns A Collection mixed with DirectoryCollection functionality
 */
declare function DirectoryCollectionMixin<BaseCollection extends Collection.AnyConstructor>(
  BaseCollection: BaseCollection,
): Mixin<typeof DirectoryCollection, BaseCollection>;

declare namespace DirectoryCollectionMixin {
  interface AnyMixedConstructor extends ReturnType<typeof DirectoryCollectionMixin<Collection.AnyConstructor>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  /**
   * This could be {@linkcode DocumentCollection.AnyConstructor}, except {@linkcode foundry.documents.collections.CompendiumPacks}
   * uses a simple {@linkcode Collection} as its base.
   */
  type BaseClass = Collection.AnyConstructor;

  /** A helper type to prevent exposing the internal property directly to users. */
  type GetElementType<Collection extends DirectoryCollection> = Collection[" __fvtt_types_internal_value"];

  /** These are hardcoded, and really all values that aren't `"a"` are treated as `"m"` */
  type SortingMode = "a" | "m";

  /**
   * {@linkcode DirectoryCollection._formatFolderSelectOptions | DirectoryCollection#_formatFolderSelectOptions} only returns
   * an array of `{id: string, name: string}`s, so only those keys are included here, but that array is used as the choices
   * for a {@linkcode foundry.handlebars.selectOptions | selectOptions} hbs helper, so th
   */
  interface MinimalFolderSelectOption extends Pick<Document.DialogFoldersChoices, "id" | "name"> {}

  type Tree<Collection extends DirectoryCollection> = InitializedOn<
    DirectoryCollectionMixin.TreeNode<DirectoryCollectionMixin.GetElementType<Collection>>,
    "setup"
  >;

  interface TreeNode<T> {
    children: TreeNode<T>[];
    depth: number;
    entries: T[];
    folder: Folder.Stored; // TODO: Folder.Stored<T["documentName"] | "Compendium">, but in a way that doesn't make circularities
    root: boolean;
    visible: boolean;
  }

  /** {@linkcode DirectoryCollection._sortAlphabetical | DirectoryCollection#_sortAlphabetical} only cares about the `name` property */
  interface AlphabeticalSortEntry {
    name: string;
  }

  /** {@linkcode DirectoryCollection._sortStandard | DirectoryCollection#_sortStandard} only cares about the `sort` property */
  interface StandardSortEntry {
    sort: number;
  }
}

export default DirectoryCollectionMixin;
