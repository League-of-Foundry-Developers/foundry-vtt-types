import { ConfiguredDocumentClass, DocumentConstructor } from '../../../../types/helperTypes';

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
    constructor(data?: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>['data']['_source'][]);

    readonly _source: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>['data']['_source'][];

    /**
     * Initialize the WorldCollection object by constructing its contained Document instances
     */
    protected _initialize(): void;

    /**
     * @remarks In the abstract {@link WorldCollection}, this actually returns `null` but all deriving classes implement it properly.
     */
    get documentName(): ConfiguredDocumentClass<T>['metadata']['name'];

    /**
     * The base Document type which is contained within this WorldCollection
     * @defaultValue `null`
     * @remarks
     * All deriving classes must set this to the string matching the name of the document type they contain because it
     * is used as value for {@link WorldCollection#documentName}.
     */
    static documentName: string | null;

    /**
     * Return a reference to the SidebarDirectory application for this WorldCollection, or null if it has not yet been created.
     * @remarks
     * In the case where `Lowercase<Name>` is not a property of {@link ui}, this actually always returns `null` but
     * {@link RollTables} overrides this so we need to allow a wider return type.
     */
    get directory(): Lowercase<Name> extends keyof typeof ui
      ? typeof ui[Lowercase<Name>]
      : null | SidebarDirectory<ConfiguredDocumentClass<T>['metadata']['name']> | undefined;

    /**
     * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
     */
    static get instance(): WorldCollection<DocumentConstructor, any>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

    /** @override */
    set(id: string, document: StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>): this;

    delete: (id: string) => boolean;

    /**
     * Import a Document from a Compendium collection, adding it to the current World.
     * @param pack       - The CompendiumCollection instance from which to import
     * @param id         - The ID of the compendium entry to import
     * @param updateData - Optional additional data used to modify the imported Document before it is created
     * @param options    - Optional arguments passed to the Document.create method
     * @returns The imported Document instance
     */
    importFromCompendium(
      pack: any, // TODO: CompendiumCollection
      id: string,
      updateData?: DeepPartial<InstanceType<ConfiguredDocumentClass<T>>['data']['_source']>,
      options?: DocumentModificationContext
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClass<T>>>>;

    /**
     * Apply data transformations when importing a Document from a Compendium pack
     * @param document - The source Document, or a plain data object
     * @returns The processed data ready for world Document creation
     */
    fromCompendium(
      document: InstanceType<ConfiguredDocumentClass<T>> | InstanceType<ConfiguredDocumentClass<T>>['data']['_source']
    ): Omit<InstanceType<ConfiguredDocumentClass<T>>['data']['_source'], '_id' | 'folder'>;

    /**
     * The WorldCollection#insert method is deprecated in favor of the WorldCollection#set method and will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    insert(document: InstanceType<ConfiguredDocumentClass<T>>): this;

    /**
     * The WorldCollection#remove method is deprecated in favor of the WorldCollection#delete method and will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    remove(id: string): boolean;

    /**
     * The WorldCollection#entities property is deprecated in favor of the Collection#contents attribute and will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    get entities(): this['contents'];

    /**
     * The WorldCollection#object property has been deprecated in favor of WorldCollection#documentClass. Support will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    get object(): this['documentClass'];

    /**
     * The WorldCollection#importFromCollection method has been deprecated in favor of WorldCollection#importFromCompendium. Support for the old method name will be removed in 0.9.0
     * @deprecated since 0.8.0
     */
    importFromCollection(
      packName: string,
      ...args: Parameters<this['importFromCompendium']> extends [any, ...infer U] ? U : never
    ): ReturnType<this['importFromCompendium']>;
  }
}
