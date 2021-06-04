/**
 * The Compendium class provides an interface for interacting with compendium packs which are
 * collections of similar Entities which are stored outside of the world database but able to
 * be easily imported into an active session.
 *
 * When the game session is initialized, each available compendium pack is constructed and
 * added to the `game.packs`.
 *
 * Each Compendium is distinctly referenced using its canonical "collection" name which is a
 * unique string that contains the package name which provides the compendium as well as the
 * name of the pack within that package. For example, in the D&D5e system, the compendium pack
 * which provides the spells available within the SRD has the collection name "dnd5e.spells".
 *
 * @example
 * ```javascript
 * // Let's learn the collection names of all the compendium packs available within a game
 * game.packs.map(p => p.collection);
 *
 * // Suppose we are working with a particular pack named "dnd5e.spells"
 * const pack = game.packs.find(p => p.collection === "dnd5e.spells");
 *
 * // We can load the index of the pack which contains all entity IDs, names, and image icons
 * pack.getIndex().then(index => console.log(index));
 *
 * // We can find a specific entry in the compendium by its name
 * let entry = pack.index.find(e => e.name === "Acid Splash");
 *
 * // Given the entity ID of "Acid Splash" we can load the full Entity from the compendium
 * pack.getEntity(entry.id).then(spell => console.log(spell));
 * ```
 * @example
 * ```javascript
 * // We often may want to programmatically create new Compendium content
 * // Let's start by creating a custom spell as an Item instance
 * let itemData = {name: "Custom Death Ray", type: "Spell"};
 * let item = new Item(itemData);
 *
 * // Once we have an entity for our new Compendium entry we can import it, if the pack is unlocked
 * pack.importEntity(item);
 *
 * // When the entity is imported into the compendium it will be assigned a new ID, so let's find it
 * pack.getIndex().then(index => {
 *   let entry = index.find(e => e.name === itemData.name));
 *   console.log(entry);
 * });
 *
 * // If we decide to remove an entry from the compendium we can do that by the entry ID
 * pack.removeEntry(entry.id);
 * ```
 * @typeParam P - the type of the options object
 */
declare class Compendium<P extends Application.Options = Application.Options> extends Application<P> {
  /**
   * @param metadata - The compendium metadata, an object provided by game.data
   * @param options  - Application rendering options
   */
  constructor(metadata: Compendium['metadata'], options?: Partial<P>);

  /**
   * The compendium metadata which defines the compendium content and location
   */
  metadata: Compendium.Metadata;

  /**
   * Track whether the compendium pack is locked for editing
   */
  locked: boolean;

  /**
   * Track whether the compendium pack is private
   * @defaultValue `false`
   */
  private: boolean;

  /**
   * The most recently retrieved index of the Compendium content
   * This index is not guaranteed to be current - call getIndex() to reload the index
   */
  index: Compendium.IndexEntry[];

  /** @override */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  getTitle(): string;

  /**
   * The canonical Compendium name - comprised of the originating package and the pack name
   * @returns The canonical collection name
   */
  get collection(): string;

  /**
   * The Entity type which is allowed to be stored in this collection
   */
  get entity(): string;

  /**
   * A reference to the Entity class object contained within this Compendium pack
   */
  get cls(): ConstructorOf<Entity>;

  /** @override */
  getData(options: Application.RenderOptions): Promise<any>; // TODO

  /** @override */
  close(): Promise<void>;

  /**
   * Create a new Compendium pack using provided
   * @param metadata - The compendium metadata used to create the new pack
   * @param options  - Additional options which modify the Compendium creation request
   */
  static create(metadata: Compendium.Metadata, options?: Record<string, any>): Promise<Compendium>;

  /**
   * Assign configuration metadata settings to the compendium pack
   * @param settings - The object of compendium settings to define
   * @returns A Promise which resolves once the setting is updated
   */
  configure(settings?: Partial<Compendium.Settings>): Promise<Compendium.Settings>;

  /**
   * Delete a world Compendium pack
   * This is only allowed for world-level packs by a GM user
   */
  delete(): Promise<this>;

  /**
   * Duplicate a compendium pack to the current World
   */
  duplicate({ label }?: { label?: string }): Promise<Compendium>;

  /**
   * Get the Compendium index
   * Contains names, images and IDs of all data in the compendium
   *
   * @returns A Promise containing an index of all compendium entries
   */
  getIndex(): Promise<Compendium.IndexEntry[]>;

  /**
   * Get the complete set of content for this compendium, loading all entries in full
   * Returns a Promise that resolves to an Array of entries
   */
  getContent(): Promise<Entity[]>;

  /**
   * Get a single Compendium entry as an Object
   * @param entryId - The compendium entry ID to retrieve
   *
   * @returns A Promise containing the return entry data, or null
   */
  getEntry(entryId: string): Promise<any | null>; // TODO

  /**
   * Get a single Compendium entry as an Entity instance
   * @param entryId - The compendium entry ID to load and instantiate
   * @returns A Promise containing the returned Entity, if it exists, otherwise null
   */
  getEntity(entryId: string): Promise<Entity | null>;

  /**
   * Fully import the contents of a Compendium pack into a World folder.
   * @param folderId   - An existing Folder _id to use.
   *                     (default: `null`)
   * @param folderName - A new Folder name to create.
   *                     (default: `''`)
   */
  importAll({
    folderId,
    folderName
  }: {
    folderId?: string | null;
    folderName?: string;
  }): Promise<Entity | Entity[] | null>;

  /**
   * Cast entry data to an Entity class
   */
  protected _toEntity(entryData?: any): Entity; // TODO

  /**
   * Import a new Entity into a Compendium pack
   * @param entity - The Entity instance you wish to import
   * @returns A Promise which resolves to the created Entity once the operation is complete
   */
  importEntity(entity: Entity): Promise<Entity>;

  /**
   * Create a new Entity within this Compendium Pack using provided data
   * @param data - Data with which to create the entry
   * @returns A Promise which resolves to the created Entity once the operation is complete
   */
  createEntity(
    data: Record<string, any> | Record<string, any>[],
    options?: Record<string, any>
  ): Promise<Entity | Entity[]>;

  /**
   * Update a single Compendium entry programmatically by providing new data with which to update
   * @param data    - The incremental update with which to update the Entity. Must contain the _id
   * @param options - Additional options which modify the update request
   * @returns A Promise which resolves with the updated Entity once the operation is complete
   */
  updateEntity(data: any | any[], options?: Record<string, any> & { entity: Entity }): Promise<any[]>; // TODO

  /**
   * Delete a single Compendium entry by its provided _id
   * @param id - The entry ID to delete
   * @returns A Promise which resolves to the deleted entry ID once the operation is complete
   */
  deleteEntity(id: string | string[]): Promise<string[]>;

  /**
   * Request that a Compendium pack be migrated to the latest System data template
   */
  migrate(options: Record<string, unknown>): Promise<Compendium>;

  /**
   * Validate that the current user is able to modify content of this Compendium pack
   * @param requireGM       - (default: `true`)
   * @param requireUnlocked - (default: `true`)
   */
  protected _assertUserCanModify({
    requireGM,
    requireUnlocked
  }?: {
    requireGM?: boolean;
    requireUnlocked?: boolean;
  }): boolean;

  /**
   * Register event listeners for Compendium directories
   */
  activateListeners(html: JQuery): void;

  /** @override */
  protected _onSearchFilter(event: KeyboardEvent, query: string, html: HTMLElement): void;

  /**
   * Handle opening a single compendium entry by invoking the configured entity class and its sheet
   * @param entryId - The compendium ID of the entry to display
   */
  protected _onEntry(entryId: string): Promise<void>;

  /** @override */
  protected _canDragStart(selector: string | null): boolean;

  /** @override */
  protected _canDragDrop(selector: string | null): boolean;

  /** @override */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle data being dropped into a Compendium pack
   */
  protected _onDrop(event: DragEvent): Promise<false | Entity>;

  /**
   * Render the ContextMenu which applies to each compendium entry
   */
  _contextMenu(html: JQuery): void;

  static CONFIG_SETTING: 'compendiumConfiguration';
}

declare namespace Compendium {
  interface IndexEntry {
    _id: string;
    name: string;
    img?: string;
  }

  interface Metadata {
    name: string;
    label: string;
    system?: string | string[];
    module?: string;
    path: string;
    entity: 'Actor' | 'Item' | 'JournalEntry' | 'Macro' | 'Playlist' | 'RollTable' | 'Scene';
    package: string;
    absPath: string;
  }

  interface Data {
    collection: string;
    cssClass: string;
    index: Array<IndexEntry & { img: string }>;
  }

  interface Settings {
    private: boolean;
    locked: boolean;
  }
}
