import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentInstance,
  ConstructorDataType,
  DocumentConstructor,
} from "../../../../types/helperTypes.d.mts";
import type { ConfiguredStoredDocument, DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type { DocumentOnCreateOptions } from "../../../common/abstract/document.d.mts";
import type { DirectoryCollectionMixin_DocumentCollection_Interface } from "./directory-collection-mixin.d.mts";

declare const DirectoryCollectionMixin_DocumentCollection: DirectoryCollectionMixin_DocumentCollection_Interface;

declare global {
  /**
   * A collection of world-level Document objects with a singleton instance per primary Document type.
   * Each primary Document type has an associated subclass of WorldCollection which contains them.
   * @see {@link Game#collections}
   */
  abstract class WorldCollection<
    T extends DocumentConstructor,
    Name extends string,
  > extends DirectoryCollectionMixin_DocumentCollection<T, Name> {
    /**
     * Reference the set of Folders which contain documents in this collection
     */
    get folders(): Collection<Folder>;

    /**
     * Return a reference to the SidebarDirectory application for this WorldCollection.
     * @remarks
     * In the case where `Lowercase<Name>` is not a property of {@link ui}, this actually always returns `undefined`,
     * but {@link RollTables} overrides this, so we need to allow a wider return type.
     */
    get directory(): Lowercase<Name> extends keyof typeof ui
      ? (typeof ui)[Lowercase<Name>]
      :
          | (ConfiguredDocumentClass<T>["metadata"]["name"] extends foundry.CONST.FOLDER_DOCUMENT_TYPES
              ? DocumentDirectory<ConfiguredDocumentClass<T>["metadata"]["name"]>
              : never)
          | SidebarTab
          | undefined
          | null;

    /**
     * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
     */
    static get instance(): WorldCollection<DocumentConstructor, any>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

    protected override _getVisibleTreeContents(): ConfiguredDocumentInstance<T>[];

    /**
     * Import a Document from a Compendium collection, adding it to the current World.
     * @param pack       - The CompendiumCollection instance from which to import
     * @param id         - The ID of the compendium entry to import
     * @param updateData - Optional additional data used to modify the imported Document before it is created
     *                     (default: `{}`)
     * @param options    - Optional arguments passed to the {@link WorldCollection#fromCompendium} and {@link Document.create} methods
     *                     (default: `{}`)
     * @returns The imported Document instance
     */

    /**
     * @privateRemarks We've added everything in WorldCollection.FromCompendiumOptions to DatabaseCreateOperation
     * because they get passed through to Document.create() by this function.  So the
     * union type isn't really needed.  Leaving it because it feels like foundry will pull
     * those back out in the future (and we could miss it because we added them to
     * DatabaseCreateOperation but the foundry typedef doesn't have them).
     */
    importFromCompendium(
      pack: CompendiumCollection<
        CompendiumCollection.Metadata & { type: ConfiguredDocumentClass<T>["metadata"]["name"] }
      >,
      id: string,
      updateData?: DeepPartial<ConfiguredDocumentInstance<T>["_source"]>,
      options?: InexactPartial<DocumentOnCreateOptions<T["metadata"]["name"]> & WorldCollection.FromCompendiumOptions>,
    ): Promise<ConfiguredStoredDocument<T>>;

    /**
     * Apply data transformations when importing a Document from a Compendium pack
     * @param document - The source Document, or a plain data object
     * @param options  - Additional options which modify how the document is imported
     *                   (default: `{}`)
     * @returns The processed data ready for world Document creation
     * @remarks FromCompendiumOptions is inflated to account for expanded downstream use
     */
    fromCompendium<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
    >(
      document: ConfiguredDocumentInstance<T> | ConstructorDataType<T>,
      options?: InexactPartial<WorldCollection.FromCompendiumOptions<FolderOpt, SortOpt, OwnershipOpt, IdOpt>>,
    ): Omit<
      ConfiguredDocumentInstance<T>["_source"],
      | ClientDocument.OmitProperty<FolderOpt, "folder">
      | ClientDocument.OmitProperty<SortOpt, "sort" | "navigation" | "navOrder">
      | ClientDocument.OmitProperty<OwnershipOpt, "ownership">
      | (IdOpt extends false ? "_id" : never)
    >;

    /**
     * Register a Document sheet class as a candidate which can be used to display Documents of a given type.
     * See {@link DocumentSheetConfig.registerSheet} for details.
     * @see DocumentSheetConfig.registerSheet
     *
     * @example <caption>Register a new ActorSheet subclass for use with certain Actor types.</caption>
     * ```typescript
     * Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character], makeDefault: true });
     * ```
     */
    static registerSheet(...args: DropFirst<Parameters<typeof DocumentSheetConfig.registerSheet>>): void;

    /**
     * Unregister a Document sheet class, removing it from the list of available sheet Applications to use.
     * See {@link DocumentSheetConfig.unregisterSheet} for details.
     * @see DocumentSheetConfig.unregisterSheet
     *
     * @example <caption>Deregister the default ActorSheet subclass to replace it with others.</caption>
     * Actors.unregisterSheet("core", ActorSheet);
     */
    static unregisterSheet(...args: DropFirst<Parameters<typeof DocumentSheetConfig.unregisterSheet>>): void;

    /**
     * Return an array of currently registered sheet classes for this Document type.
     * @remarks
     * This is documented to return only {@link DocumentSheet}s but {@link DrawingConfig} is just a
     * {@link FormApplication}. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6454.
     */
    static get registeredSheets(): FormApplication[];
  }

  namespace WorldCollection {
    interface FromCompendiumOptions<
      FolderOpt extends boolean = false,
      SortOpt extends boolean = true,
      OwnershipOpt extends boolean = false,
      IdOpt extends boolean = false,
      StateOpt extends boolean = false,
    > {
      /**
       * Add flags which track the import source
       * @defaultValue `false`
       */
      addFlags: boolean;

      /**
       * Clear the currently assigned folder
       * @defaultValue
       */
      clearFolder: FolderOpt;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort: SortOpt;

      /**
       * Clear document permissions
       * @defaultValue `true`
       */
      clearOwnership: OwnershipOpt;

      /**
       * Retain the Document id from the source Compendium
       * @defaultValue `false`
       */
      keepId: IdOpt;

      /** @remarks used by Scene#fromCompendium */
      clearState: StateOpt;
    }
  }
}

type DropFirst<T extends Array<unknown>> = T extends [unknown, ...infer V] ? V : T;
