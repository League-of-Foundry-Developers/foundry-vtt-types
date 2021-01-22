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
 * @param metadata - The compendium metadata, an object provided by game.data
 * @param options - Application rendering options
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
 */
declare class Compendium extends Application {
  _searchTime: number

  /**
   * The most recently retrieved index of the Compendium content
   * This index is not guaranteed to be current - call getIndex() to reload the index
   */
  index: string[]

  /**
   * Track whether the compendium pack is locked for editing
   */
  locked: boolean

  /**
   * The compendium metadata which defines the compendium content and location
   */
  metadata: any

  /**
   * Track whether the compendium pack is publicly visible
   */
  public: boolean

  // Internal flags
  searchString: string | null

  constructor (metadata: object, options: object);

  /**
   * The canonical Compendium name - comprised of the originating package and the pack name
   * @returns The canonical collection name
   */
  get collection (): string;

  /**
   * The Entity type which is allowed to be stored in this collection
   */
  get entity (): string;

  /**
   * Create a new Compendium pack using provided
   * @param metadata - The compendium metadata used to create the new pack
   */
  static create (metadata: object): Promise<Compendium>;

  /**
   * Render the ContextMenu which applies to each compendium entry
   */
  _contextMenu (html: JQuery | HTMLElement): void;

  /**
   * Allow data transfer events to be dragged over this as a drop zone
   */
  _onDragOver (event: Event | JQuery.Event): boolean;

  /**
   * Handle a new drag event from the compendium, create a placeholder token for dropping the item
   */
  _onDragStart (event: Event | JQuery.Event): boolean;

  /**
   * Handle data being dropped into a Compendium pack
   */
  _onDrop (event: Event | JQuery.Event): Promise<boolean>;

  /**
   * Handle opening a single compendium entry by invoking the configured entity class and its sheet
   */
  _onEntry (entryId: string): Promise<void>;

  /**
   * Handle compendium filtering through search field
   * Toggle the visibility of indexed compendium entries by name (for now) match
   */
  _onSearch (searchString: string): void;

  /**
   * Cast entry data to an Entity class
   */
  _toEntity (entryData?: object): Entity;

  /**
   * Register event listeners for Compendium directories
   */
  activateListeners (html: JQuery | HTMLElement): void;

  /**
   * Customize Compendium closing behavior to toggle the sidebar folder status icon
   */
  close (): any;

  /**
   * Create a new Entity within this Compendium Pack using provided data
   * @param data - Data with which to create the entry
   * @returns A Promise which resolves to the created Entity once the operation is complete
   */
  createEntity (data: any): Promise<Entity>;

  /**
   * Delete a world Compendium pack
   * This is only allowed for world-level packs by a GM user
   */
  delete (): Promise<Compendium>;

  /**
   * Delete a single Compendium entry by its provided _id
   * @param id - The entry ID to delete
   * @returns A Promise which resolves to the deleted entry ID once the operation is complete
   */
  deleteEntity (id: string): Promise<string>;

  /**
   * Get the complete set of content for this compendium, loading all entries in full
   * Returns a Promise that resolves to an Array of entries
   */
  getContent (): Promise<Entity[]>;

  /**
   * Get a single Compendium entry as an Entity instance
   * @param entryId - The compendium entry ID to load and instantiate
   * @returns A Promise containing the returned Entity, if it exists, otherwise null
   */
  getEntity (entryId: string): Promise<Entity>;

  /**
   * Get a single Compendium entry as an Object
   * @param entryId - The compendium entry ID to retrieve
   *
   * @returns A Promise containing the return entry data, or null
   */
  getEntry (entryId: string): Promise<any>;

  /**
   * Get the Compendium index
   * Contains names, images and IDs of all data in the compendium
   *
   * @returns A Promise containing an index of all compendium entries
   */
  getIndex (): Promise<any[]>;

  /**
   * Import a new Entity into a Compendium pack
   * @param entity - The Entity instance you wish to import
   * @returns A Promise which resolves to the created Entity once the operation is complete
   */
  importEntity (entity: Entity): Promise<Entity>;

  /**
   * Request that a Compendium pack be migrated to the latest System data template
   */
  migrate (options: any): Promise<Compendium>;

  /**
   * Update a single Compendium entry programmatically by providing new data with which to update
   * @param data - The incremental update with which to update the Entity. Must contain the _id
   * @param options - Additional options which modify the update request
   * @returns A Promise which resolves with the updated Entity once the operation is complete
   */
  updateEntity (data: any, options?: any): Promise<Entity>;
}
