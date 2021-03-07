/**
 * An iterable container of Entity objects within the Foundry Virtual Tabletop framework.
 * Each Entity type has it's own subclass of EntityCollection, which defines the abstract interface.
 * @typeParam T - The type of Entities in the EntityCollection
 */
declare abstract class EntityCollection<T extends Entity = Entity> extends Collection<T> {
  /**
   * @param data - An Array of Entity data from which to create instances
   */
  constructor(data: T['data'][]);

  /**
   * The source data is, itself, a mapping of IDs to data objects
   */
  _source: T['data'][];

  /**
   * An Array of application references which will be automatically updated when
   * the collection content changes
   */
  apps: Application[];

  /**
   * Initialize the Map object and all its contained entities
   * @param data -
   */
  protected _initialize(data: T['data'][]): void;

  /**
   * An array of all the Entities in the EntityCollection.
   * This is an alias for {@link Collection#entries}.
   */
  get entities(): T[];

  /**
   * Render any Applications associated with this EntityCollection
   * @param args -
   * @returns A reference to the rendered EntityCollection
   * @see {@link Application.render}
   */
  render(...args: Parameters<Application['render']>): this;

  /**
   * The EntityCollection name
   */
  get name(): string;

  /**
   * Return a reference to the SidebarDirectory application for this
   * EntityCollection, or null if it has not yet been created.
   */
  get directory(): SidebarDirectory | null;

  /**
   * Return a reference to the base Entity name which is contained within this
   * EntityCollection.
   */
  abstract get entity(): string;

  /**
   * Return a reference to the singleton instance of this EntityCollection, or
   * null if it has not yet been created.
   */
  static get instance(): EntityCollection<Entity> | null;

  /**
   * Return a reference to the Entity subclass which should be used when
   * creating elements of this EntityCollection.
   * This should always be an explicit reference to the class which is used in
   * this game to represent the entity, and not the base implementation of that
   * entity type.
   */
  get object(): ConstructorOf<T>;

  /**
   * Add a new Entity to the EntityCollection, asserting that they are of the
   * correct type.
   * @param entity - The entity instance to add to the collection
   */
  insert(entity: T): void;

  /**
   * Remove an Entity from the EntityCollection by its ID.
   * @param id - The entity ID which should be removed
   */
  remove(id: string): void;

  /**
   * Import an Entity from a compendium collection, adding it to the current
   * World.
   * @param collection - The name of the pack from which to import
   * @param entryId    - The ID of the compendium entry to import
   * @param updateData - Optional additional data used to modify the imported
   *                     Entity before it is created
   *                     (default: `{}`)
   * @param options    - Optional arguments passed to the Entity.create method
   *                     (default: `{}`)
   * @returns A Promise containing the imported Entity
   */
  importFromCollection(
    collection: string,
    entryId: string,
    updateData?: DeepPartial<T['data']>,
    options?: Entity.CreateOptions
  ): Promise<T>;

  /**
   * Apply data transformations when importing an Entity from a Compendium pack
   * @param data - The original Compendium entry data
   * @returns The processed data ready for Entity creation
   */
  fromCompendium(data: DeepPartial<T['data']>): DeepPartial<T['data']>;

  /**
   * Update all objects in this EntityCollection with a provided transformation.
   * Conditionally filter to only apply to Entities which match a certain
   * condition.
   * @param transformation - An object of data or function to apply to all
   *                         matched objects
   * @param condition      - A function which tests whether to target each object
   *                         (default: `null`)
   * @param options        - Additional options passed to Entity.update
   * @returns An array of updated data once the operation is complete
   */
  updateAll(
    transformation: DeepPartial<T['data']> | ((obj: T) => DeepPartial<T['data']>),
    condition?: (obj: T) => boolean,
    options?: Entity.UpdateOptions
  ): Promise<T[]>;
}
