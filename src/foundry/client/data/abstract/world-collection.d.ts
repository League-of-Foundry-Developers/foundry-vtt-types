import { ConfiguredDocumentClass, DocumentConstructor } from "../../../../types/helperTypes";
import type { DOCUMENT_TYPES } from "../../../common/constants.mjs.js";

declare global {
  /**
   * A collection of world-level Document objects with a singleton instance per primary Document type.
   * Each primary Document type has an associated subclass of WorldCollection which contains them.
   * @see {@link Game#collections}
   */
  abstract class WorldCollection<T extends DocumentConstructor, Name extends string> extends DocumentCollection<
    T,
    Name
  > {
    /**
     *
     * @param data - An array of data objects from which to create Document instances
     *               (default: `[]`)
     */
    constructor(data?: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>["data"]["_source"][]);

    readonly _source: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>["data"]["_source"][];

    /**
     * Initialize the WorldCollection object by constructing its contained Document instances
     * @internal
     */
    protected _initialize(): void;

    /**
     * @remarks In the abstract {@link WorldCollection}, this actually returns `null` but all deriving classes implement it properly.
     */
    get documentName(): ConfiguredDocumentClass<T>["metadata"]["name"];

    /**
     * The base Document type which is contained within this WorldCollection
     * @defaultValue `null`
     * @remarks
     * All deriving classes must set this to the string matching the name of the document type they contain because it
     * is used as value for {@link WorldCollection#documentName}.
     */
    static documentName: string | null;

    /**
     * Return a reference to the SidebarDirectory application for this WorldCollection.
     * @remarks
     * In the case where `Lowercase<Name>` is not a property of {@link ui}, this actually always returns `undefined`,
     * but {@link RollTables} overrides this, so we need to allow a wider return type.
     */
    get directory(): Lowercase<Name> extends keyof typeof ui
      ? typeof ui[Lowercase<Name>]
      :
          | (ConfiguredDocumentClass<T>["metadata"]["name"] extends DOCUMENT_TYPES
              ? SidebarDirectory<ConfiguredDocumentClass<T>["metadata"]["name"]>
              : never)
          | SidebarTab
          | undefined;

    /**
     * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
     */
    static get instance(): WorldCollection<DocumentConstructor, any>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

    override set(id: string, document: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>): this;

    delete: (id: string) => boolean;

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
    importFromCompendium(
      pack: CompendiumCollection<
        CompendiumCollection.Metadata & { type: ConfiguredDocumentClass<T>["metadata"]["name"] }
      >,
      id: string,
      updateData?: DeepPartial<InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"]> | undefined,
      options?: (DocumentModificationContext & WorldCollection.FromCompendiumOptions) | undefined
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>>;

    /**
     * Apply data transformations when importing a Document from a Compendium pack
     * @param document - The source Document, or a plain data object
     * @param options  - Additional options which modify how the document is imported
     *                   (default: `{}`)
     * @returns The processed data ready for world Document creation
     */
    fromCompendium(
      document: InstanceType<ConfiguredDocumentClass<T>> | InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"],
      options?: WorldCollection.FromCompendiumOptions | undefined
    ): Omit<InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"], "_id" | "folder">;

    /**
     * Prepare a document from an outside source for import into this collection.
     * @param data - The data to be prepared.
     * @returns The prepared data.
     */
    prepareForImport(
      data: InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"]
    ): Omit<InstanceType<ConfiguredDocumentClass<T>>["data"]["_source"], "_id" | "folder">;

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
     * See {@link DocumentSheetConfig.unregisterSheet} for detauls.
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
    interface FromCompendiumOptions {
      /**
       * Add flags which track the import source
       * @defaultValue `false`
       */
      addFlags?: boolean | undefined;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort?: boolean | undefined;

      /**
       * Clear document permissions
       * @defaultValue `true`
       */
      clearPermissions?: boolean | undefined;

      /**
       * Retain the Document id from the source Compendium
       * @defaultValue `false`
       */
      keepId?: boolean | undefined;
    }
  }
}

type DropFirst<T extends Array<unknown>> = T extends [unknown, ...infer V] ? V : T;
