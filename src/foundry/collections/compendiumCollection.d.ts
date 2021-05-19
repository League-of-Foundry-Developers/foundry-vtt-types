/**
 * A singleton Collection of Compendium-level Document objects within the Foundry Virtual Tabletop.
 * Each Compendium pack has its own associated instance of the CompendiumCollection class which contains its contents.
 */
declare class CompendiumCollection<T extends Entity = Entity> extends DocumentCollection<T> {
  /**
   * The amount of time that Document instances within this CompendiumCollection are held in memory.
   * Accessing the contents of the Compendium pack extends the duration of this lifetime.
   * @defaultValue `300`
   */
  static CACHE_LIFETIME_SECONDS: number;

  /**
   * The named game setting which contains Compendium configurations.
   * @defaultValue `'compendiumConfiguration'`
   */
  static CONFIG_SETTING: string;

  /**
   * Create a new Compendium Collection using provided metadata.
   * @param metadata -  The compendium metadata used to create the new pack
   * @param options -  Additional options which modify the Compendium creation request
   */
  static createCompendium(
    metadata: Compendium.Metadata,
    options?: Compendium.Settings
  ): Promise<CompendiumCollection> | void;

  /**
   * @param metadata -  The compendium metadata, an object provided by game.data
   */
  constructor(metadata: Compendium.Metadata);

  /**
   * The compendium metadata which defines the compendium content and location
   */
  metadata: Compendium.Metadata;

  /**
   * A subsidiary collection which contains the more minimal index of the pack
   */
  index: foundry.utils.Collection<Compendium.IndexEntry>;

  /**
   * A debounced function which will clear the contents of the Compendium pack if it is not accessed frequently.
   */
  private _flush(): void;

  /**
   * The canonical Compendium name - comprised of the originating package and the pack name
   */
  get collection(): string;

  /**
   * Access the compendium configuration data for this pack
   */
  get config(): Compendium.Settings;

  /**
   * Track whether the Compendium Collection is locked for editing
   */
  get locked(): boolean;

  /**
   * Track whether the Compendium Collection is private
   */
  get private(): boolean;

  /**
   * A convenience reference to the label which should be used as the title for the Compendium pack.
   */
  get title(): string;

  /**
   * Load the Compendium index and cache it as the keys and values of the Collection.
   */
  getIndex(): Promise<CompendiumCollection<T>['index']>;

  /**
   * Get a single Document from this Compendium by ID.
   * The document may already be locally cached, otherwise it is retrieved from the server.
   * @param id -              The requested Document id
   * @returns     The retrieved Document instance
   */
  getDocument(id: string): Promise<T>;

  /**
   * Load multiple documents from the Compendium pack using a provided query object.
   * @param query -           A database query used to retrieve documents from the underlying database
   * @returns   The retrieved Document instances
   */
  getDocuments(query?: object): Promise<T[]>; // TODO: Type the query object

  /**
   * Import a Document into this Compendium Collection.
   * @param document -    The existing Document you wish to import
   * @returns   The imported Document instance
   */
  importDocument(document: T): Promise<T>;

  /**
   * Fully import the contents of a Compendium pack into a World folder.
   * @returns    The imported Documents, now existing within the World
   */
  importAll({ folderId, folderName }?: { folderId?: string | null; folderName?: string }): Promise<T[]>;

  /**
   * Add a Document to the index, capturing it's relevant index attributes
   * @param document -       The document to index
   */
  indexDocument(document: T): void;

  /**
   * Assign configuration metadata settings to the compendium pack
   * @param settings -  The object of compendium settings to define
   * @returns          A Promise which resolves once the setting is updated
   */
  configure(settings?: Compendium.Settings): Promise<unknown>; // TODO: Returns a setting

  /**
   * Delete an existing world-level Compendium Collection.
   * This action may only be performed for world-level packs by a Gamemaster User.
   */
  deleteCompendium(): Promise<this>;

  /**
   * Duplicate a compendium pack to the current World.
   */
  duplicateCompendium({ label }?: { label?: string }): Promise<this>;

  /**
   * Validate that the current user is able to modify content of this Compendium pack
   */
  private _assertUserCanModify: boolean;

  /**
   * Request that a Compendium pack be migrated to the latest System data template
   */
  migrate(options: Compendium.Settings): Promise<this>;

  /**
   * Follow-up actions taken when Documents within this Compendium pack are modified
   */
  private _onModifyContents(documents: T[], options: Entity.UpdateOptions, userId: string): void;

  /**
   * @deprecated since 0.9.0
   */
  get entity(): string;

  /**
   * @deprecated since 0.9.0
   */
  getContent(): Promise<T[]>;

  /**
   * @deprecated since 0.9.0
   */
  getEntry(id: string): Promise<T['_data']>;

  /**
   * @deprecated since 0.9.0
   */
  getEntity(id: string): Promise<T>;

  /**
   * @deprecated since 0.9.0
   */
  importEntity(document: T): Promise<T>;

  /**
   * @deprecated since 0.9.0
   */
  createEntity(data: T['_data'], options?: {}): Promise<T>;

  /**
   * @deprecated since 0.9.0
   */
  updateEntity(data: T['_data'], options?: {}): Promise<T>;

  /**
   * @deprecated since 0.9.0
   */
  deleteEntity(id: any, options?: {}): Promise<T>;
}
