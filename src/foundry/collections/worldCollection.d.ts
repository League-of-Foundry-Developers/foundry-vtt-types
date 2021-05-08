/**
 * A singleton Collection of world-level Document objects within the Foundry Virtual Tabletop.
 * Each primary Document type has an associated subclass of WorldCollection which contains them.
 *
 * @param data -     An array of data objects from which to create Document instances
 */
declare abstract class WorldCollection<T extends Entity = Entity> extends DocumentCollection<T> {
  /**
   * Return a reference to the singleton instance of this EntityCollection, or
   * null if it has not yet been created.
   */
  static get instance(): DocumentCollection<Entity> | null;

  constructor(data?: T['_data'][]);

  /**
   * The source data is, itself, a mapping of IDs to data objects
   */
  _source: T['_data'][];

  /**
   * Return a reference to the SidebarDirectory application for this
   * EntityCollection, or null if it has not yet been created.
   */
  get directory(): SidebarDirectory | null;

  /**
   * Import a Document from a Compendium collection, adding it to the current World.
   * @param pack - The CompendiumCollection instance from which to import
   * @param id -             The ID of the compendium entry to import
   * @param updateData -   Optional additional data used to modify the imported Document before it is created
   * @param options -      Optional arguments passed to the Document.create method
   * @returns    The imported Document instance
   */
  importFromCompendium(
    pack: CompendiumCollection,
    id: string,
    updateData?: DeepPartial<T['_data']>,
    options?: Entity.CreateOptions
  ): Promise<T>;

  /**
   * Apply data transformations when importing an Entity from a Compendium pack
   * @param data - The original Compendium entry data
   * @returns The processed data ready for Entity creation
   */
  fromCompendium(data: DeepPartial<T['_data']>): DeepPartial<T['_data']>;

  /**
   * @deprecated since 0.8.0
   */
  insert(document: T): void;

  /**
   * @deprecated since 0.8.0
   */
  remove(id: string): void;

  /**
   * @deprecated since 0.8.0
   */
  get entities(): T[];

  /**
   * @deprecated since 0.8.0
   */
  get object(): ConstructorOf<T>;

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
   * @deprecated since 0.8.0
   */
  importFromCollection(
    collection: string,
    entryId: string,
    updateData?: DeepPartial<T['_data']>,
    options?: Entity.CreateOptions
  ): Promise<T>;
}
